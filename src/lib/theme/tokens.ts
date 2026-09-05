/**
 * Design Tokens
 * Atomic values for colors, typography, and spacing
 */

// ============================================================
// Color Palettes
// ============================================================

export const colors = {
  // Neutrals
  white: "#ffffff",
  black: "#000000",
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
    950: "#030712",
  },

  // Warm
  warm: {
    bg: "#fef7f0",
    bgAlt: "#fef3ec",
    surface: "#fff7ed",
    text: "#78350f",
    textSecondary: "#92400e",
    accent: "#f59e0b",
    muted: "#fde68a",
  },

  // Cool
  cool: {
    bg: "#f0f9ff",
    bgAlt: "#e0f2fe",
    surface: "#f0f9ff",
    text: "#0c4a6e",
    textSecondary: "#075985",
    accent: "#0ea5e9",
    muted: "#bae6fd",
  },

  // Nature
  nature: {
    bg: "#f0fdf4",
    bgAlt: "#dcfce7",
    surface: "#ecfdf5",
    text: "#14532d",
    textSecondary: "#166534",
    accent: "#22c55e",
    muted: "#bbf7d0",
  },

  // Accent colors
  accent: {
    blue: "#3b82f6",
    red: "#ef4444",
    green: "#10b981",
    purple: "#8b5cf6",
    orange: "#f59e0b",
    pink: "#ec4899",
    cyan: "#06b6d4",
    gray: "#6b7280",
  },
} as const;

// ============================================================
// Gradients
// ============================================================

/**
 * 渐变里**跨区间淡出**的色标必须写成"同色 alpha 0"（如 rgba(255, 231, 194, 0)），
 * 不要用 `transparent`。`transparent` 等价于 rgba(0, 0, 0, 0)，CSS 按预乘 alpha
 * 插值所以浏览器里看不出问题，但导出走的 canvas 渐变按非预乘插值，RGB 会一路拉向
 * 黑色，导出图背景发灰发脏。
 *
 * 例外：硬色标（两侧位置相同，如 `transparent 55%, color 55%`）没有插值区间，用
 * `transparent` 是安全的。
 * 详见 docs/html2canvas-pitfalls.md 第 6 条。
 */
