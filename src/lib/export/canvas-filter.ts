/**
 * Canvas Filter Compatibility
 * 导出期间接管 Canvas 2D 的 `filter` 赋值，抹平 html2canvas-pro 2.4.1 的两处差异：
 *
 * 1. 它把长度参数的单位写了两遍（CSS `blur(12px)` → `blur(12pxpx)`），
 *    Canvas 2D 遇到非法字符串会整体丢弃，导出图就完全没有模糊。
 * 2. `ctx.filter` 在设备像素空间生效，不随导出缩放放大；导出 scale 为 3 时
 *    模糊半径必须同步乘 3，才能和预览看起来一样模糊。
 *
 * 只在一次导出的调用期间生效，结束后立刻还原原始访问器。
 */

/** 单位重复：`12pxpx` / `90degdeg` */
const doubledUnitPattern = /(\d)(px|deg|rad|turn)\2/g;
/** 只缩放模糊半径：drop-shadow 的偏移由 html2canvas-pro 走 ctx.shadow* 自行处理 */
const blurPattern = /blur\(([\d.]+)px\)/g;

const repairFilterString = (value: string, scale: number): string =>
  value
    .replace(doubledUnitPattern, "$1$2")
    .replace(
      blurPattern,
      (_match, radius: string) => `blur(${Number(radius) * scale}px)`
    );

/**
 * 在补齐 filter 兼容性的前提下执行一次导出。
 * 浏览器不支持 `ctx.filter` 时直接原样执行：磨砂本来就导不出，界面已提前禁用。
 */
export const withCanvasFilterCompatibility = async <T>(
  scale: number,
  run: () => Promise<T>
): Promise<T> => {
  const descriptor = Object.getOwnPropertyDescriptor(
    CanvasRenderingContext2D.prototype,
    "filter"
  );
  const originalSetter = descriptor?.set;
  if (!(descriptor && originalSetter)) {
    return await run();
  }

  Object.defineProperty(CanvasRenderingContext2D.prototype, "filter", {
    ...descriptor,
    set(this: CanvasRenderingContext2D, value: unknown) {
      originalSetter.call(
        this,
        typeof value === "string" ? repairFilterString(value, scale) : value
      );
    },
  });

  try {
    return await run();
  } finally {
    Object.defineProperty(
      CanvasRenderingContext2D.prototype,
      "filter",
      descriptor
    );
  }
};
