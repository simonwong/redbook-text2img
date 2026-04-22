"use client";

import { ArrowReloadHorizontalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Select } from "@/components/enhance/select";
import { Label } from "@/components/ui/label";
import { SegmentedControl } from "@/components/ui/segmented-control";
import {
  defaultAdjustments,
  densityOptions,
  fontOptions,
  headingAlignmentOptions,
} from "@/lib/theme";
import { useContentThemeStore } from "@/store/theme";
import { ThemeGrid } from "./theme-grid";

export const ConfiguratorContent = () => {
  const {
    currentThemeId,
    adjustments,
    selectPresetTheme,
    setDensity,
    setFont,
    setHeadingAlignment,
    resetAdjustments,
  } = useContentThemeStore();

  const isModified =
    adjustments.density !== defaultAdjustments.density ||
    adjustments.fontId !== defaultAdjustments.fontId ||
    adjustments.headingAlignment !== defaultAdjustments.headingAlignment;

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
