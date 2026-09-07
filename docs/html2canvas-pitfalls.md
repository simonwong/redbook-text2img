# html2canvas-pro 导出约束

修改 Markdown 样式、画布背景、预览切页或 PNG 下载时，读取对应条目。浏览器 DOM 正确不代表 Canvas 导出正确。

## 1. inline 背景会扩展到整行

`html2canvas-pro` 可能把 `display: inline` 元素的 `background-color` 绘制成整行宽。项目中的 inline code 因此必须同时使用：

```ts
{
  display: "inline-block",
  lineHeight: "inherit",
}
```

该约束集中在 `src/lib/theme/generator.ts` 的 Implementation 中；调用方只读取 `GeneratedStyles.code`。

## 2. `overflow: hidden` 会严格裁切

Canvas 按容器边界裁切，不保留浏览器中“看起来没溢出”的内容。只在负责圆角或明确裁切的外层容器使用 `overflow: hidden`；内容层保持可测量。

## 3. 生产导出关闭 logging

`logging: true` 会在每张图的 DOM 遍历中输出大量日志，批量导出会明显卡顿。`src/features/preview/hooks/use-image-export.ts` 必须保持 `logging: false`。

## 4. 延迟释放 Object URL

`link.click()` 只启动下载；立即调用 `URL.revokeObjectURL()` 可能让大文件在浏览器读取前失效。PNG 与 ZIP 下载统一延迟 60 s 释放：

```ts
triggerDownload(url, filename);
setTimeout(() => URL.revokeObjectURL(url), 60_000);
```

## 5. 批量导出需等待切页渲染

`src/features/preview/preview-panel.tsx` 在更新 segment index 后等待两个 `requestAnimationFrame`，再读取导出节点：

```ts
await new Promise<void>((resolve) => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => resolve());
  });
});
```

这是批量导出 Module 的内部时序约束，不是 React commit 的强保证。若再出现页面错位，在该 Module 内集中替换等待机制，不把延时分散到调用方。

## 6. 渐变跨区间淡出不能使用 `transparent`

`transparent` 等于 `rgba(0, 0, 0, 0)`。CSS 渐变与 Canvas2D 渐变的 alpha 插值路径不同；Canvas 导出会把过渡 RGB 拉向黑色，造成灰褐色污染。

跨区间淡出必须使用相邻颜色的 alpha 0 版本：

```ts
// 错：导出后发灰
"radial-gradient(ellipse at 88% 12%, #ffe7c2 0%, transparent 55%)"

// 对：浏览器与 Canvas 保持一致
"radial-gradient(ellipse at 88% 12%, #ffe7c2 0%, rgba(255, 231, 194, 0) 55%)"
```

位置完全相同的硬色标没有插值区间，可使用 `transparent`：

```ts
`linear-gradient(180deg, transparent 55%, ${color} 55%, ${color} 92%, transparent 92%)`
```

相关 Implementation 位于 `src/lib/theme/tokens.ts` 和 `src/lib/theme/canvas.ts`。

## 验证完成条件

- 实际导出含非空正文的 PNG；可见 DOM 或背景色不能代替内容验证。
- 对像素敏感改动，以 Playwright 元素截图作 ground truth，解码导出 PNG 并比较内容、背景和页脚采样点。
- 运行命中改动的 `tests/e2e/theme-presets-*.spec.ts` 或 `tests/e2e/background-picker.spec.ts`。
- 内容图片需实际上传并导出 PNG，解码后采样图片区域，确认包含图片像素而非背景色；批量 ZIP 中逐张检查含图卡片，图片页检查裁切后的四角与中心。对应 `tests/e2e/content-image.spec.ts` 与 `tests/e2e/image-page.spec.ts`，圆角、阴影还需与导出前的预览截图比较。

## 7. `filter` 可以导出，`backdrop-filter` 不行

html2canvas-pro 2.4 把 CSS `filter`（`blur()`、`brightness()`、`saturate()`、`drop-shadow()` 等）直接写入 Canvas 2D 的 `ctx.filter`；`backdrop-filter` 没有属性描述符，导出时被整体忽略。

磨砂效果必须写成"独立的模糊图片层 + 半透明纯色蒙层"，两层都在导出节点内；任何 `backdrop-filter` 都只能留在导出节点之外的界面装饰层。模糊层要略微放大（约 1.08 倍）并被父容器裁切，否则边缘会露出透明发白。

2.4.1 的 `filter` 映射还有两处必须在导出侧抹平，否则预览有模糊、导出没有：

