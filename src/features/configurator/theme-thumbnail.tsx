"use client";

import type {
  RenderHeader,
  RenderStyle,
  ThemeCatalogItem,
} from "@/lib/style-system/style-system";
import { ChevronLeftIcon, MenuCircleIcon, ShareIcon } from "../preview/icons";

interface ThemeThumbnailProps {
  bodyStyles: RenderStyle;
  coverStyles: RenderStyle;
  headerBar?: RenderHeader;
  theme: ThemeCatalogItem;
}

export const ThemeThumbnail = ({
  bodyStyles,
  coverStyles,
  headerBar,
  theme,
}: ThemeThumbnailProps) => {
  const barStyle = {
    backgroundColor: bodyStyles.p.color,
    height: 2.5,
    opacity: 0.45,
  };

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 flex h-full w-full flex-col overflow-hidden rounded-[10px]"
      data-cover-align={coverStyles.content.alignItems}
      data-cover-vertical={coverStyles.content.justifyContent}
      data-density={bodyStyles.container.fontSize}
      data-theme-thumbnail={theme.id}
    >
      {headerBar && (
        <div
          className="flex h-4 shrink-0 items-center justify-between px-1.5"
          data-theme-header="true"
          style={{ background: headerBar.background }}
        >
          <span>
            {headerBar.icons.backArrow && (
              <ChevronLeftIcon color={headerBar.iconColor} size={8} />
            )}
          </span>
          <span className="flex gap-1">
            {headerBar.icons.share && (
              <ShareIcon color={headerBar.iconColor} size={7} />
            )}
            {headerBar.icons.menu && (
              <MenuCircleIcon color={headerBar.iconColor} size={7} />
            )}
          </span>
        </div>
      )}
      <div
        className="flex min-h-0 flex-1 flex-col p-2"
        style={{
          alignItems: coverStyles.content.alignItems,
          justifyContent: coverStyles.content.justifyContent,
        }}
      >
        <span
          className="max-w-full truncate text-[11px] leading-tight"
          data-theme-title="true"
          style={{
            color: coverStyles.h1.color,
            fontFamily: coverStyles.container.fontFamily,
            fontWeight: coverStyles.h1.fontWeight,
            letterSpacing: coverStyles.h1.letterSpacing,
            textAlign: coverStyles.h1.textAlign,
          }}
        >
          {theme.name}
        </span>
        <div className="mt-2 flex w-3/5 flex-col gap-[3px]">
          <div className="w-full rounded-full" style={barStyle} />
          <div className="w-3/4 rounded-full" style={barStyle} />
        </div>
      </div>
    </div>
  );
};
