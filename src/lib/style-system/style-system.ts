import { applyAdjustments, resolveThemeDefaults } from "../theme/adjustments";
import { backgroundPresetIds, canvasBackgroundsEqual } from "../theme/canvas";
import { fontPresets } from "../theme/fonts";
import { resolveStyleFoundation } from "../theme/foundation";
import { generateStyles } from "../theme/generator";
import { defaultTheme, getThemeById, presetThemes } from "../theme/themes";
import type {
  BackgroundFrost,
  BackgroundPreset,
  CoverStyleOverride,
  GradientDirection,
  ThemeInternals,
} from "../theme/types";
import type {
  CustomTheme,
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
  CustomTheme,
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
  ThemeSource,
} from "./types";

const builtInCatalog: readonly ThemeCatalogItem[] = presetThemes.map(
  ({ description, id, name }) => ({
    description,
    id,
    name,
    source: "built-in" as const,
  })
);
/** 自定义主题上限；界面在到达上限前就禁用保存入口 */
export const maxCustomThemes = 8;
/** 自定义主题名称去空白后的最大长度 */
export const maxCustomThemeNameLength = 12;
const customThemeIdPattern = /^custom-[a-z\d]+$/;
const hexColorPattern = /^#[\da-f]{6}$/i;
const imageDataUrlPattern = /^data:image\//;
// 图片背景经上传压缩（JPEG ≤1600px）后持久化在 localStorage，留出配额余量
const maxImageDataUrlLength = 4_000_000;
const configurationOptions = {
  aspectRatio: ["3:4", "1:1", "9:16"],
  bodyHeadingAlignment: ["center", "left"],
  cardFrame: ["none", "white"],
  coverLayout: ["center-poster", "top-left", "bottom-left"],
  density: ["compact", "snug", "normal", "relaxed", "spacious"],
  fontId: fontPresets.map(({ id }) => id),
  frost: ["none", "light", "medium", "strong"],
} satisfies StyleConfigurationOptions;

