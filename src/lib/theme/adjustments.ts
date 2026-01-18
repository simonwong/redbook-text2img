/**
 * Style Adjustments
 * 风格调整模块 - 配合 Layer 1 预设主题的微调
 */

import { defaultFontId, getFontFamily } from "./fonts";
import { spacing, typography } from "./tokens";
import type {
  Density,
  FullStyle,
  HeadingAlignment,
  StyleAdjustments,
} from "./types";

// ============================================================
// 密度预设
// ============================================================

interface DensityValues {
  baseFontSize: number;
  lineHeight: number;
  padding: number;
  paragraphGap: number;
  headingGap: number;
}

export const densityPresets: Record<Density, DensityValues> = {
  compact: {
    baseFontSize: typography.fontSize.compact,
    lineHeight: typography.lineHeight.compact,
    padding: spacing.padding.compact,
    paragraphGap: spacing.paragraphGap.compact,
    headingGap: spacing.headingGap.compact,
  },
  normal: {
    baseFontSize: typography.fontSize.normal,
    lineHeight: typography.lineHeight.normal,
    padding: spacing.padding.normal,
    paragraphGap: spacing.paragraphGap.normal,
    headingGap: spacing.headingGap.normal,
  },
  spacious: {
    baseFontSize: typography.fontSize.spacious,
    lineHeight: typography.lineHeight.spacious,
    padding: spacing.padding.spacious,
    paragraphGap: spacing.paragraphGap.spacious,
    headingGap: spacing.headingGap.spacious,
  },
};

// ============================================================
// UI 选项
// ============================================================

export const densityOptions: { value: Density; label: string }[] = [
  { value: "compact", label: "紧凑" },
  { value: "normal", label: "正常" },
  { value: "spacious", label: "宽松" },
];

export const headingAlignmentOptions: {
  value: HeadingAlignment;
  label: string;
}[] = [
  { value: "center", label: "居中" },
  { value: "left", label: "左对齐" },
];

// ============================================================
// 默认调整值
// ============================================================

export const defaultAdjustments: StyleAdjustments = {
  density: "normal",
  fontId: defaultFontId,
  headingAlignment: "center",
};

// ============================================================
// 调整应用函数
// ============================================================

/**
 * 将风格调整应用到基础样式上
 * 返回最终的 FullStyle（带有 fontFamily 和调整后的间距）
 */
export function applyAdjustments(
  baseStyle: FullStyle,
  adjustments: StyleAdjustments
): FullStyle & { fontFamily: string; headingAlignment: HeadingAlignment } {
  const density = densityPresets[adjustments.density];
  const fontFamily = getFontFamily(adjustments.fontId);

  return {
    ...baseStyle,
    typography: {
      baseFontSize: density.baseFontSize,
      lineHeight: density.lineHeight,
    },
    spacing: {
      padding: density.padding,
      paragraphGap: density.paragraphGap,
      headingGap: density.headingGap,
    },
    fontFamily,
    headingAlignment: adjustments.headingAlignment,
  };
}

/** 应用调整后的完整样式类型 */
export type AdjustedStyle = ReturnType<typeof applyAdjustments>;
