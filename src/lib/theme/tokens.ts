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

export const gradients = {
  // Light gradients
  cleanLight:
    "radial-gradient(ellipse at 75% 85%, rgba(180, 190, 200, 0.12) 0%, transparent 50%), radial-gradient(ellipse at 15% 15%, rgba(160, 175, 190, 0.08) 0%, transparent 45%), linear-gradient(160deg, #ffffff 0%, #fdfdfe 50%, #ffffff 100%)",
  warmLight:
    "linear-gradient(135deg, #fef7f0 0%, #fef3ec 25%, #fdf2f8 50%, #f3e8ff 75%, #f0f9ff 100%)",
  coolLight:
    "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 25%, #f0fdfa 50%, #ecfeff 75%, #f0fdf4 100%)",
  pinkLight:
    "linear-gradient(135deg, #fdf2f8 0%, #fce7f3 25%, #fef3ec 50%, #fff7ed 75%, #fffbeb 100%)",

  // Mesh gradients (multi-radial + linear) - 现代 Apple/Linear/Stripe 风格
  /** 蜜光暖阳：奶油 + 蜜桃 + 杏色，四点光晕模拟蜜光 */
  warmSun:
    "radial-gradient(ellipse at 88% 12%, #ffe7c2 0%, transparent 55%), radial-gradient(ellipse at 12% 88%, #ffd2b0 0%, transparent 52%), radial-gradient(ellipse at 95% 95%, #f7b07a 0%, transparent 48%), linear-gradient(150deg, #fffaf2 0%, #fff1de 35%, #ffe1c4 70%, #fbcfa8 100%)",
  /** 晨雾微光：奶蓝 + 雾蓝 + 淡薰衣草，云雾感 */
  coolMist:
    "radial-gradient(ellipse at 12% 8%, #eaf2ff 0%, transparent 55%), radial-gradient(ellipse at 92% 92%, #d6e3f3 0%, transparent 52%), radial-gradient(ellipse at 96% 6%, #e1ddff 0%, transparent 48%), linear-gradient(155deg, #f5f9fd 0%, #ebf2fb 35%, #d8e4f3 70%, #b6cee6 100%)",
  /** 樱花奶霜：奶油 + 樱花粉 + 蜜桃粉，奶霜质感 */
  cherryCream:
    "radial-gradient(ellipse at 5% 5%, #fff0f3 0%, transparent 55%), radial-gradient(ellipse at 95% 100%, #ffd6c2 0%, transparent 52%), radial-gradient(ellipse at 100% 5%, #ffdfeb 0%, transparent 48%), linear-gradient(150deg, #fff6f6 0%, #ffe7eb 35%, #fbcfd9 70%, #f6acbe 100%)",

  // Dark gradients
  darkBlue:
    "linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #1e40af 75%, #3b82f6 100%)",
  darkPurple:
    "linear-gradient(135deg, #0f172a 0%, #1e1b4b 25%, #312e81 50%, #4c1d95 75%, #7c3aed 100%)",
  darkGreen:
    "linear-gradient(135deg, #022c22 0%, #064e3b 25%, #065f46 50%, #047857 75%, #10b981 100%)",
  /** 墨夜极光：深邃墨色 + 微妙极光（紫蓝晕染） */
  darkNight:
    "radial-gradient(ellipse at 80% 12%, rgba(124, 102, 196, 0.22) 0%, transparent 55%), radial-gradient(ellipse at 18% 88%, rgba(82, 132, 196, 0.16) 0%, transparent 52%), radial-gradient(ellipse at 95% 92%, rgba(168, 116, 220, 0.1) 0%, transparent 45%), linear-gradient(165deg, #0a0c14 0%, #14161f 50%, #0d0f18 100%)",

  // Vibrant gradients
  sunset:
    "linear-gradient(135deg, #fef3c7 0%, #fde68a 25%, #fcd34d 50%, #fb923c 75%, #f97316 100%)",
  ocean:
    "linear-gradient(135deg, #cffafe 0%, #a5f3fc 25%, #67e8f9 50%, #22d3ee 75%, #06b6d4 100%)",
  forest:
    "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 25%, #86efac 50%, #4ade80 75%, #22c55e 100%)",
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
    normal: 16,
    spacious: 19,
  },

  lineHeight: {
    compact: 1.5,
    normal: 1.65,
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
    h1: 1.625, // 适配新密度系统 (compact:20px, normal:26px, spacious:32px)
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
    normal: 24,
    spacious: 32,
  },

  paragraphGap: {
    compact: 12,
    normal: 20,
    spacious: 32,
  },

  headingGap: {
    compact: 12,
    normal: 16,
    spacious: 24,
  },
} as const;
