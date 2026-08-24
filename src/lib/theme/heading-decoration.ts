import type { HeadingDecoration } from "./types";

type Rgb = [number, number, number];

const BLACK: Rgb = [0, 0, 0];
const WHITE: Rgb = [255, 255, 255];

const hexToRgb = (hex: string): Rgb => {
  const value = hex.replace("#", "");
  return [
    Number.parseInt(value.slice(0, 2), 16),
    Number.parseInt(value.slice(2, 4), 16),
    Number.parseInt(value.slice(4, 6), 16),
  ];
};

const mix = (from: Rgb, to: Rgb, amount: number): Rgb => [
  from[0] + (to[0] - from[0]) * amount,
  from[1] + (to[1] - from[1]) * amount,
  from[2] + (to[2] - from[2]) * amount,
];

const rgbToHex = (rgb: Rgb): string => {
  const channel = (value: number) =>
    Math.round(value).toString(16).padStart(2, "0");
  return `#${channel(rgb[0])}${channel(rgb[1])}${channel(rgb[2])}`;
};

const relativeLuminance = (rgb: Rgb): number => {
  const [red, green, blue] = rgb.map((channel) => {
    const value = channel / 255;
    return value <= 0.040_45 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
};

const contrastRatio = (first: Rgb, second: Rgb): number => {
  const lighter = Math.max(relativeLuminance(first), relativeLuminance(second));
  const darker = Math.min(relativeLuminance(first), relativeLuminance(second));
  return (lighter + 0.05) / (darker + 0.05);
};

const deriveHighlightColor = (baseColor: string, textColor: string): string => {
  const base = hexToRgb(baseColor);
  const text = hexToRgb(textColor);
  const target =
    contrastRatio(text, WHITE) >= contrastRatio(text, BLACK) ? WHITE : BLACK;

  for (let amount = 0.5; amount <= 1; amount += 0.1) {
    const candidate = mix(base, target, amount);
    if (contrastRatio(text, candidate) >= 4.5) {
      return rgbToHex(candidate);
    }
  }

  return rgbToHex(target);
};

export const deriveDecoration = (
  kind: HeadingDecoration["kind"],
  baseColor: string,
  textColor: string
): HeadingDecoration => {
  if (kind === "highlight") {
    return {
      color: deriveHighlightColor(baseColor, textColor),
      kind: "highlight",
    };
  }
  if (kind === "wavy") {
    return { color: baseColor, kind: "wavy" };
  }
  return { color: baseColor, kind: "underline" };
};
