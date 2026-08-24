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
  readonly configuration: StyleConfiguration;
  readonly currentThemeId: string;
}

export type StyleSystemCommand =
  | {
      readonly patch: Partial<StyleConfiguration>;
      readonly type: "update-configuration";
    }
  | { readonly type: "reset-configuration" }
  | { readonly themeId: string; readonly type: "select-theme" };

export interface StyleSystemSnapshot {
  readonly configuration: StyleConfiguration;
  readonly isModified: boolean;
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
