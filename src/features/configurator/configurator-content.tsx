"use client";

import type { CSSProperties } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Switch } from "@/components/ui/switch";
import {
  type StyleConfiguration,
  styleSystem,
} from "@/lib/style-system/style-system";
import { useContentThemeStore, useWatermarkStore } from "@/store/theme";
import { AccentColorRow } from "./accent-color-row";
import { BackgroundPicker } from "./background-picker";
import { ConfigurationField } from "./configuration-field";
import { ConfigurationSegmentRow } from "./configuration-segment-row";
import { CoverLayoutPicker } from "./cover-layout-picker";
import { CustomThemeActions } from "./custom-theme-actions";
import { FrostRow } from "./frost-row";
import { ResetThemeButton } from "./reset-theme-button";
import { SettingsGroup } from "./settings-group";
import { SettingsSection } from "./settings-section";
import { ThemeGrid } from "./theme-grid";

const optionValues = styleSystem.configurationOptions();
type BackgroundChoice = StyleConfiguration["background"];
const aspectRatioLabels: Record<StyleConfiguration["aspectRatio"], string> = {
  "1:1": "1:1",
  "3:4": "3:4",
  "9:16": "9:16",
};
const cardFrameLabels: Record<StyleConfiguration["cardFrame"], string> = {
  none: "无",
  white: "白边",
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
const fontLabels: Record<string, string> = {
  kai: "楷体",
  mono: "等宽",
  sans: "无衬线",
  serif: "衬线",
};

const aspectRatioOptions = optionValues.aspectRatio.map((value) => ({
  label: aspectRatioLabels[value],
  value,
}));
const bodyHeadingAlignmentOptions = optionValues.bodyHeadingAlignment.map(
  (value) => ({ label: bodyHeadingAlignmentLabels[value], value })
);
const cardFrameOptions = optionValues.cardFrame.map((value) => ({
  label: cardFrameLabels[value],
  value,
}));
const densityOptions = optionValues.density.map((value) => ({
  label: densityLabels[value],
  value,
}));
const fontOptions = optionValues.fontId.map((value) => ({
  label: fontLabels[value] ?? value,
  value,
}));

const fieldLabelIds = {
  accentColor: "accent-color-label",
  aspectRatio: "aspect-ratio-label",
  background: "background-field-label",
  bodyHeadingAlignment: "body-heading-alignment-label",
  cardFrame: "card-frame-label",
  coverLayout: "cover-layout-label",
  density: "density-label",
  font: "font-label",
  frost: "frost-label",
} as const;

const sectionHeadingIds = {
  accent: "accent-section-heading",
  background: "background-section-heading",
  bodyHeading: "body-heading-section-heading",
  card: "card-section-heading",
  cardMark: "card-mark-section-heading",
  cover: "cover-section-heading",
  theme: "theme-section-heading",
  typography: "typography-section-heading",
} as const;

export const ConfiguratorContent = () => {
  const {
    currentThemeId,
    customThemes,
    overrides,
    selectPresetTheme,
    updateConfiguration,
    resetConfiguration,
    resetConfigurationField,
  } = useContentThemeStore();
  const { signature, showPageNumber, setSignature, setShowPageNumber } =
    useWatermarkStore();

  const { configuration, isModified, overridden, theme, themeConfiguration } =
    styleSystem.read({
      currentThemeId,
      customThemes,
      overrides,
    });
  const backgroundPreview = (background: BackgroundChoice): CSSProperties => {
    const previewState = styleSystem.transition(
      { currentThemeId, customThemes, overrides },
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
    <div className="flex flex-col gap-3.5">
      <SettingsSection
        action={
          <ResetThemeButton
            disabled={!isModified}
            onReset={resetConfiguration}
            themeName={theme.name}
          />
        }
        headingId={sectionHeadingIds.theme}
        title="主题"
      >
        <ThemeGrid
          currentThemeId={currentThemeId}
          customThemes={customThemes}
          isModified={isModified}
          labelledBy={sectionHeadingIds.theme}
          onSelect={selectPresetTheme}
        />
      </SettingsSection>

      <SettingsGroup headingId={sectionHeadingIds.background} title="背景">
        <ConfigurationField
          isModified={overridden.background}
          label="背景"
          labelId={fieldLabelIds.background}
          onReset={() => resetConfigurationField("background")}
        >
          <BackgroundPicker
            labelledBy={fieldLabelIds.background}
            onChange={(background) => updateConfiguration({ background })}
            onResetToTheme={() => resetConfigurationField("background")}
            themeBackground={themeConfiguration.background}
            themePreviewStyle={backgroundPreview(themeConfiguration.background)}
            value={configuration.background}
          />
        </ConfigurationField>

        {configuration.background.kind === "image" && (
          <FrostRow label="磨砂" labelId={fieldLabelIds.frost} />
        )}
      </SettingsGroup>

      <SettingsGroup headingId={sectionHeadingIds.card} title="卡片">
        <ConfigurationSegmentRow
          field="aspectRatio"
          label="比例"
          labelId={fieldLabelIds.aspectRatio}
          options={aspectRatioOptions}
        />
        <ConfigurationSegmentRow
          field="cardFrame"
          label="边框"
          labelId={fieldLabelIds.cardFrame}
          options={cardFrameOptions}
        />
      </SettingsGroup>

      <SettingsGroup headingId={sectionHeadingIds.typography} title="排版">
        <ConfigurationField
          isModified={overridden.density}
          label="密度"
          labelId={fieldLabelIds.density}
          onReset={() => resetConfigurationField("density")}
        >
          <SegmentedControl
            labelledBy={fieldLabelIds.density}
            onChange={(density) =>
              updateConfiguration({
                density: density as StyleConfiguration["density"],
              })
            }
            options={densityOptions}
            value={configuration.density}
          />
        </ConfigurationField>

        <ConfigurationSegmentRow
          field="fontId"
          label="字体"
          labelId={fieldLabelIds.font}
          options={fontOptions}
        />
      </SettingsGroup>

      <SettingsGroup headingId={sectionHeadingIds.bodyHeading} title="正文标题">
        <ConfigurationField
          isModified={overridden.bodyHeadingAlignment}
          label="标题对齐"
          labelId={fieldLabelIds.bodyHeadingAlignment}
          onReset={() => resetConfigurationField("bodyHeadingAlignment")}
        >
          <SegmentedControl
            labelledBy={fieldLabelIds.bodyHeadingAlignment}
            onChange={(alignment) =>
              updateConfiguration({
                bodyHeadingAlignment:
                  alignment as StyleConfiguration["bodyHeadingAlignment"],
              })
            }
            options={bodyHeadingAlignmentOptions}
            value={configuration.bodyHeadingAlignment}
          />
        </ConfigurationField>
      </SettingsGroup>

      <SettingsGroup headingId={sectionHeadingIds.cover} title="封面">
        <ConfigurationField
          isModified={overridden.coverLayout}
          label="封面版式"
          labelId={fieldLabelIds.coverLayout}
          onReset={() => resetConfigurationField("coverLayout")}
        >
          <CoverLayoutPicker
            labelledBy={fieldLabelIds.coverLayout}
            onChange={(coverLayout) => updateConfiguration({ coverLayout })}
            value={configuration.coverLayout}
          />
        </ConfigurationField>
      </SettingsGroup>

      <SettingsGroup headingId={sectionHeadingIds.accent} title="颜色">
        <AccentColorRow
          label="强调色"
          labelId={fieldLabelIds.accentColor}
        />
      </SettingsGroup>

      <SettingsGroup headingId={sectionHeadingIds.cardMark} title="卡片标记">
        <Label className="sr-only" htmlFor="card-signature">
          署名
        </Label>
        <Input
          id="card-signature"
          onChange={(event) => setSignature(event.target.value)}
          placeholder="署名，如 @你的小红书名"
          value={signature}
        />
        <Switch
          checked={showPageNumber}
          label="正文页码"
          onCheckedChange={setShowPageNumber}
        />
      </SettingsGroup>

      <CustomThemeActions />
    </div>
  );
};
