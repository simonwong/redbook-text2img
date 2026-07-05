"use client";

import { createHeadingDecoration, getFontFamily } from "@/lib/theme";
import type { PresetTheme } from "@/lib/theme/types";

interface ThemeThumbnailProps {
  theme: PresetTheme;
}

/**
 * 主题缩略图的迷你卡片内容（标题 + 两条模拟正文横条）。
 * 背景由外层按钮提供；此处只渲染主题的字体、标题色/装饰与正文色示意。
 */
export const ThemeThumbnail = ({ theme }: ThemeThumbnailProps) => {
  const { heading, paragraph, surface } = theme.style;
  const barStyle = { backgroundColor: paragraph.color, opacity: 0.45 };

  return (
    <div className="flex h-full w-full flex-col justify-center px-3">
      {/* surface 主题：内容浮在小圆角白卡上，背景四周露出 */}
      <div
        className="flex flex-col gap-2"
        style={
          surface
            ? {
                borderRadius: 8,
                padding: "10px 12px",
                backgroundColor: surface.background,
                // 缩略图尺度用小号阴影，与 radius/padding 的缩小策略一致
                boxShadow: "0 2px 8px rgba(31, 41, 55, 0.14)",
              }
            : undefined
        }
      >
        <span
          className="w-fit whitespace-nowrap text-xs leading-tight"
          style={{
            color: heading.color,
            fontWeight: heading.fontWeight,
            fontFamily: getFontFamily(theme.typeset?.fontId ?? "system"),
            letterSpacing: theme.typeset?.letterSpacing?.heading,
            ...createHeadingDecoration(heading.decoration),
          }}
        >
          {theme.name}
        </span>
        <div className="flex flex-col gap-1">
          <div className="h-[3px] w-4/5 rounded-full" style={barStyle} />
          <div className="h-[3px] w-3/5 rounded-full" style={barStyle} />
        </div>
      </div>
    </div>
  );
};
