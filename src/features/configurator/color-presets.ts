import type { StyleConfiguration } from "@/lib/style-system/style-system";

type CustomGradient = Extract<
  StyleConfiguration["background"],
  { kind: "custom-gradient" }
>;

/**
 * 取色弹层的 12 个背景预设色，6×2 排布：上排浅色、下排薄荷 / 浅灰 + 4 个深色。
 * 浅色取明度 92–95% 的柔和色而不是接近纯白的 97%+，色块之间才分得开，作卡片背景依然干净。
 */
export const backgroundColorPresets: readonly string[] = [
  "#ffffff",
  "#fbf1d8",
  "#ffe3c9",
  "#ffd9df",
  "#ead9ff",
  "#d7e5ff",
  "#d3f1e2",
  "#e6e6ec",
  "#1c1c21",
  "#2b2540",
  "#3a2a2a",
  "#0f1d2e",
];

/** 强调色的 8 个预设色，覆盖红橙黄绿青蓝紫，深浅都能压出可读对比。 */
export const accentColorPresets: readonly string[] = [
  "#e8604c",
  "#d94f7a",
  "#e58a2f",
  "#c9a227",
  "#4f8f5b",
  "#2f8f9d",
  "#3f5fbf",
  "#7b56c9",
];

/** 自定义渐变的 6 个预设色标对，点选直接写入 from / to。 */
export const gradientPresets: readonly Pick<CustomGradient, "from" | "to">[] = [
  { from: "#ffe6c7", to: "#ffd1dc" },
  { from: "#e0e7ff", to: "#fce7f3" },
  { from: "#d9f7ea", to: "#e0f2fe" },
  { from: "#fff1c9", to: "#ffd6a8" },
  { from: "#1f1c2c", to: "#3b2f5c" },
  { from: "#0f172a", to: "#1e3a5f" },
];
