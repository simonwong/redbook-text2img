export interface ImageAssetStore {
  delete: (id: string) => Promise<void>;
  get: (id: string) => Promise<Blob | null>;
  list: () => Promise<string[]>;
  put: (blob: Blob) => Promise<string>;
}

function generateAssetId(): string {
  let id = "";
  while (id.length < 10) {
    const bytes = crypto.getRandomValues(new Uint8Array(10 - id.length));
    for (const byte of bytes) {
      if (byte < 252) {
        id += (byte % 36).toString(36);
      }
    }
  }
  return id;
}

export function createMemoryImageStore(): ImageAssetStore {
  const assets = new Map<string, Blob>();
  return {
    delete(id) {
      assets.delete(id);
      return Promise.resolve();
    },
    get(id) {
      return Promise.resolve(assets.get(id) ?? null);
    },
    list() {
      return Promise.resolve([...assets.keys()]);
    },
    put(blob) {
      const id = generateAssetId();
      assets.set(id, blob);
      return Promise.resolve(id);
    },
  };
}

export async function createIndexedDBImageStore(): Promise<ImageAssetStore> {
  const database = await new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open("redbook-image-assets", 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore("assets");
    };
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error("图片库被其他标签页占用"));
    request.onsuccess = () => resolve(request.result);
  });
  database.onversionchange = () => database.close();

  function transact<T>(
    mode: IDBTransactionMode,
    operation: (store: IDBObjectStore) => IDBRequest<T>
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const transaction = database.transaction("assets", mode);
      const request = operation(transaction.objectStore("assets"));
      transaction.oncomplete = () => resolve(request.result);
      transaction.onabort = () => reject(transaction.error ?? request.error);
      transaction.onerror = () => reject(transaction.error ?? request.error);
    });
  }

  return {
    async delete(id) {
      await transact("readwrite", (store) => store.delete(id));
    },
    async get(id) {
      return (
        (await transact<Blob | undefined>("readonly", (store) =>
          store.get(id)
        )) ?? null
      );
    },
    async list() {
      return (await transact("readonly", (store) => store.getAllKeys())).map(
        String
      );
    },
    async put(blob) {
      const id = generateAssetId();
      await transact("readwrite", (store) => store.put(blob, id));
      return id;
    },
  };
}
