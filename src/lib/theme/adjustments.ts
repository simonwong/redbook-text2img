/**
 * Style Adjustments
 * 风格调整模块 - 配合 Layer 1 预设主题的微调
 */

import { applyCanvasConfiguration } from "./canvas";
import { type CardLayout, resolveCardLayout } from "./card";
import { defaultFontId, getFontFamily } from "./fonts";
import { spacing, typography } from "./tokens";
import type {
  Density,
  FullStyle,
  PresetTheme,
  StyleAdjustments,
} from "./types";

// ============================================================
// 密度预设
// ============================================================

interface DensityValues {
  baseFontSize: number;
  headingGap: number;
  lineHeight: number;
  padding: number;
  paragraphGap: number;
}

const densityValues = (d: Density): DensityValues => ({
  baseFontSize: typography.fontSize[d],
  lineHeight: typography.lineHeight[d],
  padding: spacing.padding[d],
  paragraphGap: spacing.paragraphGap[d],
  headingGap: spacing.headingGap[d],
});

export const densityPresets: Record<Density, DensityValues> = {
  compact: densityValues("compact"),
  snug: densityValues("snug"),
  normal: densityValues("normal"),
  relaxed: densityValues("relaxed"),
  spacious: densityValues("spacious"),
};

// ============================================================
// 默认调整值
// ============================================================

export const defaultAdjustments: StyleAdjustments = {
  aspectRatio: "3:4",
  background: { kind: "preset", preset: "clean-light" },
  bodyHeadingAlignment: "center",
  cardFrame: "none",
  coverLayout: "center-poster",
  density: "normal",
  fontId: defaultFontId,
};

/**
 * 解析主题的完整配置。边界返回新对象，防止调用方污染全局预设。
 */
export function resolveThemeDefaults(theme?: PresetTheme): StyleAdjustments {
  const configuration = theme?.configuration ?? defaultAdjustments;
  return { ...configuration, background: { ...configuration.background } };
}

// ============================================================
// 调整应用函数
// ============================================================

/**
 * 将风格调整应用到基础样式上
 * 返回带字体、密度和标题配置的最终样式。
 */
export function applyAdjustments(
  baseStyle: FullStyle,
  adjustments: StyleAdjustments
): AdjustedStyle {
  const density = densityPresets[adjustments.density];
  const fontFamily = getFontFamily(adjustments.fontId);
  const baseFontSize = density.baseFontSize;
  const canvasStyle = applyCanvasConfiguration(
    baseStyle,
    adjustments.background
  );
  const foundationWeight = typography.fontWeight.semibold;

  return {
    ...canvasStyle,
    emphasis: {
      ...canvasStyle.emphasis,
      bold: { ...canvasStyle.emphasis.bold, fontWeight: foundationWeight },
    },
    heading: { ...canvasStyle.heading, fontWeight: foundationWeight },
    typography: {
      baseFontSize,
      lineHeight: density.lineHeight,
    },
    spacing: {
      padding: density.padding,
      paragraphGap: density.paragraphGap,
      headingGap: density.headingGap,
    },
    fontFamily,
    bodyHeadingAlignment: adjustments.bodyHeadingAlignment,
    card: resolveCardLayout(adjustments.aspectRatio, adjustments.cardFrame),
    headingScale: 1,
    letterSpacing: {},
  };
}

/** 应用调整后的完整样式类型 */
export type AdjustedStyle = FullStyle & {
  bodyHeadingAlignment: StyleAdjustments["bodyHeadingAlignment"];
  card: CardLayout;
  fontFamily: string;
  headingScale: number;
  letterSpacing: { body?: string; heading?: string };
};
