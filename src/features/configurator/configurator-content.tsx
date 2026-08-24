"use client";

import { ArrowReloadHorizontalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Select } from "@/components/enhance/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { styleSystem } from "@/lib/style-system/style-system";
import {
  bodyHeadingAlignmentOptions,
  bodyHeadingSizeOptions,
  densityOptions,
  fontOptions,
  type HeadingDecorationChoice,
} from "@/lib/theme";
import { useContentThemeStore, useWatermarkStore } from "@/store/theme";
import { ConfigurationField } from "./configuration-field";
import { CoverLayoutPicker } from "./cover-layout-picker";
import { DecorationColorPicker } from "./decoration-color-picker";
import { ThemeGrid } from "./theme-grid";

const pageNumberOptions = [
  { value: "show", label: "显示" },
  { value: "hide", label: "隐藏" },
];

const headingDecorationOptions: {
  value: HeadingDecorationChoice;
  label: string;
}[] = [
  { value: "none", label: "无" },
  { value: "underline", label: "直线" },
  { value: "wavy", label: "波浪" },
  { value: "highlight", label: "高亮" },
];

export const ConfiguratorContent = () => {
  const {
    currentThemeId,
    overrides,
    selectPresetTheme,
    setBodyHeadingAlignment,
    setBodyHeadingSize,
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

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="font-medium text-xs">主题</Label>
        <ThemeGrid
          currentThemeId={currentThemeId}
          onSelect={selectPresetTheme}
        />
      </div>

      <div className="space-y-2">
        <Label className="font-medium text-xs">密度</Label>
        <SegmentedControl
          className="w-full"
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
          onReset={() => resetConfigurationField("bodyHeadingAlignment")}
        >
          <SegmentedControl
            className="w-full"
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
          onReset={() => resetConfigurationField("bodyHeadingSize")}
        >
          <SegmentedControl
            className="w-full"
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
          onReset={() => resetConfigurationField("headingDecoration")}
        >
          <SegmentedControl
            className="w-full"
            onChange={(value) =>
              setHeadingDecoration(value as HeadingDecorationChoice)
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
          onReset={() => resetConfigurationField("decorationColor")}
        >
          <DecorationColorPicker
            descriptionId="decoration-color-status"
            disabled={configuration.headingDecoration === "none"}
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
          onReset={() => resetConfigurationField("coverLayout")}
        >
          <CoverLayoutPicker
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
        <Label className="font-medium text-xs">页码</Label>
        <SegmentedControl
          className="w-full"
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
