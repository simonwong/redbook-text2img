import { expect, it } from "vitest";
import { createRateLimiter } from "./rate-limit";

it("窗口内超过上限后拒绝，窗口过期后恢复", () => {
  let time = 0;
  const allow = createRateLimiter(2, 1000, () => time);
  expect(allow("a")).toBe(true);
  expect(allow("a")).toBe(true);
  expect(allow("a")).toBe(false);
  time = 1000;
  expect(allow("a")).toBe(true);
});

it("不同来源分别计数", () => {
  const allow = createRateLimiter(1, 1000, () => 0);
  expect(allow("a")).toBe(true);
  expect(allow("b")).toBe(true);
  expect(allow("a")).toBe(false);
});
