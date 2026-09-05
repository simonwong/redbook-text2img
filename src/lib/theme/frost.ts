/**
 * Image Frost
 * 图片背景磨砂的内部规则：把封闭的档位选择变成导出节点内的两层样式。
 *
 * 只用 CSS `filter`，不用 `backdrop-filter`：html2canvas-pro 会把 `filter`
 * 写进 Canvas 2D 的 ctx.filter，`backdrop-filter` 则被整体忽略
 * （docs/html2canvas-pitfalls.md 第 7 条）。
 */

import type { Properties as CSSProperties } from "csstype";
import type { BackgroundFrost, CanvasBackground } from "./types";

interface FrostLevel {
  /** 模糊半径（px） */
  readonly blur: number;
  /** 蒙层不透明度 */
  readonly veil: number;
}

/** 三档固定组合，用户不接触数值 */
const frostLevels: Record<Exclude<BackgroundFrost, "none">, FrostLevel> = {
  light: { blur: 6, veil: 0.28 },
  medium: { blur: 12, veil: 0.42 },
  strong: { blur: 20, veil: 0.56 },
};

/** 蒙层与兜底底色按图片明暗基调取，全部是不透明实色，不用 transparent */
const veilBase: Record<"dark" | "light", readonly [number, number, number]> = {
  dark: [11, 11, 15],
  light: [255, 255, 255],
};

/** 模糊后边缘会露出画布，放大一点再由容器裁掉 */
const blurLayerScale = 1.08;

const fill: CSSProperties = {
  bottom: 0,
  left: 0,
  pointerEvents: "none",
  position: "absolute",
  right: 0,
  top: 0,
};

export interface FrostLayers {
  /** 模糊的图片层，铺在内容下方 */
  readonly blurLayer: CSSProperties;
  /** 承载卡片内容的定位层，保证内容盖在两层之上 */
  readonly contentLayer: CSSProperties;
  /** 半透明纯色蒙层，压住对比度让文字可读 */
  readonly veil: CSSProperties;
}

/**
 * 解析磨砂两层；无磨砂（含非图片背景）返回 undefined，
 * 此时容器样式与没有磨砂功能时完全一致。
 */
export const resolveFrostLayers = (
  background: CanvasBackground
): FrostLayers | undefined => {
  if (background.kind !== "image" || background.frost === "none") {
    return;
  }

  const level = frostLevels[background.frost];
  const [red, green, blue] = veilBase[background.tone];

  return {
    blurLayer: {
      ...fill,
      // 图片读不出来时露出的是不透明基调色，不会是透明或白边
      backgroundColor: `rgb(${red}, ${green}, ${blue})`,
      // data-URI 含未编码的单引号，必须加双引号包裹才是合法 url()
      backgroundImage: `url("${background.dataUrl}")`,
      backgroundPosition: "center",
      backgroundSize: "cover",
      filter: `blur(${level.blur}px)`,
      transform: `scale(${blurLayerScale})`,
    },
    contentLayer: {
      display: "flex",
      flexDirection: "column",
      height: "100%",
      position: "relative",
      width: "100%",
      zIndex: 1,
    },
    veil: {
      ...fill,
      backgroundColor: `rgba(${red}, ${green}, ${blue}, ${level.veil})`,
    },
  };
};
