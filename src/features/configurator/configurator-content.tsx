"use client";

import { ArrowReloadHorizontalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { CSSProperties } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SegmentedControl } from "@/components/ui/segmented-control";
import {
  type StyleConfiguration,
  styleSystem,
} from "@/lib/style-system/style-system";
import { useContentThemeStore, useWatermarkStore } from "@/store/theme";
import { BackgroundPicker } from "./background-picker";
import { ConfigurationField } from "./configuration-field";
import { CoverLayoutPicker } from "./cover-layout-picker";
import { SettingsSection } from "./settings-section";
import { ThemeGrid } from "./theme-grid";

const pageNumberOptions = [
  { value: "show", label: "显示" },
  { value: "hide", label: "隐藏" },
];

const optionValues = styleSystem.configurationOptions();
type BackgroundChoice = StyleConfiguration["background"];
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
const fontLabels: Record<string, string> = {
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
const fontOptions = optionValues.fontId.map((value) => ({
  label: fontLabels[value] ?? value,
  value,
}));

const fieldLabelIds = {
  bodyHeadingAlignment: "body-heading-alignment-label",
  coverLayout: "cover-layout-label",
  density: "density-label",
  font: "font-label",
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
    setDensity,
    setFont,
    resetConfiguration,
    resetConfigurationField,
  } = useContentThemeStore();
  const { signature, showPageNumber, setSignature, setShowPageNumber } =
    useWatermarkStore();

  const { configuration, isModified, overridden, theme, themeConfiguration } =
    styleSystem.read({
      currentThemeId,
      overrides,
    });
  const backgroundPreview = (background: BackgroundChoice): CSSProperties => {
    const previewState = styleSystem.transition(
      { currentThemeId, overrides },
      {
        patch: { background },
        type: "update-configuration",
      }
    );
    const preview = styleSystem.resolve(previewState, { page: "body" }).styles
      .container;

    return {
      backgroundColor: preview.backgroundColor,
      backgroundImage: preview.backgroundImage,
      backgroundPosition: preview.backgroundPosition,
      backgroundRepeat: preview.backgroundRepeat,
      backgroundSize: preview.backgroundSize,
    };
  };

  return (
    <div className="space-y-3">
      <SettingsSection headingId={sectionHeadingIds.theme} title="主题">
        <ThemeGrid
          currentThemeId={currentThemeId}
          isModified={isModified}
          labelledBy={sectionHeadingIds.theme}
          onSelect={selectPresetTheme}
        />
      </SettingsSection>

      <SettingsSection
        headingId={sectionHeadingIds.background}
        isModified={overridden.background}
        onReset={() => resetConfigurationField("background")}
        title="背景"
      >
        <BackgroundPicker
          labelledBy={sectionHeadingIds.background}
          onChange={setBackground}
          onResetToTheme={() => resetConfigurationField("background")}
          themeBackground={themeConfiguration.background}
          themePreviewStyle={backgroundPreview(themeConfiguration.background)}
          value={configuration.background}
        />
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
          <SegmentedControl
            className="w-full"
            labelledBy={fieldLabelIds.font}
            onChange={(fontId) =>
              setFont(fontId as StyleConfiguration["fontId"])
            }
            options={fontOptions}
            value={configuration.fontId}
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
