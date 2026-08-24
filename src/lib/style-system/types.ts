import type { GeneratedStyles } from "../theme/generator";
import type {
  Density,
  HeadingAlignment,
  HeadingDecorationChoice,
} from "../theme/types";

export interface StyleConfiguration {
  readonly accentColor?: string;
  readonly density: Density;
  readonly fontId: string;
  readonly headingAlignment: HeadingAlignment;
  readonly headingDecoration: HeadingDecorationChoice;
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
