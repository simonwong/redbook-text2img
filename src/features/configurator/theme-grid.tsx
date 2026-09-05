"use client";

import { Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMemo } from "react";
import {
  type CustomTheme,
  type RenderHeader,
  type RenderStyle,
  styleSystem,
  type ThemeCatalogItem,
} from "@/lib/style-system/style-system";
import { cn } from "@/lib/utils";
import { ThemeThumbnail } from "./theme-thumbnail";

interface ThemeGridProps {
  currentThemeId: string;
  customThemes: readonly CustomTheme[];
  isModified: boolean;
  labelledBy: string;
  onSelect: (themeId: string) => void;
}

interface ThemePreview {
  bodyStyles: RenderStyle;
  coverStyles: RenderStyle;
  headerBar?: RenderHeader;
  theme: ThemeCatalogItem;
}

/**
 * 缩略图与真实卡片走同一条解析链路：按主题标识 resolve 出封面与正文样式。
 * 自定义主题只多传一份 customThemes，其余完全相同。
 */
const buildPreviews = (
  customThemes: readonly CustomTheme[],
  themes: readonly ThemeCatalogItem[]
): readonly ThemePreview[] =>
  themes.map((theme) => {
    const state = {
      currentThemeId: theme.id,
      customThemes,
      overrides: {},
    };
    const body = styleSystem.resolve(state, { page: "body" });
    const cover = styleSystem.resolve(state, { page: "cover" });
    return {
      bodyStyles: body.styles,
      coverStyles: cover.styles,
      headerBar: cover.headerBar,
      theme,
    };
  });

// 内置主题不随状态变化，模块级算一次
const builtInPreviews = buildPreviews([], styleSystem.catalog());

function getThemeBackground(styles: RenderStyle): React.CSSProperties {
  return {
    backgroundColor: styles.container.backgroundColor,
    backgroundImage: styles.container.backgroundImage,
    backgroundPosition: styles.container.backgroundPosition,
    backgroundSize: styles.container.backgroundSize,
  };
}

export const ThemeGrid = ({
  currentThemeId,
  customThemes,
  isModified,
  labelledBy,
  onSelect,
}: ThemeGridProps) => {
  const previews = useMemo(
    () =>
      customThemes.length === 0
        ? builtInPreviews
        : [
            ...builtInPreviews,
            ...buildPreviews(
              customThemes,
              customThemes.map(({ id, name }) => ({
                id,
                name,
                source: "custom" as const,
              }))
            ),
          ],
    [customThemes]
  );

  return (
    <fieldset
      aria-labelledby={labelledBy}
      className="m-0 grid grid-cols-2 gap-[7px] border-0 p-0"
    >
      {previews.map(({ bodyStyles, coverStyles, headerBar, theme }) => {
        const isCurrent = theme.id === currentThemeId;
        const statusId = `theme-${theme.id}-status`;
        return (
          <label
            className={cn(
              "ds-tile relative h-[72px] cursor-pointer rounded-[12px] text-left transition-shadow duration-150 ease-out has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ink has-[:focus-visible]:outline-offset-2",
              isCurrent && "ds-ring ds-ring-out ds-tile-on"
            )}
            key={theme.id}
            style={getThemeBackground(coverStyles)}
          >
            <input
              aria-describedby={isCurrent ? statusId : undefined}
              aria-label={theme.name}
              checked={isCurrent}
              className="sr-only"
              name="theme"
              onChange={() => onSelect(theme.id)}
              type="radio"
              value={theme.id}
            />
            <ThemeThumbnail
              bodyStyles={bodyStyles}
              coverStyles={coverStyles}
              headerBar={headerBar}
              theme={theme}
            />
            {theme.source === "custom" && (
              <span className="absolute bottom-[5px] left-[5px] z-10 rounded-full bg-white/75 px-1.5 py-px text-[9px] text-black leading-[1.4]">
                自定义
              </span>
            )}
            {isCurrent && (
              <span
                className="ds-check absolute top-[5px] right-[5px] z-10 flex size-4 items-center justify-center rounded-full"
                id={statusId}
              >
                <HugeiconsIcon
                  aria-hidden="true"
                  className="size-2.5"
                  icon={Tick02Icon}
                />
                <span className="sr-only">
                  {isModified ? "已调整" : "当前主题"}
                </span>
              </span>
            )}
          </label>
        );
      })}
    </fieldset>
  );
};
