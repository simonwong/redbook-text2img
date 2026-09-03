/**
 * Style Adjustments
 * 风格调整模块 - 配合 Layer 1 预设主题的微调
 */

import { ensureAccentContrast } from "./accent";
import { applyCanvasConfiguration } from "./canvas";
import { type CardLayout, resolveCardLayout } from "./card";
import { defaultFontId, getFontFamily } from "./fonts";
import { type FrostLayers, resolveFrostLayers } from "./frost";
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
  accentColor: "#111827",
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
  // 强调色统一供给展示级标题、加粗、列表标记、引用边线与链接，
  // 落到背景上读不清时先由对比度保障调亮或压暗
  const accent = ensureAccentContrast(
    adjustments.accentColor,
    adjustments.background
  );
  const frost = resolveFrostLayers(adjustments.background);

  return {
    ...canvasStyle,
    accent,
    blockquote: { ...canvasStyle.blockquote, borderColor: accent },
    emphasis: {
      ...canvasStyle.emphasis,
      bold: { color: accent, fontWeight: foundationWeight },
    },
    heading: { ...canvasStyle.heading, fontWeight: foundationWeight },
    link: { ...canvasStyle.link, color: accent },
    list: { ...canvasStyle.list, markerColor: accent },
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
    // 无磨砂时不带这个字段，渲染样式与没有磨砂功能时完全一致
    ...(frost ? { frost } : {}),
    headingScale: 1,
    letterSpacing: {},
  };
}

/** 应用调整后的完整样式类型 */
export type AdjustedStyle = FullStyle & {
  /** 对比度保障后的强调色；h1–h3 用它，h4 及以下仍用基础标题色 */
  accent: string;
  bodyHeadingAlignment: StyleAdjustments["bodyHeadingAlignment"];
  card: CardLayout;
  fontFamily: string;
  /** 图片背景磨砂两层；无磨砂时缺省 */
  frost?: FrostLayers;
  headingScale: number;
  letterSpacing: { body?: string; heading?: string };
};
