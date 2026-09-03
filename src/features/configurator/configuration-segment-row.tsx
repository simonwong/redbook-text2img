"use client";

import { useCallback } from "react";
import { SegmentedControl } from "@/components/ui/segmented-control";
import {
  type StyleConfiguration,
  styleSystem,
} from "@/lib/style-system/style-system";
import { useContentThemeStore } from "@/store/theme";
import { ConfigurationField } from "./configuration-field";

/** 用分段控件表达的字符串型配置字段 */
type SegmentField = "aspectRatio" | "cardFrame";

interface ConfigurationSegmentRowProps {
  field: SegmentField;
  label: string;
  labelId: string;
  options: { label: string; value: string }[];
}

/** 一行分段控件配置：自行接线状态容器，行标签承载修改标记与单项恢复 */
export const ConfigurationSegmentRow = ({
  field,
  label,
  labelId,
  options,
}: ConfigurationSegmentRowProps) => {
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

  const handleChange = useCallback(
    // 取值来自 configurationOptions 暴露的封闭集合，Style System 仍会白名单校验
    (value: string) =>
      updateConfiguration({ [field]: value } as Partial<StyleConfiguration>),
    [field, updateConfiguration]
  );
  const handleReset = useCallback(
    () => resetConfigurationField(field),
    [field, resetConfigurationField]
  );

  return (
    <ConfigurationField
      isModified={overridden[field]}
      label={label}
      labelId={labelId}
      onReset={handleReset}
    >
      <SegmentedControl
        labelledBy={labelId}
        onChange={handleChange}
        options={options}
        value={configuration[field]}
      />
    </ConfigurationField>
  );
};
