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
