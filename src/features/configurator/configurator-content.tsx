"use client";

import { ArrowReloadHorizontalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { CSSProperties } from "react";
import { Select } from "@/components/enhance/select";
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
import { ContentSurfacePicker } from "./content-surface-picker";
import { CoverLayoutPicker } from "./cover-layout-picker";
import { DecorationColorPicker } from "./decoration-color-picker";
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
const bodyHeadingSizeLabels: Record<
  StyleConfiguration["bodyHeadingSize"],
  string
> = { large: "大", medium: "中", small: "小" };
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
  kai: "楷体",
  mono: "等宽",
  rounded: "圆体",
  sans: "无衬线",
  serif: "衬线",
  system: "系统默认",
};

const bodyHeadingAlignmentOptions = optionValues.bodyHeadingAlignment.map(
  (value) => ({ label: bodyHeadingAlignmentLabels[value], value })
);
const bodyHeadingSizeOptions = optionValues.bodyHeadingSize.map((value) => ({
  label: bodyHeadingSizeLabels[value],
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
const headingDecorationOptions = optionValues.headingDecoration.map(
  (value) => ({
    label: headingDecorationLabels[value],
    value,
  })
);

const fieldLabelIds = {
  background: "background-label",
  bodyHeadingAlignment: "body-heading-alignment-label",
  bodyHeadingSize: "body-heading-size-label",
  contentSurface: "content-surface-label",
  coverLayout: "cover-layout-label",
  decorationColor: "decoration-color-label",
  density: "density-label",
  headingDecoration: "heading-decoration-label",
  pageNumber: "page-number-label",
} as const;

export const ConfiguratorContent = () => {
  const {
    currentThemeId,
    overrides,
    selectPresetTheme,
    setBackground,
    setBodyHeadingAlignment,
    setBodyHeadingSize,
    setContentSurface,
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

  const { configuration, isModified, overridden } = styleSystem.read({
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
  const contentSurfacePreviews = Object.fromEntries(
    optionValues.contentSurface.map((value) => {
      const previewState = styleSystem.transition(
        { currentThemeId, overrides },
        {
          patch: { contentSurface: value },
          type: "update-configuration",
        }
      );
      const { container, innerContainer } = styleSystem.resolve(previewState, {
        page: "body",
      }).styles;

      return [value, { container, innerContainer }];
    })
  ) as Record<
    StyleConfiguration["contentSurface"],
    {
      container: CSSProperties;
      innerContainer: CSSProperties;
    }
  >;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="font-medium text-xs">主题</Label>
        <ThemeGrid
          currentThemeId={currentThemeId}
          onSelect={selectPresetTheme}
        />
      </div>

      <section className="space-y-3 border-t pt-4">
        <h3 className="font-semibold text-sm">画布</h3>

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

        <ConfigurationField
          isModified={overridden.contentSurface}
          label="内容底板"
          labelId={fieldLabelIds.contentSurface}
          onReset={() => resetConfigurationField("contentSurface")}
        >
          <ContentSurfacePicker
            labelledBy={fieldLabelIds.contentSurface}
            onChange={setContentSurface}
            previews={contentSurfacePreviews}
            value={configuration.contentSurface}
          />
        </ConfigurationField>
      </section>

      <div className="space-y-2">
        <Label className="font-medium text-xs" id={fieldLabelIds.density}>
          密度
        </Label>
        <SegmentedControl
          className="w-full"
          labelledBy={fieldLabelIds.density}
          onChange={(v) => setDensity(v as typeof configuration.density)}
          options={densityOptions}
          value={configuration.density}
        />
      </div>

      <div className="space-y-2">
        <Label className="font-medium text-xs">字体</Label>
        <Select
          className="w-full"
          onChange={setFont}
          options={fontOptions}
          value={configuration.fontId}
        />
      </div>

      <section className="space-y-3 border-t pt-4">
        <h3 className="font-semibold text-sm">正文标题</h3>

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
          isModified={overridden.bodyHeadingSize}
          label="正文标题大小"
          labelId={fieldLabelIds.bodyHeadingSize}
          onReset={() => resetConfigurationField("bodyHeadingSize")}
        >
          <SegmentedControl
            className="w-full"
            labelledBy={fieldLabelIds.bodyHeadingSize}
            onChange={(value) =>
              setBodyHeadingSize(value as typeof configuration.bodyHeadingSize)
            }
            options={bodyHeadingSizeOptions}
            value={configuration.bodyHeadingSize}
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
      </section>

      <section className="space-y-3 border-t pt-4">
        <h3 className="font-semibold text-sm">封面</h3>
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
      </section>

      <div className="space-y-2">
        <Label className="font-medium text-xs">署名</Label>
        <Input
          onChange={(e) => setSignature(e.target.value)}
          placeholder="@你的小红书名"
          value={signature}
        />
      </div>

      <div className="space-y-2">
        <Label className="font-medium text-xs" id={fieldLabelIds.pageNumber}>
          页码
        </Label>
        <SegmentedControl
          className="w-full"
          labelledBy={fieldLabelIds.pageNumber}
          onChange={(v) => setShowPageNumber(v === "show")}
          options={pageNumberOptions}
          value={showPageNumber ? "show" : "hide"}
        />
      </div>

      {isModified && (
        <button
          className="flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-muted-foreground text-xs transition-colors hover:bg-accent hover:text-foreground"
          onClick={resetConfiguration}
          type="button"
        >
          <HugeiconsIcon className="h-3 w-3" icon={ArrowReloadHorizontalIcon} />
          重置风格
        </button>
      )}
    </div>
  );
};
