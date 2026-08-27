/**
 * Style Adjustments
 * 风格调整模块 - 配合 Layer 1 预设主题的微调
 */

import { applyCanvasConfiguration } from "./canvas";
import { defaultFontId, getFontFamily } from "./fonts";
import { deriveDecoration } from "./heading-decoration";
import { spacing, typography } from "./tokens";
import type {
  Density,
  FullStyle,
  HeadingDecoration,
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
  balanced: densityValues("balanced"),
  spacious: densityValues("spacious"),
};

// ============================================================
// 默认调整值
// ============================================================

export const defaultAdjustments: StyleAdjustments = {
  background: { kind: "preset", preset: "clean-light" },
  bodyHeadingAlignment: "center",
  contentSurface: "none",
  coverLayout: "center-poster",
  decorationColor: "#111827",
  density: "balanced",
  fontId: defaultFontId,
  // 无主题时的兜底：无装饰
  headingDecoration: "none",
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
    adjustments.background,
    adjustments.contentSurface
  );
  const decoration: HeadingDecoration | undefined =
    adjustments.headingDecoration === "none"
      ? undefined
      : deriveDecoration(
          adjustments.headingDecoration,
          adjustments.decorationColor,
          canvasStyle.heading.color
        );
  const decorated =
    decoration === canvasStyle.heading.decoration
      ? canvasStyle
      : { ...canvasStyle, heading: { ...canvasStyle.heading, decoration } };
  const foundationWeight = typography.fontWeight.semibold;

  return {
    ...decorated,
    emphasis: {
      ...decorated.emphasis,
      bold: { ...decorated.emphasis.bold, fontWeight: foundationWeight },
    },
    heading: { ...decorated.heading, fontWeight: foundationWeight },
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
    headingScale: 1,
    letterSpacing: {},
  };
}

/** 应用调整后的完整样式类型 */
export type AdjustedStyle = FullStyle & {
  bodyHeadingAlignment: StyleAdjustments["bodyHeadingAlignment"];
  fontFamily: string;
  headingScale: number;
  letterSpacing: { body?: string; heading?: string };
};
