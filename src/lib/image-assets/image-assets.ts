import { compressContentImage } from "./compress";
import {
  createIndexedDBImageStore,
  createMemoryImageStore,
  type ImageAssetStore,
} from "./store";

type ImageSnapshot = { status: "ready"; url: string } | { status: "missing" };
const failedReads = new Set<string>();
const missingSnapshot = { status: "missing" } as const;
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
  persistent ??= createIndexedDBImageStore().catch(() => {
    persistent = undefined;
    return null;
  });
  return persistent;
}

function cache(id: string, blob: Blob | null) {
  failedReads.delete(id);
  snapshots.set(
    id,
    blob
      ? { status: "ready", url: URL.createObjectURL(blob) }
      : { status: "missing" }
  );
  emit();
}

export const imageAssets = {
  async delete(id: string): Promise<void> {
    await pending.get(id);
    const store = await database();
    await store?.delete(id);
    await memory.delete(id);
    snapshots.delete(id);
    cache(id, null);
  },
  async import(file: Blob): Promise<string> {
    const blob = await compressContentImage(file);
    const store = await database();
    let id: string;
    try {
      if (!store) {
        throw new Error("图片库不可用");
      }
      id = await (sessionOnly ? memory : store).put(blob);
    } catch {
      fallback();
      id = await memory.put(blob);
    }
    cache(id, blob);
    return id;
  },
  isSessionOnly: () => sessionOnly,
  async list(): Promise<string[]> {
    const store = await database();
    return [
      ...new Set([...(await memory.list()), ...((await store?.list()) ?? [])]),
    ];
  },
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
      try {
        const blob = (await memory.get(id)) ?? (await store?.get(id)) ?? null;
        if (!(blob || store)) {
          throw new Error("图片库不可用");
        }
        cache(id, blob);
      } catch {
        failedReads.add(id);
        emit();
      }
    })().finally(() => pending.delete(id));
    pending.set(id, request);
    return request;
  },
  snapshot: (id: string) =>
    snapshots.get(id) ?? (failedReads.has(id) ? missingSnapshot : undefined),
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};
