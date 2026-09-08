import "fake-indexeddb/auto";
import { afterEach, expect, it, vi } from "vitest";
import { useMarkdownContentStore } from "../../store/markdownContent";
import { imageAssets } from "./image-assets";

const pixels = new Blob(["pixels"], { type: "image/png" });

function canvasEnvironment() {
  vi.stubGlobal(
    "Image",
    class {
      naturalWidth = 1;
      naturalHeight = 1;
      onload: (() => void) | null = null;
      set src(_value: string) {
        queueMicrotask(() => this.onload?.());
      }
    }
  );
  vi.stubGlobal("createImageBitmap", async () => ({
    close: vi.fn(),
    height: 1,
    width: 1,
  }));
  vi.stubGlobal("document", {
    createElement: () => ({
      getContext: () => ({
        drawImage: vi.fn(),
        getImageData: () => ({ data: new Uint8ClampedArray([255, 0, 0, 0]) }),
      }),
      toBlob: (callback: (blob: Blob) => void) => callback(pixels),
    }),
  });
}
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

it("删除引用、重置、恢复正文均保留资产；显式清理移除列表与 ready 快照", async () => {
  canvasEnvironment();
  const id = await imageAssets.import(pixels);
  const content = `![说明](image:${id})`;
  useMarkdownContentStore.getState().setContent(content);
  expect(await imageAssets.list()).toContain(id);
  useMarkdownContentStore.getState().setContent("");
  useMarkdownContentStore.getState().resetContent();
  useMarkdownContentStore.getState().setContent(content);
  await imageAssets.load(id);
  const snapshot = imageAssets.snapshot(id);
  expect(snapshot?.status).toBe("ready");
  if (snapshot?.status !== "ready") {
    throw new Error("Image missing");
  }
  expect(await (await fetch(snapshot.url)).text()).toBe("pixels");
  await imageAssets.delete(id);
  expect(await imageAssets.list()).not.toContain(id);
  await imageAssets.load(id);
  expect(imageAssets.snapshot(id)).toEqual({ status: "missing" });
});

it("瞬时读取失败显示占位且可重试，不降级会话存储", async () => {
  vi.resetModules();
  const { IDBObjectStore } = await import("fake-indexeddb");
  const { createIndexedDBImageStore } = await import("./store");
  const store = await createIndexedDBImageStore();
  const id = await store.put(pixels);
  const { imageAssets: assets } = await import("./image-assets");
  const get = vi
    .spyOn(IDBObjectStore.prototype, "get")
    .mockImplementationOnce(() => {
      throw new Error("temporary read failure");
    });
  const changed = vi.fn();
  const unsubscribe = assets.subscribe(changed);
  await assets.load(id);
  expect(assets.snapshot(id)).toEqual({ status: "missing" });
  expect(assets.isSessionOnly()).toBe(false);
  expect(changed).toHaveBeenCalledTimes(1);
  await assets.load(id);
  expect(assets.snapshot(id)?.status).toBe("ready");
  get.mockRestore();
  unsubscribe();
});

it("写入失败才进入会话存储，图片仍可读与删除", async () => {
  vi.resetModules();
  canvasEnvironment();
  const { IDBObjectStore } = await import("fake-indexeddb");
  const put = vi
    .spyOn(IDBObjectStore.prototype, "put")
    .mockImplementationOnce(() => {
      throw new Error("quota");
    });
  const { imageAssets: assets } = await import("./image-assets");
  const id = await assets.import(pixels);
  expect(assets.isSessionOnly()).toBe(true);
  expect(assets.snapshot(id)?.status).toBe("ready");
  expect(await assets.list()).toContain(id);
  await assets.delete(id);
  expect(await assets.list()).not.toContain(id);
  expect(assets.snapshot(id)).toEqual({ status: "missing" });
  put.mockRestore();
});

it("删除等待在途读取，延迟返回不能复活已删除资产", async () => {
  vi.resetModules();
  const { IDBDatabase } = await import("fake-indexeddb");
  const { createIndexedDBImageStore } = await import("./store");
  const store = await createIndexedDBImageStore();
  const id = await store.put(pixels);
  const { imageAssets: assets } = await import("./image-assets");
  let release: () => void = () => undefined;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  let started: () => void = () => undefined;
  const reading = new Promise<void>((resolve) => {
    started = resolve;
  });
  const original = IDBDatabase.prototype.transaction;
  const transaction = vi
    .spyOn(IDBDatabase.prototype, "transaction")
    .mockImplementation(function (this: IDBDatabase, ...args) {
      const result = original.apply(this, args);
      if (args[1] === "readonly") {
        Object.defineProperty(result, "oncomplete", {
          set(callback) {
            result.addEventListener("complete", async (event) => {
              started();
              await gate;
              callback.call(result, event);
            });
          },
        });
      }
      return result;
    });
  const loading = assets.load(id);
  await reading;
  let deleted = false;
  const deletion = assets.delete(id).then(() => {
    deleted = true;
  });
  await new Promise((resolve) => setTimeout(resolve, 10));
  expect(deleted).toBe(false);
  release();
  await Promise.all([loading, deletion]);
  transaction.mockRestore();
  expect(assets.snapshot(id)).toEqual({ status: "missing" });
  expect(await store.get(id)).toBeNull();
});

it("打开数据库失败不缓存永久缺失，恢复后可重试读取", async () => {
  vi.resetModules();
  const { IDBFactory } = await import("fake-indexeddb");
  const { createIndexedDBImageStore } = await import("./store");
  const store = await createIndexedDBImageStore();
  const id = await store.put(pixels);
  const open = vi
    .spyOn(IDBFactory.prototype, "open")
    .mockImplementationOnce(() => {
      throw new Error("unavailable");
    });
  const { imageAssets: assets } = await import("./image-assets");
  await assets.load(id);
  expect(assets.isSessionOnly()).toBe(false);
  expect(assets.snapshot(id)).toEqual({ status: "missing" });
  await assets.load(id);
  expect(assets.snapshot(id)?.status).toBe("ready");
  open.mockRestore();
});