export const gradients = {
  // Light gradients
  /** 清新白：纸面白 + 右下冷灰光晕，底部略沉，让卡片有厚度而不是纯白 */
  cleanLight:
    "radial-gradient(ellipse 60% 50% at 92% 100%, rgba(184, 194, 212, 0.34) 0%, rgba(184, 194, 212, 0) 100%), radial-gradient(ellipse 50% 40% at 4% 0%, rgba(200, 208, 222, 0.26) 0%, rgba(200, 208, 222, 0) 100%), linear-gradient(180deg, #ffffff 0%, #f6f7fa 100%)",
  // Mesh gradients (multi-radial + linear) - 现代 Apple/Linear/Stripe 风格
  /** 蜜光暖阳：奶油底 + 右上琥珀阳光 + 左下桃色回光，颜色留在光里，底色不压深 */
  warmSun:
    "radial-gradient(ellipse 65% 55% at 100% 0%, rgba(255, 176, 82, 0.30) 0%, rgba(255, 176, 82, 0) 100%), radial-gradient(ellipse 55% 45% at 0% 100%, rgba(255, 150, 120, 0.22) 0%, rgba(255, 150, 120, 0) 100%), radial-gradient(ellipse 50% 35% at 55% 105%, rgba(255, 210, 130, 0.28) 0%, rgba(255, 210, 130, 0) 100%), linear-gradient(180deg, #fffaf1 0%, #fff3e4 100%)",
  /** 晨雾微光：近白雾底 + 上下两层雾蓝 + 右上晨光，中间一团白色微光托住居中标题 */
  coolMist:
    "radial-gradient(ellipse 72% 44% at 50% 46%, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0) 100%), radial-gradient(ellipse 55% 40% at 88% 4%, rgba(255, 238, 205, 0.34) 0%, rgba(255, 238, 205, 0) 100%), radial-gradient(ellipse 95% 45% at 50% 0%, rgba(168, 200, 236, 0.26) 0%, rgba(168, 200, 236, 0) 100%), radial-gradient(ellipse 95% 45% at 50% 100%, rgba(186, 204, 228, 0.24) 0%, rgba(186, 204, 228, 0) 100%), linear-gradient(180deg, #f8fbfe 0%, #f1f5fa 100%)",
  /** 樱花奶霜：奶霜底 + 左上樱花粉 + 右下淡粉 + 右上丁香紫，花瓣落在奶油上的层次 */
  cherryCream:
    "radial-gradient(ellipse 62% 52% at 0% 0%, rgba(255, 150, 175, 0.34) 0%, rgba(255, 150, 175, 0) 100%), radial-gradient(ellipse 62% 52% at 100% 100%, rgba(255, 168, 190, 0.30) 0%, rgba(255, 168, 190, 0) 100%), radial-gradient(ellipse 45% 40% at 100% 0%, rgba(228, 200, 255, 0.34) 0%, rgba(228, 200, 255, 0) 100%), linear-gradient(180deg, #fff8f8 0%, #fff1f3 100%)",

  // Dark gradients
  darkBlue:
    "linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #1e40af 75%, #3b82f6 100%)",
  darkPurple:
    "linear-gradient(135deg, #0f172a 0%, #1e1b4b 25%, #312e81 50%, #4c1d95 75%, #7c3aed 100%)",
  darkGreen:
    "linear-gradient(135deg, #022c22 0%, #064e3b 25%, #065f46 50%, #047857 75%, #10b981 100%)",
  /**
   * 墨夜极光：墨蓝黑底 + 右上青绿主光，上方淡蓝、右侧粉红、左下青。
   * 光晕全部避开左下角，那里落封面标题。
   */
  darkNight:
    "radial-gradient(ellipse 72% 52% at 84% 0%, rgba(74, 214, 172, 0.30) 0%, rgba(74, 214, 172, 0) 100%), radial-gradient(ellipse 58% 40% at 38% 10%, rgba(118, 150, 255, 0.16) 0%, rgba(118, 150, 255, 0) 100%), radial-gradient(ellipse 48% 40% at 100% 46%, rgba(255, 122, 172, 0.10) 0%, rgba(255, 122, 172, 0) 100%), radial-gradient(ellipse 60% 40% at 0% 100%, rgba(62, 172, 204, 0.14) 0%, rgba(62, 172, 204, 0) 100%), linear-gradient(170deg, #0f1420 0%, #151a28 55%, #10141f 100%)",

  // Vibrant gradients
  sunset:
    "linear-gradient(135deg, #fef3c7 0%, #fde68a 25%, #fcd34d 50%, #fb923c 75%, #f97316 100%)",
} as const;

// ============================================================
// Typography
// ============================================================

export const typography = {
  fontFamily: {
    sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    serif: 'Georgia, Cambria, "Times New Roman", Times, serif',
    mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
  },

  fontSize: {
    compact: 14,
    snug: 15,
    normal: 16,
    relaxed: 17.5,
    spacious: 19,
  },

  lineHeight: {
    compact: 1.5,
    snug: 1.58,
    normal: 1.65,
    relaxed: 1.72,
    spacious: 1.8,
  },

  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  // Heading scale multipliers (relative to base font size)
  headingScale: {
    h1: 1.625, // ×密度 baseFontSize（如 normal 16px → 26px）
    h2: 1.25,
    h3: 1.125,
    h4: 1,
    h5: 0.875,
    h6: 0.75,
  },
} as const;

// ============================================================
// Spacing
// ============================================================

export const spacing = {
  padding: {
    compact: 16,
    snug: 20,
    normal: 24,
    relaxed: 28,
    spacious: 32,
  },

  paragraphGap: {
    compact: 12,
    snug: 16,
    normal: 20,
    relaxed: 26,
    spacious: 32,
  },

  headingGap: {
    compact: 12,
    snug: 14,
    normal: 16,
    relaxed: 20,
    spacious: 24,
  },
} as const;
