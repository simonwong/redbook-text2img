/**
 * Style Adjustments
 * 风格调整模块 - 配合 Layer 1 预设主题的微调
 */

import {
  applyCanvasConfiguration,
  resolveCanvasBackground,
  resolveContentSurface,
} from "./canvas";
import { defaultFontId, getFontFamily, resolveFontId } from "./fonts";
import { deriveDecoration } from "./heading-decoration";
import { spacing, typography } from "./tokens";
import type {
  Density,
  FullStyle,
  HeadingDecoration,
  PresetTheme,
  StyleAdjustments,
  TypesetStyle,
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

const bodyHeadingScales: Record<StyleAdjustments["bodyHeadingSize"], number> = {
  small: 0.875,
  medium: 1,
  large: 1.125,
};

// ============================================================
// 默认调整值
// ============================================================

export const defaultAdjustments: StyleAdjustments = {
  background: { kind: "preset", preset: "clean-light" },
  bodyHeadingAlignment: "center",
  bodyHeadingSize: "medium",
  contentSurface: "none",
  coverLayout: "center-poster",
  decorationColor: "#111827",
  density: "balanced",
  fontId: defaultFontId,
  // 无主题时的兜底：无装饰
  headingDecoration: "none",
};

/**
 * 解析某主题的默认风格调整：全局默认叠加该主题声明的 defaults。
 * 切换主题 / 重置风格时用它把 adjustments 回落到"该主题的默认配置"。
 *
 * 标题装饰的初始落点从主题精修装饰的 kind 推导（无精修装饰 → "none"）；
 * 主题 defaults 仍可显式声明覆盖该落点（放在推导之后 spread）。
 */
export function resolveThemeDefaults(theme?: PresetTheme): StyleAdjustments {
  return {
    ...defaultAdjustments,
    background: theme
      ? resolveCanvasBackground(theme.style.background)
      : defaultAdjustments.background,
    contentSurface: resolveContentSurface(theme?.style.surface),
    decorationColor:
      theme?.style.heading.decoration?.color ??
      theme?.style.heading.color ??
      defaultAdjustments.decorationColor,
    headingDecoration: theme?.style.heading.decoration?.kind ?? "none",
    ...theme?.defaults,
  };
}

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
  const canvasStyle = applyCanvasConfiguration(
    baseStyle,
    adjustments.background,
    adjustments.contentSurface
  );
  // 有效标题装饰（kind 一致性规则）：
  // - "none" → 无装饰；
  // - 类型与颜色都等于主题值 → 保留主题精修对象和粗细；
  // - 其他组合 → 从配置颜色派生，且不修改正文语义色。
  const themeKind = baseStyle.heading.decoration?.kind;
  let decoration: HeadingDecoration | undefined;
  if (adjustments.headingDecoration === "none") {
    decoration = undefined;
  } else if (
    adjustments.headingDecoration === themeKind &&
    adjustments.decorationColor === baseStyle.heading.decoration?.color &&
    canvasStyle === baseStyle
  ) {
    decoration = baseStyle.heading.decoration;
  } else {
    const derived = deriveDecoration(
      adjustments.headingDecoration,
      adjustments.decorationColor,
      canvasStyle.heading.color
    );
    decoration =
      adjustments.headingDecoration === themeKind
        ? { ...baseStyle.heading.decoration, ...derived }
        : derived;
  }
  const decorated =
    decoration === canvasStyle.heading.decoration
      ? canvasStyle
      : { ...canvasStyle, heading: { ...canvasStyle.heading, decoration } };

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
    bodyHeadingAlignment: adjustments.bodyHeadingAlignment,
    bodyHeadingScale: bodyHeadingScales[adjustments.bodyHeadingSize],
    headingScale: typeset?.headingScale ?? 1,
    letterSpacing: typeset?.letterSpacing ?? {},
  };
}

/** 应用调整后的完整样式类型 */
export type AdjustedStyle = FullStyle & {
  bodyHeadingAlignment: StyleAdjustments["bodyHeadingAlignment"];
  bodyHeadingScale: number;
  fontFamily: string;
  headingScale: number;
  letterSpacing: NonNullable<TypesetStyle["letterSpacing"]>;
};
