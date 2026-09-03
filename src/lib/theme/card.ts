/**
 * Card Geometry
 * 卡片比例与白边的内部规则：把封闭的比例/边框选择变成导出节点的尺寸与层次。
 */

import type { Properties as CSSProperties } from "csstype";
import type { CardAspectRatio, CardFrame } from "./types";

/** 卡片逻辑宽度固定，高度由比例决定 */
const cardWidth = 375;
const cardHeights: Record<CardAspectRatio, number> = {
  "1:1": 375,
  "3:4": 500,
  "9:16": 667,
};

/** 白边：3px 白色内边距，外圆角 16、内圆角 13，全部属于导出内容 */
const frameWidth = 3;
const frameColor = "#ffffff";
const frameRadius = 16;
const frameInnerRadius = 13;

/** 无白边时导出节点自身的圆角 */
const plainRadius = 12;

export interface CardStyle {
  /**
   * 白边层样式，即导出节点最外层；无白边时为 null，导出节点就是内容容器。
   * 只使用 padding / background / border-radius / overflow，
   * 保证 html2canvas-pro 逐属性可还原（docs/html2canvas-pitfalls.md）。
   */
  readonly frame: CSSProperties | null;
  readonly height: number;
  readonly width: number;
}

export interface CardLayout {
  readonly card: CardStyle;
  /** 内容容器尺寸与圆角：有白边时为白边内侧 */
  readonly content: {
    readonly height: number;
    readonly radius: number;
    readonly width: number;
  };
}

export const resolveCardLayout = (
  aspectRatio: CardAspectRatio,
  cardFrame: CardFrame
): CardLayout => {
  const height = cardHeights[aspectRatio];

  if (cardFrame !== "white") {
    return {
      card: { frame: null, height, width: cardWidth },
      content: { height, radius: plainRadius, width: cardWidth },
    };
  }

  return {
    card: {
      frame: {
        backgroundColor: frameColor,
        borderRadius: `${frameRadius}px`,
        boxSizing: "border-box",
        height: `${height}px`,
        minHeight: `${height}px`,
        minWidth: `${cardWidth}px`,
        overflow: "hidden",
        padding: `${frameWidth}px`,
        width: `${cardWidth}px`,
      },
      height,
      width: cardWidth,
    },
    content: {
      height: height - frameWidth * 2,
      radius: frameInnerRadius,
      width: cardWidth - frameWidth * 2,
    },
  };
};
