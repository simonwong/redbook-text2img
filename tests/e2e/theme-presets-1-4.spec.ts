import { test } from "@playwright/test";
import {
  assertThemePreset,
  type ThemeProfile,
} from "./theme-preset-assertions";

const sansFontPattern = /Inter|Noto Sans SC/;
const themeProfiles: readonly ThemeProfile[] = [
  {
    bodyAlign: "center",
    coverAlign: "center",
    coverVerticalAlign: "center",
    fontFamily: sansFontPattern,
    fontSize: "16px",
    name: "清新白",
    surface: "rgba(0, 0, 0, 0)",
    tone: "light",
  },
  {
    bodyAlign: "left",
    coverAlign: "left",
    coverVerticalAlign: "flex-start",
    expectedSurface: [255, 255, 255],
    fontFamily: sansFontPattern,
    fontSize: "15px",
    name: "三角极简",
    surface: "rgb(255, 255, 255)",
    tone: "light",
  },
  {
    bodyAlign: "left",
    coverAlign: "left",
    coverVerticalAlign: "flex-end",
    fontFamily: sansFontPattern,
    fontSize: "16px",
    name: "墨夜极光",
    surface: "rgba(0, 0, 0, 0)",
    tone: "dark",
  },
  {
    bodyAlign: "center",
    coverAlign: "center",
    coverVerticalAlign: "center",
    expectedSurface: [255, 255, 255],
    fontFamily: sansFontPattern,
    fontSize: "16px",
    name: "蜜光暖阳",
    surface: "rgb(255, 255, 255)",
    tone: "light",
  },
];

for (const profile of themeProfiles) {
  test(`${profile.name} 的封面、正文、长短内容和 PNG 一致`, async ({
    page,
  }) => {
    await assertThemePreset(page, profile);
  });
}
