/**
 * Frost Export Support
 * 磨砂能否导出取决于浏览器 Canvas 2D 是否支持 `filter`：
 * html2canvas-pro 把 CSS `filter` 写进 ctx.filter，不支持时导出图不会有模糊。
 */

/**
 * 当前浏览器能否导出磨砂效果。
 * 服务端渲染阶段返回 true，避免与客户端首帧不一致；真正的判定放在客户端。
 */
export const isFrostExportSupported = (): boolean => {
  if (typeof CanvasRenderingContext2D === "undefined") {
    return true;
  }
  return "filter" in CanvasRenderingContext2D.prototype;
};
