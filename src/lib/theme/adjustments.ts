/**
 * Style Adjustments
 * 风格调整模块 - 配合 Layer 1 预设主题的微调
 */

import { ACCENT_NONE, applyAccentOverride, deriveDecoration } from "./accent";
import { defaultFontId, getFontFamily, resolveFontId } from "./fonts";
import { spacing, typography } from "./tokens";
import type {
  Density,
  FullStyle,
  HeadingAlignment,
  StyleAdjustments,
  TypesetStyle,
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
// UI 选项
// ============================================================

export const densityOptions: { value: Density; label: string }[] = [
  { value: "compact", label: "紧凑" },
  { value: "snug", label: "较紧" },
  { value: "normal", label: "正常" },
  { value: "relaxed", label: "较松" },
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
  // 显式声明：默认无强调色覆盖（跟随主题）
  accentColor: undefined,
  density: "normal",
  fontId: defaultFontId,
  headingAlignment: "center",
  // 显式声明：默认不覆盖标题装饰（跟随主题）
  headingDecoration: undefined,
};

// ============================================================
// 调整应用函数
// ============================================================

/**
 * 将风格调整应用到基础样式上
 * 返回最终的 FullStyle（带有 fontFamily、调整后的间距，以及主题排版个性）
 *
 * typeset 是乘数/叠加，作用于密度之上，不覆盖密度逻辑：
 * - fontFamily：用户 auto 时用 typeset.fontId，否则用户选择优先
 * - baseFontSize：密度 baseFontSize × typeset.bodyScale
 * - headingScale / letterSpacing：交给 generator 消费
 */
export function applyAdjustments(
  baseStyle: FullStyle,
  adjustments: StyleAdjustments,
  typeset?: TypesetStyle
): AdjustedStyle {
  const density = densityPresets[adjustments.density];
  const fontFamily = getFontFamily(
    resolveFontId(adjustments.fontId, typeset?.fontId)
  );
  const baseFontSize = density.baseFontSize * (typeset?.bodyScale ?? 1);
  // 强调色三态：undefined=跟随主题原色；ACCENT_NONE(透明)=去掉标题装饰；其余=自定义色覆盖。
  // 只有自定义色才过 applyAccentOverride（透明/未设置都保持主题原语义色，逐像素不变）。
  const customAccent =
    adjustments.accentColor && adjustments.accentColor !== ACCENT_NONE
      ? adjustments.accentColor
      : undefined;
  const styledBase = customAccent
    ? applyAccentOverride(baseStyle, customAccent)
    : baseStyle;

  // 有效标题装饰：用户"标题装饰"选择优先；否则透明强调色去掉装饰；否则跟随主题。
  let decoration = styledBase.heading.decoration;
  if (adjustments.headingDecoration !== undefined) {
    decoration =
      adjustments.headingDecoration === "none"
        ? undefined
        : deriveDecoration(
            adjustments.headingDecoration,
            customAccent ?? baseStyle.heading.color
          );
  } else if (adjustments.accentColor === ACCENT_NONE) {
    decoration = undefined;
  }
  const decorated =
    decoration === styledBase.heading.decoration
      ? styledBase
      : { ...styledBase, heading: { ...styledBase.heading, decoration } };

  return {
    ...decorated,
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
    headingAlignment: adjustments.headingAlignment,
    headingScale: typeset?.headingScale ?? 1,
    letterSpacing: typeset?.letterSpacing ?? {},
  };
}

/** 应用调整后的完整样式类型 */
export type AdjustedStyle = FullStyle & {
  fontFamily: string;
  headingAlignment: HeadingAlignment;
  headingScale: number;
  letterSpacing: NonNullable<TypesetStyle["letterSpacing"]>;
};
