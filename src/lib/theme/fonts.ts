/**
 * Font Configuration
 * 内置字体预设 - 每个预设都是完整的 font-family 组合
 */

export interface FontPreset {
  description?: string;
  id: string;
  name: string;
  value: string; // 完整的 CSS font-family 值
}

// ============================================================
// 字体预设
// ============================================================

export const fontPresets: FontPreset[] = [
  {
    id: "sans",
    name: "无衬线",
    value:
      '"Inter", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif',
    description: "现代简洁风格",
  },
  {
    id: "serif",
    name: "衬线",
    value: 'Georgia, "Noto Serif SC", "Source Han Serif SC", "SimSun", serif',
    description: "传统阅读风格",
  },
];

// ============================================================
// 工具函数
// ============================================================

/** 根据 ID 获取字体预设 */
export const getFontPreset = (id: string): FontPreset =>
  fontPresets.find((f) => f.id === id) ?? fontPresets[0];

/** 获取 font-family 值 */
export const getFontFamily = (id: string): string => getFontPreset(id).value;

export const defaultFontId = "sans";
