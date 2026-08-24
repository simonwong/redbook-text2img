"use client";

import type {
  RenderStyle,
  ThemeCatalogItem,
} from "@/lib/style-system/style-system";

interface ThemeThumbnailProps {
  styles: RenderStyle;
  theme: ThemeCatalogItem;
}

/**
 * 主题缩略图的迷你卡片内容（标题 + 两条模拟正文横条）。
 * 背景由外层按钮提供；此处只渲染主题的字体、标题色/装饰与正文色示意。
 */
export const ThemeThumbnail = ({ styles, theme }: ThemeThumbnailProps) => {
  const hasSurface = Boolean(styles.innerContainer.backgroundColor);
  const barStyle = { backgroundColor: styles.p.color, opacity: 0.45 };

  return (
    <div className="flex h-full w-full flex-col justify-center px-3">
      {/* surface 主题：内容浮在小圆角白卡上，背景四周露出 */}
      <div
        className="flex flex-col gap-2"
        style={
          hasSurface
            ? {
                backgroundColor: styles.innerContainer.backgroundColor,
                borderRadius: 8,
                boxShadow: "0 2px 8px rgba(31, 41, 55, 0.14)",
                padding: "10px 12px",
              }
            : undefined
        }
      >
        <span
          className="w-fit whitespace-nowrap text-xs leading-tight"
          style={{
            color: styles.h1.color,
            fontFamily: styles.container.fontFamily,
            fontWeight: styles.h1.fontWeight,
            letterSpacing: styles.h1.letterSpacing,
            ...styles.headingInner,
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
