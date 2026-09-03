/**
 * 圆形色块共用外观：内侧 1px 白描边 + ds-hairline 极淡外描边。
 * `ds-ring` 需要定位上下文，所以带 `relative`。
 */
export const swatchSkin =
  "ds-hairline relative rounded-full shadow-[inset_0_0_0_1px_rgba(255,255,255,0.9)] transition-transform duration-150 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2";
