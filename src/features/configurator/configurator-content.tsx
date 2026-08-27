"use client";

import { ArrowReloadHorizontalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SegmentedControl } from "@/components/ui/segmented-control";
import {
  type StyleConfiguration,
  styleSystem,
} from "@/lib/style-system/style-system";
import { useContentThemeStore, useWatermarkStore } from "@/store/theme";
import { type BackgroundOption, BackgroundPicker } from "./background-picker";
import { ConfigurationField } from "./configuration-field";
import { CoverLayoutPicker } from "./cover-layout-picker";
import { DecorationColorPicker } from "./decoration-color-picker";
import { FontPicker } from "./font-picker";
import { SettingsSection } from "./settings-section";
import { ThemeGrid } from "./theme-grid";

const pageNumberOptions = [
  { value: "show", label: "显示" },
  { value: "hide", label: "隐藏" },
];

const optionValues = styleSystem.configurationOptions();
type BackgroundPreset = Extract<
  StyleConfiguration["background"],
  { kind: "preset" }
>["preset"];
const backgroundPresetLabels: Record<BackgroundPreset, string> = {
  "cherry-cream": "樱花奶霜",
  "clean-light": "清透白",
  "cool-mist": "晨雾微光",
  "night-aurora": "墨夜极光",
  "trianglify-gray": "灰阶三角",
  "warm-sun": "蜜光暖阳",
};
const bodyHeadingAlignmentLabels: Record<
  StyleConfiguration["bodyHeadingAlignment"],
  string
> = { center: "居中", left: "左对齐" };
const densityLabels: Record<StyleConfiguration["density"], string> = {
  compact: "紧凑",
  normal: "正常",
  relaxed: "较松",
  snug: "较紧",
  spacious: "宽松",
};
const headingDecorationLabels: Record<
  StyleConfiguration["headingDecoration"],
  string
> = {
  highlight: "高亮",
  none: "无",
  underline: "直线",
  wavy: "波浪",
};
const fontLabels: Record<string, string> = {
  auto: "跟随主题",
  sans: "无衬线",
  serif: "衬线",
};

const bodyHeadingAlignmentOptions = optionValues.bodyHeadingAlignment.map(
  (value) => ({ label: bodyHeadingAlignmentLabels[value], value })
);
const densityOptions = optionValues.density.map((value) => ({
  label: densityLabels[value],
  value,
}));
const fontOptions = ["auto", ...optionValues.fontId].map((value) => ({
  label: fontLabels[value] ?? value,
  value,
}));
const headingDecorationOptions = optionValues.headingDecoration.map(
  (value) => ({
    label: headingDecorationLabels[value],
    value,
  })
);

const fieldLabelIds = {
  background: "background-label",
  bodyHeadingAlignment: "body-heading-alignment-label",
  coverLayout: "cover-layout-label",
  decorationColor: "decoration-color-label",
  density: "density-label",
  font: "font-label",
  headingDecoration: "heading-decoration-label",
  pageNumber: "page-number-label",
  signature: "signature-label",
} as const;

const sectionHeadingIds = {
  background: "background-section-heading",
  bodyHeading: "body-heading-section-heading",
  cardMark: "card-mark-section-heading",
  cover: "cover-section-heading",
  theme: "theme-section-heading",
  typography: "typography-section-heading",
} as const;

