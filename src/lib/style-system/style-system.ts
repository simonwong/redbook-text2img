import { applyAdjustments, resolveThemeDefaults } from "../theme/adjustments";
import {
  backgroundPresetIds,
  canvasBackgroundsEqual,
  gradientPresetIds,
  patternPresetIds,
} from "../theme/canvas";
import { fontPresets } from "../theme/fonts";
import { resolveStyleFoundation } from "../theme/foundation";
import { generateStyles } from "../theme/generator";
import { defaultTheme, getThemeById, presetThemes } from "../theme/themes";
import type {
  BackgroundPreset,
  CoverStyleOverride,
  GradientPreset,
  PatternPreset,
} from "../theme/types";
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
  coverLayout: ["center-poster", "top-left", "bottom-left"],
  density: ["compact", "snug", "normal", "relaxed", "spacious"],
  fontId: fontPresets.map(({ id }) => id),
  gradient: gradientPresetIds,
  pattern: patternPresetIds,
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
    overrides.background = { ...configuration.background };
  }
  if (
    configuration.bodyHeadingAlignment !==
    themeConfiguration.bodyHeadingAlignment
  ) {
    overrides.bodyHeadingAlignment = configuration.bodyHeadingAlignment;
  }
  if (configuration.coverLayout !== themeConfiguration.coverLayout) {
    overrides.coverLayout = configuration.coverLayout;
  }
  if (configuration.density !== themeConfiguration.density) {
    overrides.density = configuration.density;
  }
  if (configuration.fontId !== themeConfiguration.fontId) {
    overrides.fontId = configuration.fontId;
  }

  return overrides;
};

const getThemeConfiguration = (themeId: string): StyleConfiguration =>
  resolveThemeDefaults(getThemeById(themeId) ?? defaultTheme);

const cloneConfiguration = (
  configuration: StyleConfiguration
): StyleConfiguration => ({
  ...configuration,
  background: { ...configuration.background },
});

const bodyHeadingAlignments = new Set<string>(
  configurationOptions.bodyHeadingAlignment
);
const coverLayouts = new Set<string>(configurationOptions.coverLayout);
const backgroundPresets = new Set<string>(
  configurationOptions.backgroundPreset
);
const gradientPresets = new Set<string>(configurationOptions.gradient);
const patternPresets = new Set<string>(configurationOptions.pattern);
const fontIds = new Set<string>(configurationOptions.fontId);
const densities = new Set<string>(configurationOptions.density);
// 旧三档持久化值中仅 balanced 消失，按像素等价迁移到 normal；
// 五档新值（含 compact/spacious）恒等保留，保证界面可选且刷新稳定。
const legacyDensities = new Map<string, StyleConfiguration["density"]>([
  ["balanced", "normal"],
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
    value.kind === "gradient" &&
    typeof value.gradient === "string" &&
    gradientPresets.has(value.gradient)
  ) {
    return {
      gradient: value.gradient as GradientPreset,
      kind: "gradient",
    };
  }
  if (
    value.kind === "pattern" &&
    typeof value.pattern === "string" &&
    patternPresets.has(value.pattern)
  ) {
    return {
      kind: "pattern",
      pattern: value.pattern as PatternPreset,
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
): StyleConfiguration["density"] | undefined => {
  if (typeof value !== "string") {
    return;
  }
  const density = legacyDensities.get(value) ?? value;
  return densities.has(density)
    ? (density as StyleConfiguration["density"])
    : undefined;
};

const sanitizeFontId = (
  value: unknown
): StyleConfiguration["fontId"] | undefined => {
  if (typeof value !== "string") {
    return;
  }
  const fontId = legacyFontIds.get(value) ?? value;
  return fontIds.has(fontId)
    ? (fontId as StyleConfiguration["fontId"])
    : undefined;
};

const sanitizeConfiguration = (value: unknown): StyleConfigurationOverrides => {
  if (!isRecord(value)) {
    return {};
  }

  const bodyHeadingAlignment =
    value.bodyHeadingAlignment ?? value.headingAlignment;
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
    ...(typeof value.coverLayout === "string" &&
    coverLayouts.has(value.coverLayout)
      ? {
          coverLayout: value.coverLayout as StyleConfiguration["coverLayout"],
        }
      : {}),
    ...(density ? { density } : {}),
    ...(fontId ? { fontId } : {}),
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
  const configuration = cloneConfiguration({
    ...themeConfiguration,
    ...state.overrides,
  });

  return {
    configuration,
    isModified: Object.keys(state.overrides).length > 0,
    overridden: {
      background: "background" in state.overrides,
      bodyHeadingAlignment: "bodyHeadingAlignment" in state.overrides,
      coverLayout: "coverLayout" in state.overrides,
      density: "density" in state.overrides,
      fontId: "fontId" in state.overrides,
    },
    theme: {
      description: theme.description,
      id: theme.id,
      name: theme.name,
    },
    themeConfiguration: cloneConfiguration(themeConfiguration),
  };
};

const resolve = (
  state: StyleSystemState,
  context: RenderContext
): ResolvedStyle => {
  const theme = getThemeById(state.currentThemeId) ?? defaultTheme;
  const { configuration } = read(state);
  const foundation = resolveStyleFoundation(configuration, theme.internals);
  const adjustedStyle = applyAdjustments(foundation.style, configuration);
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
    headerBar: foundation.headerBar,
    styles: generateStyles(
      adjustedStyle,
      context.page === "cover"
        ? { coverStyle: { ...foundation.coverStyle, ...coverLayout } }
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
