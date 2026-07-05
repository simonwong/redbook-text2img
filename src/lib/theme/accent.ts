/**
 * Accent Override
 * 自定义强调色覆盖层：把主题手调的语义色（荧光笔/列表 marker/引用边框/链接/标题装饰）
 * 统一替换为用户选的强调色。纯函数，不改动主题默认值。
 */

import { colors } from "./tokens";
import type { FullStyle, HeadingStyle } from "./types";

type Rgb = [number, number, number];

const WHITE: Rgb = [255, 255, 255];
const BLACK: Rgb = [0, 0, 0];

/** #rrggbb → [r,g,b]（输入均为 6 位 hex：预设色块 + 原生 color input） */
function hexToRgb(hex: string): Rgb {
  const h = hex.replace("#", "");
  return [
    Number.parseInt(h.slice(0, 2), 16),
    Number.parseInt(h.slice(2, 4), 16),
    Number.parseInt(h.slice(4, 6), 16),
  ];
}

function rgbToHex(r: number, g: number, b: number): string {
  const to = (v: number) => Math.round(v).toString(16).padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}

/** 线性插值混合：t=b 的占比（0→a，1→b） */
function mix(a: Rgb, b: Rgb, t: number): Rgb {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ];
}

/** 相对亮度（0–1，sRGB 加权，未做 gamma 线性化即可满足深/浅文字判定） */
function luminance([r, g, b]: Rgb): number {
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

/**
 * 用 accent 覆盖 FullStyle 的强调语义色，返回新对象（不改动入参）。
 * 派生规则：
 * - highlight 背景 = accent；文字按亮度 >0.6 用深色 #1f2937，否则用白
 * - list.markerColor / blockquote.borderColor = accent
 * - link.color = accent 向黑混合 15%（加深，保持可读）
 * - heading.decoration: underline = accent；highlight 衬底 = accent 向白混合 60%
 */
export function applyAccentOverride(
  style: FullStyle,
  accent: string
): FullStyle {
  const rgb = hexToRgb(accent);
  const highlightText = luminance(rgb) > 0.6 ? colors.gray[800] : colors.white;
  const linkColor = rgbToHex(...mix(rgb, BLACK, 0.15));
  const backing = rgbToHex(...mix(rgb, WHITE, 0.6));

  const decoration = style.heading.decoration;
  const heading: HeadingStyle = decoration
    ? {
        ...style.heading,
        decoration:
          decoration.kind === "highlight"
            ? { ...decoration, color: backing }
            : { ...decoration, color: accent },
      }
    : style.heading;

  return {
    ...style,
    heading,
    emphasis: {
      ...style.emphasis,
      highlight: { background: accent, color: highlightText },
    },
    list: { ...style.list, markerColor: accent },
    blockquote: { ...style.blockquote, borderColor: accent },
    link: { ...style.link, color: linkColor },
  };
}
