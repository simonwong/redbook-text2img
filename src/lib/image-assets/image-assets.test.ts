import { afterEach, expect, it, vi } from "vitest";
import { useMarkdownContentStore } from "../../store/markdownContent";
import { imageAssets } from "./image-assets";

const pixels = new Blob(["pixels"], { type: "image/png" });

function canvasEnvironment() {
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
afterEach(() => vi.unstubAllGlobals());

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
