import { applyAdjustments, resolveThemeDefaults } from "../theme/adjustments";
import { generateStyles } from "../theme/generator";
import { defaultTheme, getThemeById, presetThemes } from "../theme/themes";
import type {
  RenderContext,
  ResolvedStyle,
  StyleConfiguration,
  StyleSystem,
  StyleSystemCommand,
  StyleSystemSnapshot,
  StyleSystemState,
  ThemeCatalogItem,
} from "./types";

export type {
  RenderContext,
  RenderHeader,
  RenderStyle,
  ResolvedStyle,
  StyleConfiguration,
  StyleSystem,
  StyleSystemCommand,
  StyleSystemSnapshot,
  StyleSystemState,
  ThemeCatalogItem,
} from "./types";

const themeCatalog: readonly ThemeCatalogItem[] = presetThemes.map(
  ({ description, id, name }) => ({ description, id, name })
);

const hydrate = (persisted: unknown): StyleSystemState => {
  const legacy = (persisted ?? {}) as {
    adjustments?: Partial<StyleConfiguration>;
    configuration?: Partial<StyleConfiguration>;
    currentThemeId?: string;
  };
  const theme = getThemeById(legacy.currentThemeId ?? "") ?? defaultTheme;
  const configuration: StyleConfiguration = {
    ...resolveThemeDefaults(theme),
    ...(legacy.configuration ?? legacy.adjustments),
  };

  if (configuration.accentColor === "transparent") {
    return {
      configuration: {
        ...configuration,
        accentColor: undefined,
        headingDecoration: "none",
      },
      currentThemeId: theme.id,
    };
  }

  return { configuration, currentThemeId: theme.id };
};

const transition = (
  state: StyleSystemState,
  command: StyleSystemCommand
): StyleSystemState => {
  if (command.type === "update-configuration") {
    return {
      ...state,
      configuration: { ...state.configuration, ...command.patch },
    };
  }

  if (command.type === "reset-configuration") {
    const theme = getThemeById(state.currentThemeId) ?? defaultTheme;
    return {
      configuration: resolveThemeDefaults(theme),
      currentThemeId: theme.id,
    };
  }

  const theme = getThemeById(command.themeId);
  return theme
    ? {
        configuration: resolveThemeDefaults(theme),
        currentThemeId: theme.id,
      }
    : state;
};

const isSameConfiguration = (
  left: StyleConfiguration,
  right: StyleConfiguration
): boolean =>
  left.accentColor === right.accentColor &&
  left.density === right.density &&
  left.fontId === right.fontId &&
  left.headingAlignment === right.headingAlignment &&
  left.headingDecoration === right.headingDecoration;

const read = (state: StyleSystemState): StyleSystemSnapshot => {
  const theme = getThemeById(state.currentThemeId) ?? defaultTheme;
  const themeConfiguration = resolveThemeDefaults(theme);

  return {
    configuration: state.configuration,
    isModified: !isSameConfiguration(state.configuration, themeConfiguration),
    theme: {
      description: theme.description,
      id: theme.id,
      name: theme.name,
    },
    themeConfiguration,
  };
};

const resolve = (
  state: StyleSystemState,
  context: RenderContext
): ResolvedStyle => {
  const theme = getThemeById(state.currentThemeId) ?? defaultTheme;
  const adjustedStyle = applyAdjustments(
    theme.style,
    state.configuration,
    theme.typeset
  );

  return {
    headerBar: theme.headerBar,
    styles: generateStyles(
      adjustedStyle,
      context.page === "cover" ? { coverStyle: theme.coverStyle } : undefined
    ),
    theme: {
      description: theme.description,
      id: theme.id,
      name: theme.name,
    },
  };
};

export const styleSystem = {
  catalog: (): readonly ThemeCatalogItem[] => themeCatalog,
  hydrate,
  read,
  resolve,
  transition,
} satisfies StyleSystem;
