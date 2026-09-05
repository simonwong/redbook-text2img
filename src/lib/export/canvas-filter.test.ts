import { afterEach, describe, expect, it } from "vitest";
import { withCanvasFilterCompatibility } from "./canvas-filter";

const applied: string[] = [];

/** 只保留 filter 访问器的最小替身：真实浏览器对非法字符串会静默回落 none */
class FakeCanvasContext {
  set filter(value: string) {
    applied.push(value);
  }
}

const installFakeContext = () => {
  (globalThis as Record<string, unknown>).CanvasRenderingContext2D =
    FakeCanvasContext;
  return new FakeCanvasContext() as unknown as { filter: string };
};

afterEach(() => {
  applied.length = 0;
  (globalThis as Record<string, unknown>).CanvasRenderingContext2D = undefined;
});

describe("导出链路的 Canvas filter 兼容", () => {
  it("修掉重复单位并按导出倍率放大模糊半径", async () => {
    const context = installFakeContext();

    await withCanvasFilterCompatibility(3, () => {
      // html2canvas-pro 2.4.1 写出的就是这种重复单位的字符串
      context.filter = "blur(12pxpx)";
      return Promise.resolve(null);
    });

    expect(applied).toEqual(["blur(36px)"]);
  });

  it("导出结束后还原原始访问器", async () => {
    const context = installFakeContext();

    await withCanvasFilterCompatibility(3, () => Promise.resolve(null));
    context.filter = "blur(12pxpx)";

    expect(applied).toEqual(["blur(12pxpx)"]);
  });

  it("导出抛错也要还原访问器", async () => {
    const context = installFakeContext();

    await expect(
      withCanvasFilterCompatibility(3, () =>
        Promise.reject(new Error("导出失败"))
      )
    ).rejects.toThrow("导出失败");
    context.filter = "blur(6px)";

    expect(applied).toEqual(["blur(6px)"]);
  });

  it("非模糊的 filter 只修单位，不改数值", async () => {
    const context = installFakeContext();

    await withCanvasFilterCompatibility(2, () => {
      context.filter = "hue-rotate(90degdeg) saturate(1.2)";
      return Promise.resolve(null);
    });

    expect(applied).toEqual(["hue-rotate(90deg) saturate(1.2)"]);
  });
});
