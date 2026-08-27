import { test } from "@playwright/test";
import {
  assertThemePreset,
  type ThemeProfile,
} from "./theme-preset-assertions";

const sansFontPattern = /Inter|Noto Sans SC/;
const serifFontPattern = /Georgia|Noto Serif SC/;
const themeProfiles: readonly ThemeProfile[] = [
  {
    bodyAlign: "center",
    coverAlign: "center",
    coverVerticalAlign: "center",
    decoration: "none",
    fontFamily: serifFontPattern,
    fontSize: "16px",
    name: "晨雾微光",
    surface: "rgba(0, 0, 0, 0)",
    tone: "light",
  },
  {
    bodyAlign: "center",
    coverAlign: "center",
    coverVerticalAlign: "center",
    decoration: "wavy",
    fontFamily: sansFontPattern,
    fontSize: "16px",
    name: "樱花奶霜",
    surface: "rgba(0, 0, 0, 0)",
    tone: "light",
  },
  {
    bodyAlign: "left",
    coverAlign: "left",
    coverVerticalAlign: "flex-start",
    decoration: "none",
    fontFamily: serifFontPattern,
    fontSize: "16px",
    name: "阅读模式",
    surface: "rgba(0, 0, 0, 0)",
    tone: "light",
  },
  {
    bodyAlign: "left",
    coverAlign: "center",
    coverVerticalAlign: "center",
    decoration: "none",
    fontFamily: sansFontPattern,
    fontSize: "15px",
    hasHeader: true,
    name: "Apple 备忘录",
    surface: "rgba(0, 0, 0, 0)",
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
