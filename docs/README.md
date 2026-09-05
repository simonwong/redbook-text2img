# 文档索引

按任务读取，不把整个 `docs/` 当成必读上下文。

## 领域与决策

- 修改主题、样式配置、预览或导出前，先读 [`CONTEXT.md`](../CONTEXT.md)，再按文件序号读取涉及该行为的 ADR。
- [`adr/0001-three-layer-theme-system.md`](adr/0001-three-layer-theme-system.md)：Style System Module 与三层模型。
- [`adr/0002-rollback-surface-density-heading-size.md`](adr/0002-rollback-surface-density-heading-size.md)：内容底板、密度、正文标题字号。
- [`adr/0003-remove-heading-decoration.md`](adr/0003-remove-heading-decoration.md)：标题装饰与装饰色。
- [`adr/0004-custom-background-and-compact-settings.md`](adr/0004-custom-background-and-compact-settings.md)：自定义背景与设置面板。
- [`adr/0005-remove-floating-card-surface.md`](adr/0005-remove-floating-card-surface.md)：浮层卡布局。
- [`adr/0006-card-frame-ratio-accent-frost-custom-themes.md`](adr/0006-card-frame-ratio-accent-frost-custom-themes.md)：卡片边框与比例、强调色、图片磨砂、系统字体扩充、自定义主题、扁平设置面板。

ADR 记录当时决策；后置 ADR 明示取代的条款优先。`CONTEXT.md` 是当前术语的单一来源。

## 任务参考

- [`html2canvas-pitfalls.md`](html2canvas-pitfalls.md)：改动 DOM 样式、背景、预览切页或 PNG 导出时读。
- [`theme-system-release-audit.md`](theme-system-release-audit.md)：2026-08-25 发布证据快照，只用于历史追溯。