const diffConfiguration = (
  configuration: StyleConfiguration,
  themeConfiguration: StyleConfiguration
): StyleConfigurationOverrides => {
  const overrides: {
    -readonly [Field in keyof StyleConfiguration]?: StyleConfiguration[Field];
  } = {};

  if (configuration.accentColor !== themeConfiguration.accentColor) {
    overrides.accentColor = configuration.accentColor;
  }
  if (configuration.aspectRatio !== themeConfiguration.aspectRatio) {
    overrides.aspectRatio = configuration.aspectRatio;
  }
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
  if (configuration.cardFrame !== themeConfiguration.cardFrame) {
    overrides.cardFrame = configuration.cardFrame;
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

const cloneConfiguration = (
  configuration: StyleConfiguration
): StyleConfiguration => ({
  ...configuration,
  background: { ...configuration.background },
});

interface ResolvedTheme {
  readonly configuration: StyleConfiguration;
  readonly internals?: ThemeInternals;
  readonly item: ThemeCatalogItem;
}

const findCustomTheme = (
  state: StyleSystemState,
  themeId: string
): CustomTheme | undefined =>
  state.customThemes.find((theme) => theme.id === themeId);

/**
 * 按标识解析主题：先查自定义主题，再查内置主题，未知标识回落默认内置主题。
 * 自定义主题没有内部规则（如 Apple 备忘录的顶栏），只带配置快照。
 */
const findTheme = (state: StyleSystemState, themeId: string): ResolvedTheme => {
  const custom = findCustomTheme(state, themeId);
  if (custom) {
    return {
      configuration: cloneConfiguration(custom.configuration),
      item: { id: custom.id, name: custom.name, source: "custom" },
    };
  }
  const preset = getThemeById(themeId) ?? defaultTheme;
  return {
    configuration: resolveThemeDefaults(preset),
    internals: preset.internals,
    item: {
      description: preset.description,
      id: preset.id,
      name: preset.name,
      source: "built-in",
    },
  };
};

const themeExists = (state: StyleSystemState, themeId: string): boolean =>
  findCustomTheme(state, themeId) !== undefined ||
  getThemeById(themeId) !== undefined;

const aspectRatios = new Set<string>(configurationOptions.aspectRatio);
const bodyHeadingAlignments = new Set<string>(
  configurationOptions.bodyHeadingAlignment
);
const cardFrames = new Set<string>(configurationOptions.cardFrame);
const coverLayouts = new Set<string>(configurationOptions.coverLayout);
const backgroundPresets = new Set<string>(backgroundPresetIds);
const gradientDirections = new Set<string>([
  "vertical",
  "horizontal",
  "diagonal",
]);
const fontIds = new Set<string>(configurationOptions.fontId);
const frostLevels = new Set<string>(configurationOptions.frost);
const densities = new Set<string>(configurationOptions.density);
// 旧三档持久化值中仅 balanced 消失，按像素等价迁移到 normal；
// 五档新值（含 compact/spacious）恒等保留，保证界面可选且刷新稳定。
const legacyDensities = new Map<string, StyleConfiguration["density"]>([
  ["balanced", "normal"],
]);
// kai 与 mono 已是正式字体，旧持久化值直接生效；只有再无对应字体的旧值才迁移
const legacyFontIds = new Map<string, string>([
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
    value.kind === "custom-gradient" &&
    typeof value.from === "string" &&
    hexColorPattern.test(value.from) &&
    typeof value.to === "string" &&
    hexColorPattern.test(value.to) &&
    typeof value.direction === "string" &&
    gradientDirections.has(value.direction)
  ) {
    return {
      direction: value.direction as GradientDirection,
      from: value.from.toLowerCase(),
      kind: "custom-gradient",
      to: value.to.toLowerCase(),
    };
  }
  if (
    value.kind === "image" &&
    typeof value.dataUrl === "string" &&
    imageDataUrlPattern.test(value.dataUrl) &&
    value.dataUrl.length <= maxImageDataUrlLength &&
    (value.tone === "light" || value.tone === "dark")
  ) {
    return {
      dataUrl: value.dataUrl,
      // 旧持久化数据没有磨砂字段，非法值同样回落无磨砂
      frost:
        typeof value.frost === "string" && frostLevels.has(value.frost)
          ? (value.frost as BackgroundFrost)
          : "none",
      kind: "image",
      tone: value.tone,
    };
  }
  if (
    value.kind === "solid" &&
    typeof value.color === "string" &&
    hexColorPattern.test(value.color)
  ) {
    return { color: value.color.toLowerCase(), kind: "solid" };
  }
  // 旧版受控渐变/图案背景已下线，持久化旧值按非法值丢弃，回落主题背景
};

// 强调色是开放色值（与背景色一致），只做 6 位十六进制白名单，不列封闭选项
const sanitizeAccentColor = (value: unknown): string | undefined =>
  typeof value === "string" && hexColorPattern.test(value)
    ? value.toLowerCase()
    : undefined;

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
  const accentColor = sanitizeAccentColor(value.accentColor);
  const background = sanitizeBackground(value.background);
  const density = sanitizeDensity(value.density);
  const fontId = sanitizeFontId(value.fontId);

  return {
    ...(accentColor ? { accentColor } : {}),
    ...(typeof value.aspectRatio === "string" &&
    aspectRatios.has(value.aspectRatio)
      ? { aspectRatio: value.aspectRatio as StyleConfiguration["aspectRatio"] }
      : {}),
    ...(background ? { background } : {}),
    ...(typeof bodyHeadingAlignment === "string" &&
    bodyHeadingAlignments.has(bodyHeadingAlignment)
      ? {
          bodyHeadingAlignment:
            bodyHeadingAlignment as StyleConfiguration["bodyHeadingAlignment"],
        }
      : {}),
    ...(typeof value.cardFrame === "string" && cardFrames.has(value.cardFrame)
      ? { cardFrame: value.cardFrame as StyleConfiguration["cardFrame"] }
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

/**
 * 校验一条自定义主题：标识与名称必须合法，配置走与覆盖同一条 sanitize 路径，
 * 缺失字段由默认内置主题补齐——以后新增配置字段的已存主题自动获得默认值。
 */
const sanitizeCustomTheme = (value: unknown): CustomTheme | undefined => {
  if (!isRecord(value)) {
    return;
  }
  if (typeof value.id !== "string" || !customThemeIdPattern.test(value.id)) {
    return;
  }
  if (typeof value.name !== "string") {
    return;
  }
  const name = value.name.trim();
  if (name.length === 0 || name.length > maxCustomThemeNameLength) {
    return;
  }
  return {
    configuration: {
      ...resolveThemeDefaults(defaultTheme),
      ...sanitizeConfiguration(value.configuration),
    },
    createdAt:
      typeof value.createdAt === "number" && Number.isFinite(value.createdAt)
        ? value.createdAt
        : 0,
    id: value.id,
    name,
  };
};

const sanitizeCustomThemes = (value: unknown): readonly CustomTheme[] => {
  if (!Array.isArray(value)) {
    return [];
  }
  const themes: CustomTheme[] = [];
  for (const entry of value) {
    if (themes.length >= maxCustomThemes) {
      break;
    }
    const theme = sanitizeCustomTheme(entry);
    if (theme && !themes.some(({ id }) => id === theme.id)) {
      themes.push(theme);
    }
  }
  return themes;
};

const hydrate = (persisted: unknown): StyleSystemState => {
  const legacy = isRecord(persisted) ? persisted : {};
  const customThemes = sanitizeCustomThemes(legacy.customThemes);
  const persistedThemeId =
    typeof legacy.currentThemeId === "string" ? legacy.currentThemeId : "";
  const custom = customThemes.find(({ id }) => id === persistedThemeId);

  // 指向已被丢弃（非法或超出上限）的自定义主题时，回落默认主题并清空覆盖：
  // 覆盖是相对旧主题的差值，换主题后已无意义
  if (!custom && customThemeIdPattern.test(persistedThemeId)) {
    return { currentThemeId: defaultTheme.id, customThemes, overrides: {} };
  }

  const theme = findTheme(
    { currentThemeId: persistedThemeId, customThemes, overrides: {} },
    persistedThemeId
  );
  const themeConfiguration = theme.configuration;
  const persistedConfiguration =
    legacy.overrides ?? legacy.configuration ?? legacy.adjustments;
  const configuration: StyleConfiguration = {
    ...themeConfiguration,
    ...sanitizeConfiguration(persistedConfiguration),
  };

  return {
    currentThemeId: theme.item.id,
    customThemes,
    overrides: diffConfiguration(configuration, themeConfiguration),
  };
};

/** 生成不与已有自定义主题重名的标识；同毫秒内连续保存时追加序号 */
const createCustomThemeId = (state: StyleSystemState, now: number): string => {
  const base = `custom-${now.toString(36)}`;
  if (!findCustomTheme(state, base)) {
    return base;
  }
  let suffix = 1;
  while (findCustomTheme(state, `${base}${suffix}`)) {
    suffix += 1;
  }
  return `${base}${suffix}`;
};

const saveCustomTheme = (
  state: StyleSystemState,
  name: string,
  now: number
): StyleSystemState => {
  const trimmed = name.trim();
  if (
    trimmed.length === 0 ||
    trimmed.length > maxCustomThemeNameLength ||
    state.customThemes.length >= maxCustomThemes
  ) {
    return state;
  }

  const id = createCustomThemeId(state, now);
  return {
    currentThemeId: id,
    customThemes: [
      ...state.customThemes,
      {
        configuration: read(state).configuration,
        createdAt: now,
        id,
        name: trimmed,
      },
    ],
    overrides: {},
    previousSelection: {
      currentThemeId: state.currentThemeId,
      overrides: state.overrides,
    },
  };
};

const updateCustomTheme = (state: StyleSystemState): StyleSystemState => {
  const current = findCustomTheme(state, state.currentThemeId);
  if (!current) {
    return state;
  }
  const { configuration } = read(state);
  return {
    currentThemeId: state.currentThemeId,
    customThemes: state.customThemes.map((theme) =>
      theme.id === current.id ? { ...theme, configuration } : theme
    ),
    overrides: {},
  };
};

const deleteCustomTheme = (
  state: StyleSystemState,
  id: string
): StyleSystemState => {
  if (!findCustomTheme(state, id)) {
    return state;
  }
  const customThemes = state.customThemes.filter((theme) => theme.id !== id);
  const isCurrent = state.currentThemeId === id;
  // 撤销记录指向已删除的主题时一并丢弃，避免撤销回一个不存在的选择
  const previousSelection =
    state.previousSelection?.currentThemeId === id
      ? undefined
      : state.previousSelection;

  return {
    currentThemeId: isCurrent ? defaultTheme.id : state.currentThemeId,
    customThemes,
    overrides: isCurrent ? {} : state.overrides,
    previousSelection,
  };
};

const transition = (
  state: StyleSystemState,
  command: StyleSystemCommand
): StyleSystemState => {
  if (command.type === "update-configuration") {
    const themeConfiguration = findTheme(
      state,
      state.currentThemeId
    ).configuration;
    return {
      currentThemeId: state.currentThemeId,
      customThemes: state.customThemes,
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
    const themeConfiguration = findTheme(
      state,
      state.currentThemeId
    ).configuration;
    return {
      currentThemeId: state.currentThemeId,
      customThemes: state.customThemes,
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
    return {
      currentThemeId: findTheme(state, state.currentThemeId).item.id,
      customThemes: state.customThemes,
      overrides: {},
    };
  }

  if (command.type === "undo-theme-selection") {
    const previous = state.previousSelection;
    return previous
      ? {
          currentThemeId: previous.currentThemeId,
          customThemes: state.customThemes,
          overrides: previous.overrides,
        }
      : state;
  }

  if (command.type === "save-custom-theme") {
    return saveCustomTheme(state, command.name, command.now ?? Date.now());
  }

  if (command.type === "update-custom-theme") {
    return updateCustomTheme(state);
  }

  if (command.type === "delete-custom-theme") {
    return deleteCustomTheme(state, command.id);
  }

  return themeExists(state, command.themeId)
    ? {
        currentThemeId: command.themeId,
        customThemes: state.customThemes,
        overrides: {},
        previousSelection: {
          currentThemeId: state.currentThemeId,
          overrides: state.overrides,
        },
      }
    : state;
};

const read = (state: StyleSystemState): StyleSystemSnapshot => {
  const theme = findTheme(state, state.currentThemeId);
  const themeConfiguration = theme.configuration;
  const configuration = cloneConfiguration({
    ...themeConfiguration,
    ...state.overrides,
  });

  return {
    configuration,
    isModified: Object.keys(state.overrides).length > 0,
    overridden: {
      accentColor: "accentColor" in state.overrides,
      aspectRatio: "aspectRatio" in state.overrides,
      background: "background" in state.overrides,
      bodyHeadingAlignment: "bodyHeadingAlignment" in state.overrides,
      cardFrame: "cardFrame" in state.overrides,
      coverLayout: "coverLayout" in state.overrides,
      density: "density" in state.overrides,
      fontId: "fontId" in state.overrides,
    },
    theme: theme.item,
    themeConfiguration: cloneConfiguration(themeConfiguration),
  };
};

const resolve = (
  state: StyleSystemState,
  context: RenderContext
): ResolvedStyle => {
  const theme = findTheme(state, state.currentThemeId);
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
    theme: theme.item,
  };
};

/** 目录：不带状态只有内置主题；带状态时自定义主题按保存顺序排在内置之后 */
const catalog = (state?: StyleSystemState): readonly ThemeCatalogItem[] =>
  state && state.customThemes.length > 0
    ? [
        ...builtInCatalog,
        ...state.customThemes.map(({ id, name }) => ({
          id,
          name,
          source: "custom" as const,
        })),
      ]
    : builtInCatalog;

export const styleSystem = {
  catalog,
  configurationOptions: (): StyleConfigurationOptions => configurationOptions,
  hydrate,
  read,
  resolve,
  transition,
} satisfies StyleSystem;