export const ConfiguratorContent = () => {
  const {
    currentThemeId,
    overrides,
    selectPresetTheme,
    setBackground,
    setBodyHeadingAlignment,
    setCoverLayout,
    setDecorationColor,
    setDensity,
    setFont,
    setHeadingDecoration,
    resetConfiguration,
    resetConfigurationField,
  } = useContentThemeStore();
  const { signature, showPageNumber, setSignature, setShowPageNumber } =
    useWatermarkStore();

  const { configuration, isModified, overridden, theme } = styleSystem.read({
    currentThemeId,
    overrides,
  });
  const backgroundOptions: BackgroundOption[] =
    optionValues.backgroundPreset.map((value) => {
      const previewState = styleSystem.transition(
        { currentThemeId, overrides },
        {
          patch: { background: { kind: "preset", preset: value } },
          type: "update-configuration",
        }
      );
      const preview = styleSystem.resolve(previewState, { page: "body" }).styles
        .container;

      return {
        label: backgroundPresetLabels[value],
        previewStyle: {
          backgroundColor: preview.backgroundColor,
          backgroundImage: preview.backgroundImage,
          backgroundPosition: preview.backgroundPosition,
          backgroundSize: preview.backgroundSize,
        },
        value,
      };
    });

  return (
    <div className="space-y-4">
      <SettingsSection headingId={sectionHeadingIds.theme} title="主题">
        <ThemeGrid
          currentThemeId={currentThemeId}
          isModified={isModified}
          labelledBy={sectionHeadingIds.theme}
          onSelect={selectPresetTheme}
        />
      </SettingsSection>

      <SettingsSection headingId={sectionHeadingIds.background} title="背景">
        <ConfigurationField
          isModified={overridden.background}
          label="背景方案"
          labelId={fieldLabelIds.background}
          onReset={() => resetConfigurationField("background")}
        >
          <BackgroundPicker
            labelledBy={fieldLabelIds.background}
            onChange={setBackground}
            options={backgroundOptions}
            value={configuration.background}
          />
        </ConfigurationField>
      </SettingsSection>

      <SettingsSection headingId={sectionHeadingIds.typography} title="排版">
        <ConfigurationField
          isModified={overridden.density}
          label="密度"
          labelId={fieldLabelIds.density}
          onReset={() => resetConfigurationField("density")}
        >
          <SegmentedControl
            className="w-full"
            labelledBy={fieldLabelIds.density}
            onChange={(value) =>
              setDensity(value as typeof configuration.density)
            }
            options={densityOptions}
            value={configuration.density}
          />
        </ConfigurationField>

        <ConfigurationField
          isModified={overridden.fontId}
          label="字体"
          labelId={fieldLabelIds.font}
          onReset={() => resetConfigurationField("fontId")}
        >
          <FontPicker
            labelledBy={fieldLabelIds.font}
            onChange={(fontId) =>
              fontId === "auto"
                ? resetConfigurationField("fontId")
                : setFont(fontId as StyleConfiguration["fontId"])
            }
            options={fontOptions}
            value={overridden.fontId ? configuration.fontId : "auto"}
          />
        </ConfigurationField>
      </SettingsSection>

      <SettingsSection
        headingId={sectionHeadingIds.bodyHeading}
        title="正文标题"
      >
        <ConfigurationField
          isModified={overridden.bodyHeadingAlignment}
          label="正文标题对齐"
          labelId={fieldLabelIds.bodyHeadingAlignment}
          onReset={() => resetConfigurationField("bodyHeadingAlignment")}
        >
          <SegmentedControl
            className="w-full"
            labelledBy={fieldLabelIds.bodyHeadingAlignment}
            onChange={(value) =>
              setBodyHeadingAlignment(
                value as typeof configuration.bodyHeadingAlignment
              )
            }
            options={bodyHeadingAlignmentOptions}
            value={configuration.bodyHeadingAlignment}
          />
        </ConfigurationField>

        <ConfigurationField
          isModified={overridden.headingDecoration}
          label="标题装饰"
          labelId={fieldLabelIds.headingDecoration}
          onReset={() => resetConfigurationField("headingDecoration")}
        >
          <SegmentedControl
            className="w-full"
            labelledBy={fieldLabelIds.headingDecoration}
            onChange={(value) =>
              setHeadingDecoration(
                value as StyleConfiguration["headingDecoration"]
              )
            }
            options={headingDecorationOptions}
            value={configuration.headingDecoration}
          />
        </ConfigurationField>

        <ConfigurationField
          description={
            configuration.headingDecoration === "none"
              ? "选择标题装饰后可设置颜色"
              : undefined
          }
          descriptionId="decoration-color-status"
          isModified={overridden.decorationColor}
          label="装饰颜色"
          labelId={fieldLabelIds.decorationColor}
          onReset={() => resetConfigurationField("decorationColor")}
        >
          <DecorationColorPicker
            descriptionId="decoration-color-status"
            disabled={configuration.headingDecoration === "none"}
            labelledBy={fieldLabelIds.decorationColor}
            onChange={setDecorationColor}
            value={configuration.decorationColor}
          />
        </ConfigurationField>
      </SettingsSection>

      <SettingsSection headingId={sectionHeadingIds.cover} title="封面">
        <ConfigurationField
          isModified={overridden.coverLayout}
          label="封面版式"
          labelId={fieldLabelIds.coverLayout}
          onReset={() => resetConfigurationField("coverLayout")}
        >
          <CoverLayoutPicker
            labelledBy={fieldLabelIds.coverLayout}
            onChange={setCoverLayout}
            value={configuration.coverLayout}
          />
        </ConfigurationField>
      </SettingsSection>

      {isModified && (
        <button
          className="flex min-h-11 w-full items-center justify-center gap-1.5 rounded-lg px-3 text-muted-foreground text-xs transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onClick={resetConfiguration}
          type="button"
        >
          <HugeiconsIcon
            className="h-3.5 w-3.5"
            icon={ArrowReloadHorizontalIcon}
          />
          恢复“{theme.name}”主题配置
        </button>
      )}

      <SettingsSection headingId={sectionHeadingIds.cardMark} title="卡片标记">
        <div className="space-y-2">
          <Label
            className="font-medium text-xs"
            htmlFor="card-signature"
            id={fieldLabelIds.signature}
          >
            署名
          </Label>
          <Input
            className="h-11"
            id="card-signature"
            onChange={(event) => setSignature(event.target.value)}
            placeholder="@你的小红书名"
            value={signature}
          />
        </div>

        <div className="space-y-2">
          <Label className="font-medium text-xs" id={fieldLabelIds.pageNumber}>
            正文页码
          </Label>
          <SegmentedControl
            className="w-full"
            labelledBy={fieldLabelIds.pageNumber}
            onChange={(value) => setShowPageNumber(value === "show")}
            options={pageNumberOptions}
            value={showPageNumber ? "show" : "hide"}
          />
        </div>
      </SettingsSection>
    </div>
  );
};
