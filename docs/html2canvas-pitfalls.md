# html2canvas 踩坑记录

本项目使用 `html2canvas-pro` 将 DOM 渲染为 Canvas 再导出 PNG。以下是实际遇到的问题和解决方案。

## 1. inline 元素的 background-color 渲染异常

**现象**：带 `background-color` 的 inline `<code>` 元素，在导出图片中背景会扩展成覆盖整段文字的大色块，把周围文本遮住。浏览器中显示正常，仅导出时出问题。

**原因**：html2canvas 对 `display: inline` 元素的背景绘制存在 bug，会将背景区域错误地计算为整行宽度，而非实际内容宽度。

**解决方案**：将 inline code 改为 `display: inline-block`，同时设置 `lineHeight: "inherit"` 保持行高一致。

```ts
code: {
  display: "inline-block",   // 关键：避免 html2canvas 的 inline 背景 bug
  lineHeight: "inherit",     // 防止 inline-block 改变行高
  backgroundColor: "...",
  padding: "0.15em 0.4em",
  borderRadius: "0.25em",
}
```

**文件位置**：`src/lib/theme/generator.ts`

## 2. overflow: hidden 导致内容被裁切

**现象**：容器设置了 `overflow: hidden` 后，html2canvas 会严格按照容器边界裁切内容，即使在浏览器中视觉上没有溢出。

**解决方案**：仅在必要时使用 `overflow: hidden`（如外层圆角容器）。内层 content 区域不要设置 `overflow: hidden`，否则带 padding/margin 的子元素可能被意外裁切。

## 3. logging: true 会严重影响批量导出性能

**现象**：html2canvas 的 `logging: true` 选项会在每次渲染时输出大量 console.log（DOM 遍历、样式解析等），批量导出时每张图片都会触发，造成明显卡顿。

**解决方案**：生产环境设置 `logging: false`。

```ts
const canvas = await html2canvas(element, {
  logging: false,
  scale: 3,
  // ...
});
```

## 4. URL.revokeObjectURL 的时机

**现象**：`URL.createObjectURL` 创建的 URL 如果在 `link.click()` 后立即 revoke，可能在大文件场景下浏览器还没完成下载就失效了。

**解决方案**：延迟 revoke，给浏览器足够的下载启动时间。

```ts
const url = URL.createObjectURL(blob);
triggerDownload(url, filename);
setTimeout(() => URL.revokeObjectURL(url), 60_000);
```

## 5. 双 requestAnimationFrame 等待渲染

**现象**：批量导出时需要切换 segment index 并等待 React 重新渲染后再截图。单个 `requestAnimationFrame` 不够，需要两帧才能确保 DOM 更新完成。

**当前方案**：

```ts
await new Promise<void>((resolve) => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => resolve());
  });
});
```

**注意**：这个方案在绝大多数场景下可用，但理论上不保证 React 的 commit 已经完成。如果未来遇到截图内容不对的情况，可以考虑使用 `react-dom` 的 `flushSync` 强制同步渲染。

## 6. 渐变里用 `transparent` 淡出，导出后背景发灰发脏

**现象**：带 mesh 渐变的模板（蜜光暖阳、晨雾微光、樱花奶霜、墨夜极光、清新白）浏览器里是正常的暖色/冷色光晕，导出 PNG 后整片背景变成灰褐色。

**原因**：`transparent` 等价于 `rgba(0, 0, 0, 0)`，是"**透明的黑**"。CSS 渐变按**预乘 alpha** 插值，黑色分量不参与，所以浏览器渲染正常；但导出走 html2canvas-pro → Canvas2D 渐变，Canvas2D 按**非预乘** sRGB 插值，RGB 会一路被拉向黑色，中间色因此发灰。

这不是 html2canvas-pro 的 bug —— 它忠实地把 `rgba(0,0,0,0)` 传给了 `addColorStop`。裸 Chrome canvas 做同样的事得到的像素与导出结果逐字节一致，换库或升级都绕不开。

**解决方案**：渐变里**跨区间淡出**的色标必须写成相邻颜色的 alpha 0 版本，不要用 `transparent`。

```ts
// ✗ 导出后发灰
"radial-gradient(ellipse at 88% 12%, #ffe7c2 0%, transparent 55%)"
// ✓ 两种插值空间下一致
"radial-gradient(ellipse at 88% 12%, #ffe7c2 0%, rgba(255, 231, 194, 0) 55%)"
```

**例外**：**硬色标**里的 `transparent` 是安全的 —— 两侧位置相同时不存在跨 alpha 的插值区间。已移除的 highlight 标题装饰曾是这种写法，实测导出 Δ=0：

```ts
// 安全：55%→55%、92%→92% 位置重合，没有渐变区间
`linear-gradient(180deg, transparent 55%, ${color} 55%, ${color} 92%, transparent 92%)`
```

但这依赖两侧百分比**严格相等**；一旦把任何一侧改成淡入淡出，就会重新触发上面的问题。

**验证方式**：Playwright 截元素图作 ground truth，与 html2canvas-pro 导出结果逐像素比对通道差。修复前 warmSun 最大通道差 93，修复后 5。

**文件位置**：`src/lib/theme/tokens.ts`（`gradients`）
