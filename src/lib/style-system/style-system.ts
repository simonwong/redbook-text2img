import { applyAdjustments, resolveThemeDefaults } from "../theme/adjustments";
import { backgroundPresetIds, canvasBackgroundsEqual } from "../theme/canvas";
import { AUTO_FONT_ID, fontPresets } from "../theme/fonts";
import { generateStyles } from "../theme/generator";
import { defaultTheme, getThemeById, presetThemes } from "../theme/themes";
import type { BackgroundPreset, CoverStyleOverride } from "../theme/types";
import type {
  RenderContext,
  ResolvedStyle,
  StyleConfiguration,
  StyleConfigurationOptions,
  StyleConfigurationOverrides,
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
  StyleConfigurationOptions,
  StyleConfigurationOverrideState,
  StyleConfigurationOverrides,
  StyleSystem,
  StyleSystemCommand,
  StyleSystemSnapshot,
  StyleSystemState,
  StyleThemeSelection,
  ThemeCatalogItem,
} from "./types";

const themeCatalog: readonly ThemeCatalogItem[] = presetThemes.map(
  ({ description, id, name }) => ({ description, id, name })
);
const hexColorPattern = /^#[\da-f]{6}$/i;
const configurationOptions = {
  backgroundPreset: backgroundPresetIds,
  bodyHeadingAlignment: ["center", "left"],
  bodyHeadingSize: ["small", "medium", "large"],
  contentSurface: ["none", "floating-card", "notebook"],
  coverLayout: ["center-poster", "top-left", "bottom-left"],
  density: ["compact", "balanced", "spacious"],
  fontId: [AUTO_FONT_ID, ...fontPresets.map(({ id }) => id)],
  headingDecoration: ["none", "underline", "wavy", "highlight"],
} satisfies StyleConfigurationOptions;

const diffConfiguration = (
  configuration: StyleConfiguration,
  themeConfiguration: StyleConfiguration
): StyleConfigurationOverrides => {
  const overrides: {
    -readonly [Field in keyof StyleConfiguration]?: StyleConfiguration[Field];
  } = {};

  if (
    !canvasBackgroundsEqual(
      configuration.background,
      themeConfiguration.background
    )
  ) {
    overrides.background = configuration.background;
  }
  if (
    configuration.bodyHeadingAlignment !==
    themeConfiguration.bodyHeadingAlignment
  ) {
    overrides.bodyHeadingAlignment = configuration.bodyHeadingAlignment;
  }
  if (configuration.bodyHeadingSize !== themeConfiguration.bodyHeadingSize) {
    overrides.bodyHeadingSize = configuration.bodyHeadingSize;
  }
  if (configuration.contentSurface !== themeConfiguration.contentSurface) {
    overrides.contentSurface = configuration.contentSurface;
  }
  if (configuration.coverLayout !== themeConfiguration.coverLayout) {
    overrides.coverLayout = configuration.coverLayout;
  }
  if (configuration.decorationColor !== themeConfiguration.decorationColor) {
    overrides.decorationColor = configuration.decorationColor;
  }
  if (configuration.density !== themeConfiguration.density) {
    overrides.density = configuration.density;
  }
  if (configuration.fontId !== themeConfiguration.fontId) {
    overrides.fontId = configuration.fontId;
  }
  if (
    configuration.headingDecoration !== themeConfiguration.headingDecoration
  ) {
    overrides.headingDecoration = configuration.headingDecoration;
  }

  return overrides;
};

const getThemeConfiguration = (themeId: string): StyleConfiguration =>
  resolveThemeDefaults(getThemeById(themeId) ?? defaultTheme);

