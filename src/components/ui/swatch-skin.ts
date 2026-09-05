/**
 * 圆形色块共用外观：1px 内描边（ds-swatch），浅色块在白底、深色块在深底都有清晰边缘。
 * 之前的"内侧白描边 + 极淡外描边"在白色与浅色块上边缘发虚，故改为单层稍深的内描边。
 * `ds-ring` 需要定位上下文，所以带 `relative`。
 */
export const swatchSkin = "ds-swatch relative rounded-full";
