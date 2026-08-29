"use client";

import { Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  type RenderHeader,
  type RenderStyle,
  styleSystem,
  type ThemeCatalogItem,
} from "@/lib/style-system/style-system";
import { cn } from "@/lib/utils";
import { ThemeThumbnail } from "./theme-thumbnail";

interface ThemeGridProps {
  currentThemeId: string;
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

const themePreviews: readonly ThemePreview[] = styleSystem
  .catalog()
  .map((theme) => {
    const state = styleSystem.hydrate({ currentThemeId: theme.id });
    const body = styleSystem.resolve(state, { page: "body" });
    const cover = styleSystem.resolve(state, { page: "cover" });
    return {
      bodyStyles: body.styles,
      coverStyles: cover.styles,
      headerBar: cover.headerBar,
      theme,
    };
  });

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
  isModified,
  labelledBy,
  onSelect,
}: ThemeGridProps) => (
  <fieldset
    aria-labelledby={labelledBy}
    className="m-0 grid grid-cols-2 gap-2 border-0 p-0"
  >
    {themePreviews.map(({ bodyStyles, coverStyles, headerBar, theme }) => {
      const isCurrent = theme.id === currentThemeId;
      const statusId = `theme-${theme.id}-status`;
      return (
        <label
          className={cn(
            "group relative h-24 cursor-pointer overflow-hidden rounded-lg border-2 text-left transition-all has-[:focus-visible]:outline-dashed has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ring has-[:focus-visible]:outline-offset-2",
            isCurrent
              ? "border-primary shadow-sm"
              : "border-transparent hover:border-muted-foreground/30"
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
          {isCurrent && (
            <span
              className="absolute top-1.5 right-1.5 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm"
              id={statusId}
            >
              <HugeiconsIcon
                aria-hidden="true"
                className="size-3"
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
