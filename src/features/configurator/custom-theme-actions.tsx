"use client";

import { Button } from "@/components/ui/button";
import { styleSystem } from "@/lib/style-system/style-system";
import { useContentThemeStore } from "@/store/theme";
import { DeleteThemePopover } from "./delete-theme-popover";
import { SaveThemePopover } from "./save-theme-popover";

/**
 * 面板底部的自定义主题工具行：按「是否有修改」与「当前主题来源」决定入口。
 * 都不满足时整行不渲染，无修改的内置主题下面板底部保持干净。
 */
export const CustomThemeActions = () => {
  const { currentThemeId, customThemes, overrides, updateCustomTheme } =
    useContentThemeStore();
  const { isModified, theme } = styleSystem.read({
    currentThemeId,
    customThemes,
    overrides,
  });
  const isCustom = theme.source === "custom";

  if (!(isModified || isCustom)) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 pt-0.5">
      {isModified && isCustom ? (
        <Button onClick={updateCustomTheme} size="sm">
          更新此主题
        </Button>
      ) : null}
      {isModified ? (
        <SaveThemePopover variant={isCustom ? "ghost" : "raised"} />
      ) : null}
      {isCustom ? (
        <div className="ml-auto">
          <DeleteThemePopover themeId={theme.id} themeName={theme.name} />
        </div>
      ) : null}
    </div>
  );
};
