"use client";

import { useCallback, useEffect, useState } from "react";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { isFrostExportSupported } from "@/lib/export/frost-support";
import { styleSystem } from "@/lib/style-system/style-system";
import type { BackgroundFrost } from "@/lib/theme";
import { useContentThemeStore } from "@/store/theme";
import { ConfigurationField } from "./configuration-field";

interface FrostRowProps {
  label: string;
  labelId: string;
}

const frostLabels: Record<BackgroundFrost, string> = {
  light: "轻",
  medium: "中",
  none: "无",
  strong: "重",
};

const frostOptions = styleSystem
  .configurationOptions()
  .frost.map((value) => ({ label: frostLabels[value], value }));

const unsupportedNoticeId = "frost-unsupported-notice";

/**
 * 一行图片背景磨砂配置：只在图片背景下渲染，只改 background 的 frost 子字段，
 * 保留已上传的图片与明暗基调。浏览器导不出磨砂时整行禁用，配置值不变。
 */
export const FrostRow = ({ label, labelId }: FrostRowProps) => {
  const { currentThemeId, overrides, updateConfiguration } =
    useContentThemeStore();
  const { configuration, themeConfiguration } = styleSystem.read({
    currentThemeId,
    overrides,
  });
  // 能力判定只在客户端做：服务端渲染阶段一律当作支持，避免水合不一致
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => setIsSupported(isFrostExportSupported()), []);

  const { background } = configuration;
  const themeFrost =
    themeConfiguration.background.kind === "image"
      ? themeConfiguration.background.frost
      : "none";

  const changeFrost = useCallback(
    (frost: string) => {
      if (background.kind !== "image") {
        return;
      }
      updateConfiguration({
        background: { ...background, frost: frost as BackgroundFrost },
      });
    },
    [background, updateConfiguration]
  );
  const resetFrost = useCallback(() => {
    if (background.kind !== "image") {
      return;
    }
    updateConfiguration({ background: { ...background, frost: themeFrost } });
  }, [background, themeFrost, updateConfiguration]);

  if (background.kind !== "image") {
    return null;
  }

  return (
    <ConfigurationField
      description={isSupported ? undefined : "当前浏览器不支持磨砂导出"}
      descriptionId={isSupported ? undefined : unsupportedNoticeId}
      isModified={background.frost !== themeFrost}
      label={label}
      labelId={labelId}
      onReset={resetFrost}
    >
      <SegmentedControl
        disabled={!isSupported}
        labelledBy={labelId}
        onChange={changeFrost}
        options={frostOptions}
        value={background.frost}
      />
    </ConfigurationField>
  );
};
