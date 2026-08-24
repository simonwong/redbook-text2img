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

/** "跟随主题"字体 id：解析时替换为主题 typeset.fontId（无则 system） */
export const AUTO_FONT_ID = "auto";

export const fontPresets: FontPreset[] = [
  {
    id: "system",
    name: "系统默认",
    value:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Microsoft YaHei", sans-serif',
    description: "跟随系统字体",
  },
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
  {
    id: "kai",
    name: "楷体",
    value: '"Kaiti SC", "STKaiti", KaiTi, "Noto Serif SC", serif',
    description: "书法楷体，书卷气",
  },
  {
    id: "rounded",
    name: "圆体",
    value: '"SF Pro Rounded", "PingFang SC", "Microsoft YaHei", sans-serif',
    description: "柔和圆润风格",
  },
  {
    id: "mono",
    name: "等宽",
    value:
      '"JetBrains Mono", "Fira Code", "SF Mono", Menlo, "PingFang SC", monospace',
    description: "代码/技术风格",
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

/**
 * 解析生效字体 id
 * - 用户显式选了具体字体（非 auto）→ 用用户的（覆盖主题）
 * - 用户为 auto（跟随主题）→ 用主题 typeset.fontId，无则 system
 */
export const resolveFontId = (
  userFontId: string,
  themeFontId?: string
): string =>
  userFontId === AUTO_FONT_ID ? (themeFontId ?? "system") : userFontId;

/** 默认字体 ID（跟随主题） */
export const defaultFontId = AUTO_FONT_ID;
