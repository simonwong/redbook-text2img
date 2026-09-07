import { compressContentImage } from "./compress";
import {
  createIndexedDBImageStore,
  createMemoryImageStore,
  type ImageAssetStore,
} from "./store";

type ImageSnapshot = { status: "ready"; url: string } | { status: "missing" };
const snapshots = new Map<string, ImageSnapshot>();
const pending = new Map<string, Promise<void>>();
const listeners = new Set<() => void>();
const memory = createMemoryImageStore();
let persistent: Promise<ImageAssetStore | null> | undefined;
let sessionOnly = false;

function emit() {
  for (const listener of listeners) {
    listener();
  }
}

function fallback() {
  sessionOnly = true;
  emit();
  return null;
}

function database() {
  persistent ??= createIndexedDBImageStore().catch(fallback);
  return persistent;
}

function cache(id: string, blob: Blob | null) {
  snapshots.set(
    id,
    blob
      ? { status: "ready", url: URL.createObjectURL(blob) }
      : { status: "missing" }
  );
  emit();
}

export const imageAssets = {
  async import(file: Blob): Promise<string> {
    const blob = await compressContentImage(file);
    const store = await database();
    let id: string;
    try {
      id = await (sessionOnly ? memory : (store ?? memory)).put(blob);
    } catch {
      fallback();
      id = await memory.put(blob);
    }
    cache(id, blob);
    return id;
  },
  isSessionOnly: () => sessionOnly,
  load(id: string): Promise<void> {
    if (snapshots.has(id)) {
      return Promise.resolve();
    }
    const existing = pending.get(id);
    if (existing) {
      return existing;
    }
    const request = (async () => {
      const store = await database();
      const blob =
        (await memory.get(id)) ??
        (await store?.get(id).catch(() => {
          fallback();
          return null;
        })) ??
        null;
      cache(id, blob);
    })().finally(() => pending.delete(id));
    pending.set(id, request);
    return request;
  },
  snapshot: (id: string) => snapshots.get(id),
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};
