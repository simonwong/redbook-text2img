import type { CustomThemeRecord } from "./types";

const DATABASE_NAME = "redbook-text2img-custom-themes";
const DATABASE_VERSION = 1;
const STORE_NAME = "theme-images";

function supportsIndexedDb(): boolean {
  return typeof indexedDB !== "undefined";
}

function openDatabase(): Promise<IDBDatabase> {
  if (!supportsIndexedDb()) {
    return Promise.reject(new Error("当前浏览器不支持本地主题存储"));
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

    request.onerror = () =>
      reject(request.error ?? new Error("自定义主题数据库打开失败"));

    request.onupgradeneeded = () => {
      const database = request.result;

      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
  });
}

async function withStore<T>(
  mode: IDBTransactionMode,
  executor: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> {
  const database = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, mode);
    const store = transaction.objectStore(STORE_NAME);
    const request = executor(store);

    request.onerror = () =>
      reject(request.error ?? new Error("自定义主题存储操作失败"));
    request.onsuccess = () => resolve(request.result);

    transaction.oncomplete = () => database.close();
    transaction.onerror = () => {
      reject(transaction.error ?? new Error("自定义主题存储事务失败"));
      database.close();
    };
    transaction.onabort = () => {
      reject(transaction.error ?? new Error("自定义主题存储事务已中止"));
      database.close();
    };
  });
}

export function getCustomThemeImage(
  imageStorageKey: string
): Promise<string | undefined> {
  if (!supportsIndexedDb()) {
    return Promise.resolve(undefined);
  }

  return withStore("readonly", (store) => store.get(imageStorageKey));
}

export function saveCustomThemeImage(
  imageStorageKey: string,
  imageDataUrl: string
): Promise<void> {
  return withStore("readwrite", (store) =>
    store.put(imageDataUrl, imageStorageKey)
  ).then(() => undefined);
}

export function deleteCustomThemeImage(imageStorageKey: string): Promise<void> {
  if (!supportsIndexedDb()) {
    return Promise.resolve();
  }

  return withStore("readwrite", (store) => store.delete(imageStorageKey)).then(
    () => undefined
  );
}

export async function hydrateCustomThemeRecords(
  customThemes: CustomThemeRecord[]
): Promise<CustomThemeRecord[]> {
  const hydratedThemes: CustomThemeRecord[] = [];

  for (const theme of customThemes) {
    const imageStorageKey = theme.imageStorageKey ?? theme.id;
    let backgroundImageDataUrl = theme.backgroundImageDataUrl;

    if (backgroundImageDataUrl) {
      try {
        await saveCustomThemeImage(imageStorageKey, backgroundImageDataUrl);
      } catch {
        // Keep the in-memory image data if IndexedDB migration fails.
      }
    } else {
      backgroundImageDataUrl = await getCustomThemeImage(imageStorageKey);
    }

    if (!backgroundImageDataUrl) {
      continue;
    }

    hydratedThemes.push({
      ...theme,
      backgroundImageDataUrl,
      imageStorageKey,
    });
  }

  return hydratedThemes;
}
