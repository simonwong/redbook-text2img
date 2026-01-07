'use client';

import { Palette, RotateCcw } from 'lucide-react';
import { memo } from 'react';
import { Card } from '@/components/easy/card';
import { Select } from '@/components/enhance/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  densityOptions,
  moodOptions,
  presetThemes,
  toneOptions,
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
    currentConfig,
    selectPresetTheme,
    setTone,
    setMood,
    setDensity,
    resetToPreset,
  } = useContentThemeStore();

  if (!isOpen) return null;

  // Check if config has been modified from the preset
  const currentPreset = presetThemes.find((t) => t.id === currentThemeId);
  const isModified =
    currentPreset &&
    (currentPreset.config.tone !== currentConfig.tone ||
      currentPreset.config.mood !== currentConfig.mood ||
      currentPreset.config.density !== currentConfig.density);

  return (
    <aside aria-label="样式配置" className="overflow-auto">
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

        {/* Layer 2: Dimension Adjustments */}
        <Card title="风格调整">
          <div className="space-y-4">
            <DimensionSelect
              label="色调"
              onChange={(v) => setTone(v as typeof currentConfig.tone)}
              options={toneOptions}
              value={currentConfig.tone}
            />
            <DimensionSelect
              label="氛围"
              onChange={(v) => setMood(v as typeof currentConfig.mood)}
              options={moodOptions}
              value={currentConfig.mood}
            />
            <DimensionSelect
              label="密度"
              onChange={(v) => setDensity(v as typeof currentConfig.density)}
              options={densityOptions}
              value={currentConfig.density}
            />
          </div>
        </Card>

        {/* Reset button (only show when modified) */}
        {isModified && (
          <Button
            className="w-full"
            onClick={resetToPreset}
            size="sm"
            variant="outline"
          >
            <RotateCcw className="mr-2 h-3 w-3" />
            重置为预设
          </Button>
        )}
      </div>
    </aside>
  );
});

Configurator.displayName = 'Configurator';
