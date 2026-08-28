import type { GeneratedStyles } from "../theme/generator";
import type {
  BackgroundPreset,
  CanvasBackground,
  CoverLayout,
  Density,
  GradientPreset,
  HeadingAlignment,
  PatternPreset,
  StyleAdjustments,
} from "../theme/types";

export interface StyleConfiguration {
  readonly background: CanvasBackground;
  readonly bodyHeadingAlignment: HeadingAlignment;
  readonly coverLayout: CoverLayout;
  readonly density: Density;
  readonly fontId: StyleAdjustments["fontId"];
}

export interface StyleConfigurationOptions {
  readonly backgroundPreset: readonly BackgroundPreset[];
  readonly bodyHeadingAlignment: readonly StyleConfiguration["bodyHeadingAlignment"][];
  readonly coverLayout: readonly StyleConfiguration["coverLayout"][];
  readonly density: readonly StyleConfiguration["density"][];
  readonly fontId: readonly string[];
  readonly gradient: readonly GradientPreset[];
  readonly pattern: readonly PatternPreset[];
}

export interface StyleSystemState {
  readonly currentThemeId: string;
  readonly overrides: StyleConfigurationOverrides;
  readonly previousSelection?: StyleThemeSelection;
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
  | { readonly themeId: string; readonly type: "select-theme" };

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
  catalog(): readonly ThemeCatalogItem[];
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
}
