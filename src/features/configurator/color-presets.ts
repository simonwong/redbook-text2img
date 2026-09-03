import type { StyleConfiguration } from "@/lib/style-system/style-system";

type CustomGradient = Extract<
  StyleConfiguration["background"],
  { kind: "custom-gradient" }
>;

/** 取色弹层的 12 个背景预设色，6×2 排布，偏小红书审美的柔和色。 */
export const backgroundColorPresets: readonly string[] = [
  "#ffffff",
  "#fefcf3",
  "#fff5e6",
  "#ffe8ec",
  "#f3e8ff",
  "#e8f1ff",
  "#e6f7f0",
  "#f4f4f7",
  "#1c1c21",
  "#2b2540",
  "#3a2a2a",
  "#0f1d2e",
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
