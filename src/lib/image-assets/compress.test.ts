import { afterEach, expect, it, vi } from "vitest";
import { compressContentImage } from "./compress";

afterEach(() => vi.unstubAllGlobals());
it.each([
  [4000, 2000, 2000, 1000],
  [100, 200, 100, 200],
])(
  "按自然尺寸 %s × %s 在解码阶段缩放",
  async (width, height, expectedWidth, expectedHeight) => {
    const bitmap = vi.fn(async (_file: Blob, options?: ImageBitmapOptions) => ({
      close: vi.fn(),
      height: options?.resizeHeight ?? height,
      width: options?.resizeWidth ?? width,
    }));
    vi.stubGlobal("createImageBitmap", bitmap);
    vi.stubGlobal(
      "Image",
      class {
        naturalWidth = width;
        naturalHeight = height;
        onload: (() => void) | null = null;
        set src(_value: string) {
          queueMicrotask(() => this.onload?.());
        }
      }
    );
    vi.stubGlobal("document", {
      createElement: () => ({
        getContext: () => ({
          drawImage: vi.fn(),
          getImageData: () => ({ data: [0, 0, 0, 255] }),
        }),
        toBlob: (callback: (blob: Blob) => void) =>
          callback(new Blob(["compressed"])),
      }),
    });
    await compressContentImage(new Blob(["pixels"]));
    expect(bitmap).toHaveBeenCalledTimes(1);
    expect(bitmap).toHaveBeenCalledWith(expect.any(Blob), {
      resizeHeight: expectedHeight,
      resizeQuality: "high",
      resizeWidth: expectedWidth,
    });
  }
);
