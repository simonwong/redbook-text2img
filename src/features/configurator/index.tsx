'use client';

import { Palette, RotateCcw } from 'lucide-react';
import { memo } from 'react';
import { Card } from '@/components/easy/card';
import { Select } from '@/components/enhance/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  defaultAdjustments,
  densityOptions,
  fontOptions,
  headingAlignmentOptions,
  presetThemes,
} from '@/lib/theme';
import { useContentThemeStore, useSettingsPanelStore } from '@/store/theme';

/** Dimension selector component */
const DimensionSelect = ({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) => (
  <div className="space-y-2">
    <Label className="font-medium text-sm">{label}</Label>
    <Select onChange={onChange} options={options} value={value} />
  </div>
);

export const Configurator = memo(() => {
  const { isOpen } = useSettingsPanelStore();
  const {
    currentThemeId,
    adjustments,
    selectPresetTheme,
    setDensity,
    setFont,
    setHeadingAlignment,
    resetAdjustments,
  } = useContentThemeStore();

  if (!isOpen) return null;

  // Check if adjustments have been modified from defaults
  const isModified =
    adjustments.density !== defaultAdjustments.density ||
    adjustments.fontId !== defaultAdjustments.fontId ||
    adjustments.headingAlignment !== defaultAdjustments.headingAlignment;

  return (
    <aside aria-label="样式配置" className="overflow-auto w-[200px] min-w-[200px]">
      <div className="space-y-4">
        {/* Layer 1: Preset Theme Selection */}
        <Card
          contentClassName="space-y-3"
          title={
            <div className="flex items-center">
              <Palette className="mr-2 h-4 w-4" />
              <span>主题选择</span>
            </div>
          }
        >
          <Select
            className="w-full"
            onChange={selectPresetTheme}
            options={presetThemes.map((theme) => ({
              label: theme.name,
              value: theme.id,
            }))}
            placeholder="选择主题"
            value={currentThemeId}
          />
        </Card>

        {/* Style Adjustments */}
        <Card title="风格调整">
          <div className="space-y-4">
            <DimensionSelect
              label="密度"
              onChange={(v) => setDensity(v as typeof adjustments.density)}
              options={densityOptions}
              value={adjustments.density}
            />
            <DimensionSelect
              label="字体"
              onChange={setFont}
              options={fontOptions}
              value={adjustments.fontId}
            />
            <DimensionSelect
              label="标题对齐"
              onChange={(v) => setHeadingAlignment(v as typeof adjustments.headingAlignment)}
              options={headingAlignmentOptions}
              value={adjustments.headingAlignment}
            />
          </div>
        </Card>

        {/* Reset button (only show when modified) */}
        {isModified && (
          <Button
            className="w-full"
            onClick={resetAdjustments}
            size="sm"
            variant="outline"
          >
            <RotateCcw className="mr-2 h-3 w-3" />
            重置风格调整
          </Button>
        )}
      </div>
    </aside>
  );
});

Configurator.displayName = 'Configurator';
