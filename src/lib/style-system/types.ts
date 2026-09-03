import type { GeneratedStyles } from "../theme/generator";
import type {
  BackgroundFrost,
  CanvasBackground,
  CardAspectRatio,
  CardFrame,
  CoverLayout,
  Density,
  HeadingAlignment,
  StyleAdjustments,
} from "../theme/types";

export interface StyleConfiguration {
  /** 强调色（6 位十六进制）：正文标题、加粗、列表标记、引用边线与链接共用 */
  readonly accentColor: string;
  readonly aspectRatio: CardAspectRatio;
  readonly background: CanvasBackground;
  readonly bodyHeadingAlignment: HeadingAlignment;
  readonly cardFrame: CardFrame;
  readonly coverLayout: CoverLayout;
  readonly density: Density;
  readonly fontId: StyleAdjustments["fontId"];
}

export interface StyleConfigurationOptions {
  readonly aspectRatio: readonly StyleConfiguration["aspectRatio"][];
  readonly bodyHeadingAlignment: readonly StyleConfiguration["bodyHeadingAlignment"][];
  readonly cardFrame: readonly StyleConfiguration["cardFrame"][];
  readonly coverLayout: readonly StyleConfiguration["coverLayout"][];
  readonly density: readonly StyleConfiguration["density"][];
  readonly fontId: readonly string[];
  /** 图片背景的磨砂档位；不是顶层字段，随 background 一起改 */
  readonly frost: readonly BackgroundFrost[];
}

export interface StyleSystemState {
  readonly currentThemeId: string;
  /** 用户命名保存的完整配置快照，与内置主题并列出现在目录中 */
  readonly customThemes: readonly CustomTheme[];
  readonly overrides: StyleConfigurationOverrides;
  readonly previousSelection?: StyleThemeSelection;
}

export interface CustomTheme {
  /** 保存时的完整有效配置；后续新增字段由 hydrate 补默认值 */
  readonly configuration: StyleConfiguration;
  readonly createdAt: number;
  /** 形如 custom-<base36 时间戳>，与内置主题标识不会重名 */
  readonly id: string;
  readonly name: string;
}

export interface StyleThemeSelection {
  readonly currentThemeId: string;
  readonly overrides: StyleConfigurationOverrides;
}

export type StyleConfigurationOverrides = Readonly<Partial<StyleConfiguration>>;

export type StyleConfigurationOverrideState = Readonly<
  Record<keyof StyleConfiguration, boolean>
>;

export type StyleSystemCommand =
  | {
      readonly patch: Partial<StyleConfiguration>;
      readonly type: "update-configuration";
    }
  | {
      readonly field: keyof StyleConfiguration;
      readonly type: "reset-field";
    }
  | { readonly type: "reset-configuration" }
  | { readonly type: "undo-theme-selection" }
  | { readonly themeId: string; readonly type: "select-theme" }
  | {
      readonly name: string;
      /** 生成标识用的时间戳，缺省取 Date.now()；测试可注入固定值 */
      readonly now?: number;
      readonly type: "save-custom-theme";
    }
  | { readonly type: "update-custom-theme" }
  | { readonly id: string; readonly type: "delete-custom-theme" };

export interface StyleSystemSnapshot {
  readonly configuration: StyleConfiguration;
  readonly isModified: boolean;
  readonly overridden: StyleConfigurationOverrideState;
  readonly theme: ThemeCatalogItem;
  readonly themeConfiguration: StyleConfiguration;
}

export interface RenderContext {
  readonly page: "body" | "cover";
}

export interface RenderHeader {
  readonly background?: string;
  readonly iconColor: string;
  readonly icons: {
    readonly backArrow?: boolean;
    readonly menu?: boolean;
    readonly share?: boolean;
  };
}

export type RenderStyle = GeneratedStyles;

export interface ResolvedStyle {
  readonly headerBar?: RenderHeader;
  readonly styles: RenderStyle;
  readonly theme: ThemeCatalogItem;
}

export interface StyleSystem {
  catalog(state?: StyleSystemState): readonly ThemeCatalogItem[];
  configurationOptions(): StyleConfigurationOptions;
  hydrate(persisted: unknown): StyleSystemState;
  read(state: StyleSystemState): StyleSystemSnapshot;
  resolve(state: StyleSystemState, context: RenderContext): ResolvedStyle;
  transition(
    state: StyleSystemState,
    command: StyleSystemCommand
  ): StyleSystemState;
}

export interface ThemeCatalogItem {
  readonly description?: string;
  readonly id: string;
  readonly name: string;
  readonly source: ThemeSource;
}

export type ThemeSource = "built-in" | "custom";