const bodyHeadingAlignments = new Set<string>(
  configurationOptions.bodyHeadingAlignment
);
const bodyHeadingSizes = new Set<string>(configurationOptions.bodyHeadingSize);
const contentSurfaces = new Set<string>(configurationOptions.contentSurface);
const coverLayouts = new Set<string>(configurationOptions.coverLayout);
const backgroundPresets = new Set<string>(
  configurationOptions.backgroundPreset
);
const fontIds = new Set<string>(configurationOptions.fontId);
const headingDecorations = new Set<string>(
  configurationOptions.headingDecoration
);
const legacyDensities = new Map<string, StyleConfiguration["density"]>([
  ["balanced", "balanced"],
  ["compact", "compact"],
  ["snug", "compact"],
  ["normal", "balanced"],
  ["relaxed", "spacious"],
  ["spacious", "spacious"],
]);
const legacyFontIds = new Map<string, string>([
  ["kai", "serif"],
  ["mono", "sans"],
  ["rounded", "sans"],
  ["system", "sans"],
]);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const sanitizeBackground = (
  value: unknown
): StyleConfiguration["background"] | undefined => {
  if (!isRecord(value)) {
    return;
  }
  if (
    value.kind === "preset" &&
    typeof value.preset === "string" &&
    backgroundPresets.has(value.preset)
  ) {
    return {
      kind: "preset",
      preset: value.preset as BackgroundPreset,
    };
  }
  if (
    value.kind === "solid" &&
    typeof value.color === "string" &&
    hexColorPattern.test(value.color)
  ) {
    return { color: value.color.toLowerCase(), kind: "solid" };
  }
};

const sanitizeDensity = (
  value: unknown
): StyleConfiguration["density"] | undefined =>
  typeof value === "string" ? legacyDensities.get(value) : undefined;

const sanitizeFontId = (value: unknown): string | undefined => {
  if (typeof value !== "string") {
    return;
  }
  const fontId = legacyFontIds.get(value) ?? value;
  return fontIds.has(fontId) ? fontId : undefined;
};

const sanitizeConfiguration = (value: unknown): StyleConfigurationOverrides => {
  if (!isRecord(value)) {
    return {};
  }

  const bodyHeadingAlignment =
    value.bodyHeadingAlignment ?? value.headingAlignment;
  const decorationColor = value.decorationColor ?? value.accentColor;
  const background = sanitizeBackground(value.background);
  const density = sanitizeDensity(value.density);
  const fontId = sanitizeFontId(value.fontId);

  return {
    ...(background ? { background } : {}),
    ...(typeof bodyHeadingAlignment === "string" &&
    bodyHeadingAlignments.has(bodyHeadingAlignment)
      ? {
          bodyHeadingAlignment:
            bodyHeadingAlignment as StyleConfiguration["bodyHeadingAlignment"],
        }
      : {}),
    ...(typeof value.bodyHeadingSize === "string" &&
    bodyHeadingSizes.has(value.bodyHeadingSize)
      ? {
          bodyHeadingSize:
            value.bodyHeadingSize as StyleConfiguration["bodyHeadingSize"],
        }
      : {}),
    ...(typeof value.contentSurface === "string" &&
    contentSurfaces.has(value.contentSurface)
      ? {
          contentSurface:
            value.contentSurface as StyleConfiguration["contentSurface"],
        }
      : {}),
    ...(typeof value.coverLayout === "string" &&
    coverLayouts.has(value.coverLayout)
      ? {
          coverLayout: value.coverLayout as StyleConfiguration["coverLayout"],
        }
      : {}),
    ...(typeof decorationColor === "string" &&
    hexColorPattern.test(decorationColor)
      ? { decorationColor }
      : {}),
    ...(density ? { density } : {}),
    ...(fontId ? { fontId } : {}),
    ...(typeof value.headingDecoration === "string" &&
    headingDecorations.has(value.headingDecoration)
      ? {
          headingDecoration:
            value.headingDecoration as StyleConfiguration["headingDecoration"],
        }
      : {}),
  };
};

