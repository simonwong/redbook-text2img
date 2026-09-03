import { describe, expect, it } from "vitest";
import {
  commitHexColor,
  hexColorInputValue,
  isHexColorInput,
  normalizeHexColor,
} from "./hex-color";

describe("十六进制颜色输入", () => {
  it("接受带 # 与不带 # 的 6 位值，统一规范化为小写", () => {
    expect(normalizeHexColor("#FFE8EC")).toBe("#ffe8ec");
    expect(normalizeHexColor("ffe8ec")).toBe("#ffe8ec");
    expect(normalizeHexColor("  #1C1C21  ")).toBe("#1c1c21");
  });

  it("丢弃位数不对、含非法字符或为空的输入", () => {
    for (const input of [
      "",
      "   ",
      "#fff",
      "fff",
      "#ffe8e",
      "#ffe8ecc",
      "#ffe8eg",
      "rgb(255,0,0)",
      "##ffe8ec",
      "#ffe8ec;",
    ]) {
      expect(normalizeHexColor(input)).toBeUndefined();
    }
  });

  it("isHexColorInput 与 normalizeHexColor 判定一致", () => {
    expect(isHexColorInput("F3E8FF")).toBe(true);
    expect(isHexColorInput("#f3e8ff")).toBe(true);
    expect(isHexColorInput("#f3e8f")).toBe(false);
  });

  it("提交合法值时写入规范化结果", () => {
    expect(commitHexColor("E6F7F0", "#ffffff")).toBe("#e6f7f0");
  });

  it("提交非法值时回退到上一个合法值，不写入配置", () => {
    expect(commitHexColor("", "#ffffff")).toBe("#ffffff");
    expect(commitHexColor("#zzzzzz", "#1c1c21")).toBe("#1c1c21");
    expect(commitHexColor("12345", "#1c1c21")).toBe("#1c1c21");
  });

  it("输入框显示裸值，回填不会叠加 #", () => {
    expect(hexColorInputValue("#ffe8ec")).toBe("ffe8ec");
    expect(hexColorInputValue("ffe8ec")).toBe("ffe8ec");
  });
});
