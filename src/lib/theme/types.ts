/**
 * Theme System Type Definitions
 *
 * Style Foundation internal types.
 * The public Style System Interface lives in src/lib/style-system.
 */

// ============================================================
// Style Foundation
// ============================================================

export interface BackgroundStyle {
  /** image 类型的平铺方式（受控图案背景）；缺省不平铺 */
  repeat?: "repeat";
  /** image 类型的铺放尺寸（受控图案背景）；缺省 cover */
  size?: string;
  type: "solid" | "gradient" | "image";
  value: string;
}

export type BackgroundPreset =
  | "clean-light"
  | "trianglify-gray"
  | "night-aurora"
  | "warm-sun"
  | "cool-mist"
  | "cherry-cream";

/** 自定义渐变方向（封闭集合，双色线性渐变） */
export type GradientDirection = "vertical" | "horizontal" | "diagonal";

export type CanvasBackground =
  | { readonly kind: "preset"; readonly preset: BackgroundPreset }
  | { readonly color: string; readonly kind: "solid" }
  | {
      readonly direction: GradientDirection;
      readonly from: string;
      readonly kind: "custom-gradient";
      readonly to: string;
    }
  | {
      /** 本地图片 data URL（上传时压缩，禁止远程资源） */
      readonly dataUrl: string;
      readonly kind: "image";
      /** 上传时采样的明暗基调，用于选取可读语义色 */
      readonly tone: "light" | "dark";
    };

export interface TypographyStyle {
  baseFontSize: number; // 12-18
  lineHeight: number; // 1.4-2.0
  // fontFamily 由 StyleAdjustments 动态生成，不在 FullStyle 中
}

export interface HeadingStyle {
  color: string;
  fontWeight: number; // 400-900
  // alignment 由 StyleAdjustments 控制
}

export interface ParagraphStyle {
  color: string;
}

export interface EmphasisStyle {
  bold: {
    color: string;
    fontWeight: number;
  };
  highlight: {
    background: string;
    color: string;
  };
  italic: {
    color: string;
  };
}

export interface ListStyle {
  color: string;
  markerColor: string;
}

export interface BlockquoteStyle {
  background: string;
  borderColor: string;
  boxShadow?: string;
  textColor: string;
}

export interface CodeStyle {
  block: {
    background: string;
    color: string;
  };
  inline: {
    background: string;
    color: string;
  };
}

export interface LinkStyle {
  color: string;
  underline: boolean;
}

export interface SpacingStyle {
  headingGap: number;
  padding: number;
  paragraphGap: number;
}

/** Complete internal style definition for Markdown rendering */
export interface FullStyle {
  background: BackgroundStyle;
  blockquote: BlockquoteStyle;
  code: CodeStyle;
  emphasis: EmphasisStyle;
  heading: HeadingStyle;
  link: LinkStyle;
  list: ListStyle;
  paragraph: ParagraphStyle;
  spacing: SpacingStyle;
  typography: TypographyStyle;
}

// ============================================================
// Resolved style configuration
// ============================================================

/** 密度选项 */
export type Density = "compact" | "snug" | "normal" | "relaxed" | "spacious";

/** 标题对齐方式 */
export type HeadingAlignment = "left" | "center";

export type CoverLayout = "center-poster" | "top-left" | "bottom-left";

/** 卡片比例（封闭集合）；逻辑宽度固定 375px，高度由比例决定 */
export type CardAspectRatio = "3:4" | "1:1" | "9:16";

/** 卡片边框（封闭集合）；white 为 3px 白色内边距，属于导出内容 */
export type CardFrame = "none" | "white";

/** Internal shape matching the resolved public style configuration */
export interface StyleAdjustments {
  /** 强调色（6 位十六进制）：正文标题、加粗、列表标记、引用边线与链接共用 */
  readonly accentColor: string;
  readonly aspectRatio: CardAspectRatio;
  readonly background: CanvasBackground;
  readonly bodyHeadingAlignment: HeadingAlignment;
  readonly cardFrame: CardFrame;
  readonly coverLayout: CoverLayout;
  readonly density: Density;
  readonly fontId: "sans" | "serif" | "kai" | "mono";
}

// ============================================================
// Built-in themes
// ============================================================

/** 封面图特有的样式覆盖 */
export interface CoverStyleOverride {
  /** 内容水平对齐方式 */
  contentHorizontalAlign?: "left" | "center" | "right";
  /** 内容垂直对齐方式 */
  contentVerticalAlign?: "top" | "center" | "bottom";
  /** 标题对齐方式（优先级高于用户调整） */
  headingAlignment?: HeadingAlignment;
  /** 封面 h1 额外字号乘数，仅作用于 h1 */
  headingScale?: number;
}

/** 装饰性顶部导航栏（如 Apple Notes 风格） */
export interface HeaderBarStyle {
  /** 背景颜色（可以是透明） */
  background?: string;
  /** 图标颜色 */
  iconColor: string;
  /** 显示哪些图标 */
  icons: {
    backArrow?: boolean;
    share?: boolean;
    menu?: boolean;
  };
}

/** 主题内部实现细节（不参与用户配置，不持久化） */
export interface ThemeInternals {
  /** 装饰性顶部导航栏（Apple 备忘录） */
  readonly headerBar?: HeaderBarStyle;
}

/** Named built-in preset. Rendering details stay behind the Style Foundation. */
export interface PresetTheme {
  readonly configuration: StyleAdjustments;
  readonly description?: string;
  readonly id: string;
  readonly internals?: ThemeInternals;
  readonly name: string;
}
