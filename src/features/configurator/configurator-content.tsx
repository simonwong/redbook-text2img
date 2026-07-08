"use client";

import { ArrowReloadHorizontalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Select } from "@/components/enhance/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SegmentedControl } from "@/components/ui/segmented-control";
import {
  defaultAdjustments,
  densityOptions,
  fontOptions,
  type HeadingDecorationChoice,
  headingAlignmentOptions,
} from "@/lib/theme";
import { useContentThemeStore, useWatermarkStore } from "@/store/theme";
import { AccentColorPicker } from "./accent-color-picker";
import { ThemeGrid } from "./theme-grid";

const pageNumberOptions = [
  { value: "show", label: "显示" },
  { value: "hide", label: "隐藏" },
];

const headingDecorationOptions: {
  value: "theme" | HeadingDecorationChoice;
  label: string;
}[] = [
  { value: "theme", label: "默认" },
  { value: "none", label: "无" },
  { value: "underline", label: "直线" },
  { value: "wavy", label: "波浪" },
  { value: "highlight", label: "高亮" },
];

export const ConfiguratorContent = () => {
  const {
    currentThemeId,
    adjustments,
    selectPresetTheme,
    setDensity,
    setFont,
    setHeadingAlignment,
    setAccentColor,
    setHeadingDecoration,
    resetAdjustments,
  } = useContentThemeStore();
  const { signature, showPageNumber, setSignature, setShowPageNumber } =
    useWatermarkStore();

  const isModified =
    adjustments.density !== defaultAdjustments.density ||
    adjustments.fontId !== defaultAdjustments.fontId ||
    adjustments.headingAlignment !== defaultAdjustments.headingAlignment ||
    adjustments.accentColor !== defaultAdjustments.accentColor ||
    adjustments.headingDecoration !== defaultAdjustments.headingDecoration;

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
          onChange={(v) => setDensity(v as typeof adjustments.density)}
          options={densityOptions}
          value={adjustments.density}
        />
      </div>

      <div className="space-y-2">
        <Label className="font-medium text-xs">字体</Label>
        <Select
          className="w-full"
          onChange={setFont}
          options={fontOptions}
          value={adjustments.fontId}
        />
      </div>

      <div className="space-y-2">
        <Label className="font-medium text-xs">标题对齐</Label>
        <SegmentedControl
          className="w-full"
          onChange={(v) =>
            setHeadingAlignment(v as typeof adjustments.headingAlignment)
          }
          options={headingAlignmentOptions}
          value={adjustments.headingAlignment}
        />
      </div>

      <div className="space-y-2">
        <Label className="font-medium text-xs">标题装饰</Label>
        <SegmentedControl
          className="w-full"
          onChange={(v) =>
            setHeadingDecoration(
              v === "theme" ? undefined : (v as HeadingDecorationChoice)
            )
          }
          options={headingDecorationOptions}
          value={adjustments.headingDecoration ?? "theme"}
        />
      </div>

      <div className="space-y-2">
        <Label className="font-medium text-xs">强调色</Label>
        <AccentColorPicker
          onChange={setAccentColor}
          value={adjustments.accentColor}
        />
      </div>

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
          onClick={resetAdjustments}
          type="button"
        >
          <HugeiconsIcon className="h-3 w-3" icon={ArrowReloadHorizontalIcon} />
          重置风格
        </button>
      )}
    </div>
  );
};
