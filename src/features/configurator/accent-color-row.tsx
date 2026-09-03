"use client";

import { useCallback } from "react";
import { ColorPopover } from "@/components/ui/color-popover";
import { ColorPresetSwatch } from "@/components/ui/color-preset-swatch";
import { styleSystem } from "@/lib/style-system/style-system";
import { useContentThemeStore } from "@/store/theme";
import { accentColorPresets } from "./color-presets";
import { ConfigurationField } from "./configuration-field";

interface AccentColorRowProps {
  label: string;
  labelId: string;
}

/**
 * 一行强调色配置：8 个预设色板 + 取任意颜色的自定义触发器。
 * 自行接线状态容器，行标签承载修改标记与单项恢复。
 */
export const AccentColorRow = ({ label, labelId }: AccentColorRowProps) => {
  const {
    currentThemeId,
    overrides,
    resetConfigurationField,
    updateConfiguration,
  } = useContentThemeStore();
  const { configuration, overridden } = styleSystem.read({
    currentThemeId,
    overrides,
  });

  const selectAccentColor = useCallback(
    (accentColor: string) => updateConfiguration({ accentColor }),
    [updateConfiguration]
  );
  const resetAccentColor = useCallback(
    () => resetConfigurationField("accentColor"),
    [resetConfigurationField]
  );

  return (
    <ConfigurationField
      isModified={overridden.accentColor}
      label={label}
      labelId={labelId}
      onReset={resetAccentColor}
    >
      <fieldset
        aria-labelledby={labelId}
        className="m-0 flex min-w-0 flex-wrap items-center gap-2 border-0 p-0"
      >
        {accentColorPresets.map((preset) => (
          <ColorPresetSwatch
            color={preset}
            key={preset}
            onSelect={selectAccentColor}
            selected={preset === configuration.accentColor}
          />
        ))}
        <ColorPopover
          className="ml-0.5"
          label="自定义强调色"
          onChange={selectAccentColor}
          presets={accentColorPresets}
          value={configuration.accentColor}
        />
      </fieldset>
    </ConfigurationField>
  );
};