const hydrate = (persisted: unknown): StyleSystemState => {
  const legacy = isRecord(persisted) ? persisted : {};
  const theme =
    getThemeById(
      typeof legacy.currentThemeId === "string" ? legacy.currentThemeId : ""
    ) ?? defaultTheme;
  const themeConfiguration = resolveThemeDefaults(theme);
  const persistedConfiguration =
    legacy.overrides ?? legacy.configuration ?? legacy.adjustments;
  const configuration: StyleConfiguration = {
    ...themeConfiguration,
    ...sanitizeConfiguration(persistedConfiguration),
  };

  if (
    isRecord(persistedConfiguration) &&
    (persistedConfiguration.decorationColor === "transparent" ||
      persistedConfiguration.accentColor === "transparent")
  ) {
    const migratedConfiguration: StyleConfiguration = {
      ...configuration,
      decorationColor: themeConfiguration.decorationColor,
      headingDecoration: "none",
    };
    return {
      currentThemeId: theme.id,
      overrides: diffConfiguration(migratedConfiguration, themeConfiguration),
    };
  }

  return {
    currentThemeId: theme.id,
    overrides: diffConfiguration(configuration, themeConfiguration),
  };
};

const transition = (
  state: StyleSystemState,
  command: StyleSystemCommand
): StyleSystemState => {
  if (command.type === "update-configuration") {
    const themeConfiguration = getThemeConfiguration(state.currentThemeId);
    return {
      currentThemeId: state.currentThemeId,
      overrides: diffConfiguration(
        {
          ...themeConfiguration,
          ...state.overrides,
          ...sanitizeConfiguration(command.patch),
        },
        themeConfiguration
      ),
    };
  }

  if (command.type === "reset-field") {
    const themeConfiguration = getThemeConfiguration(state.currentThemeId);
    return {
      currentThemeId: state.currentThemeId,
      overrides: diffConfiguration(
        {
          ...themeConfiguration,
          ...state.overrides,
          [command.field]: themeConfiguration[command.field],
        },
        themeConfiguration
      ),
    };
  }

  if (command.type === "reset-configuration") {
    const theme = getThemeById(state.currentThemeId) ?? defaultTheme;
    return {
      currentThemeId: theme.id,
      overrides: {},
    };
  }

  if (command.type === "undo-theme-selection") {
    return state.previousSelection ?? state;
  }

  const theme = getThemeById(command.themeId);
  return theme
    ? {
        currentThemeId: theme.id,
        overrides: {},
        previousSelection: {
          currentThemeId: state.currentThemeId,
          overrides: state.overrides,
        },
      }
    : state;
};

const read = (state: StyleSystemState): StyleSystemSnapshot => {
  const theme = getThemeById(state.currentThemeId) ?? defaultTheme;
  const themeConfiguration = resolveThemeDefaults(theme);
  const configuration: StyleConfiguration = {
    ...themeConfiguration,
    ...state.overrides,
  };

  return {
    configuration,
    isModified: Object.keys(state.overrides).length > 0,
    overridden: {
      background: "background" in state.overrides,
      bodyHeadingAlignment: "bodyHeadingAlignment" in state.overrides,
      bodyHeadingSize: "bodyHeadingSize" in state.overrides,
      contentSurface: "contentSurface" in state.overrides,
      coverLayout: "coverLayout" in state.overrides,
      decorationColor: "decorationColor" in state.overrides,
      density: "density" in state.overrides,
      fontId: "fontId" in state.overrides,
      headingDecoration: "headingDecoration" in state.overrides,
    },
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
  const { configuration } = read(state);
  const adjustedStyle = applyAdjustments(
    theme.style,
    configuration,
    theme.typeset
  );
  const coverLayout: CoverStyleOverride =
    configuration.coverLayout === "center-poster"
      ? {
          contentHorizontalAlign: "center",
          contentVerticalAlign: "center",
          headingAlignment: "center",
        }
      : {
          contentHorizontalAlign: "left",
          contentVerticalAlign:
            configuration.coverLayout === "top-left" ? "top" : "bottom",
          headingAlignment: "left",
        };

  return {
    headerBar: theme.headerBar,
    styles: generateStyles(
      adjustedStyle,
      context.page === "cover"
        ? { coverStyle: { ...theme.coverStyle, ...coverLayout } }
        : undefined
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
  configurationOptions: (): StyleConfigurationOptions => configurationOptions,
  hydrate,
  read,
  resolve,
  transition,
} satisfies StyleSystem;