- 它把长度参数的单位写了两遍（`blur(12px)` → `blur(12pxpx)`）。Canvas 2D 遇到非法 filter 字符串会整体丢弃（`ctx.filter` 变回 `none`），模糊被静默吃掉。
- `ctx.filter` 在设备像素空间生效，不随 `scale` 选项放大。导出 3 倍图时模糊半径要同步乘 3，两端才一样模糊。

两条都由 `src/lib/export/canvas-filter.ts` 在一次导出的调用期间临时接管 `CanvasRenderingContext2D.prototype.filter` 完成，导出结束立刻还原；升级 html2canvas-pro 时先回归这两条。

## 8. 椭圆径向渐变在"高比宽长"时会出现水平接缝（已打补丁）

html2canvas-pro 2.4.1 的 `renderRadialGradient` 把椭圆渐变先画进一张 `max(rx, ry)` 见方的离屏画布，再把纵向按 `ry / rx` 缩放。横向半径更大时（`rx ≥ ry`）结果正确；纵向半径更大时（`ry > rx`，例如 9:16 卡片上 `ellipse 72% 52%` 解析成 270 × 347px）渐变被拉出画布边缘，还没淡到透明就被截断，导出图在圆心下方 `ry` 处出现一条横贯整宽的硬接缝。预览由浏览器绘制，不受影响，所以只有导出图"分层"。

主题背景的光晕几乎都是这种写法，1:1 与 9:16 全部中招，3:4 上蜜光暖阳、樱花奶霜也会。仓库用 `patches/html2canvas-pro@2.4.1.patch` 修正了算法：以横向半径 `rx` 画圆形渐变，离屏画布取 `2rx × 2ry` 的完整包围盒再按 `ry / rx` 缩放，并先用最后一个色标填满整个区域（浏览器就是这样把径向渐变延伸到结束形状之外的）。

升级 html2canvas-pro 时先确认上游是否已修，未修则重新生成补丁；`tests/e2e/theme-system-release.spec.ts` 的 9:16 接缝测试会在补丁失效时失败。

## 9. 内容图片导出前必须等解码与布局

html2canvas-pro 只等图片像素加载，不等预览 DOM 按图片尺寸完成布局；图片尚未解码时，测得的高度可能为 0。`src/features/preview/hooks/use-image-export.ts` 在单张与批量共用的绘制入口等待资产占位更新，再通过 `Promise.all` 等待节点内所有 `img.decode()`，最后调用 html2canvas-pro。资产加载超过 10 秒或解码失败时终止本次导出。不要把等待移到某个按钮或仅保留批量切页的两帧等待。

当前 `useCORS: true` 配置下，跨域图片没有 CORS 许可时，html2canvas-pro 会在加载失败后静默跳过图片：导出成功但缺图，而非抛出可捕获的导出错误。因此 http/https 图片必须先导入本地资产库；未导入外链与缺失资产均以文字占位导出，导入按钮与错误操作区通过 `data-export-ignore` 仅从克隆节点移除。

react-markdown 的默认 URL 过滤会清空 `image:`，内容图片需显式放行该协议。仅含图片的 p 必须替换为全宽 figure，否则收缩段落无法按内容区居中；正文和封面配图使用 auto 宽高与 max-width/max-height 双约束。

html2canvas-pro 2.4.1 已支持 `object-fit`。图片页使用 `object-fit: cover` 与居中位置，把图片裁切铺满卡片；对应样式由 `src/lib/theme/generator.ts` 生成。正文配图保留完整画面，图片页接受边缘裁切，两者按各自规则验证导出。

## 10. `box-shadow` 的 Canvas 参数必须按导出倍率缩放（已打补丁）

html2canvas-pro 2.4.1 支持图片圆角与阴影，但绘制 box-shadow 时直接把 CSS 长度赋给 `ctx.shadowOffsetX/Y` 和 `ctx.shadowBlur`。这些属性使用设备像素，不随 `ctx.scale` 缩放；用于隐藏原始填充的横向遮罩偏移也必须同步缩放，否则 3 倍导出时阴影会错位到画布外。

`patches/html2canvas-pro@2.4.1.patch` 将三个参数（含遮罩偏移）乘导出倍率，保留原有径向渐变修复。`tests/e2e/content-image.spec.ts` 比较导出前预览截图与 PNG 的图片中心、圆角和下沿阴影采样点。截图必须在触发导出前获取，导出成功蒙层会覆盖可见预览，但不属于导出节点。

浏览器默认给 img 设置 `overflow: clip`，库会把这个裁切同时用于图片背景与阴影，导致自身阴影被截掉。导出模块只在 html2canvas 的克隆节点上将 img 设为 `overflow: visible`，圆角由库的 padding-box 绘制路径裁切。预览保留浏览器的 `overflow: clip`，否则浏览器会让图片像素越过圆角。
