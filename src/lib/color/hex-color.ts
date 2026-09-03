/**
 * 取色弹层的十六进制输入规则。
 *
 * 界面只接受 6 位十六进制颜色（与 Style System 持久化白名单一致），
 * 输入框允许用户省略 `#` 并使用大写，提交时统一规范化为小写 `#rrggbb`。
 */

const hexColorInputPattern = /^#?[0-9a-f]{6}$/i;
const leadingHashPattern = /^#/;

/** 输入框里显示的裸值：去掉 `#`，只留 6 位。 */
export const hexColorInputValue = (color: string): string =>
  color.replace(leadingHashPattern, "");

/**
 * 把用户输入规范化成合法的 6 位十六进制颜色；非法输入返回 undefined。
 */
export const normalizeHexColor = (input: string): string | undefined => {
  const candidate = input.trim();
  if (!hexColorInputPattern.test(candidate)) {
    return;
  }
  return `#${hexColorInputValue(candidate)}`.toLowerCase();
};

/** 输入是否可以提交（非法值不写入配置）。 */
export const isHexColorInput = (input: string): boolean =>
  normalizeHexColor(input) !== undefined;

/**
 * 提交十六进制输入：合法值规范化后写入，非法值回退到上一个合法值。
 */
export const commitHexColor = (input: string, fallback: string): string =>
  normalizeHexColor(input) ?? fallback;
