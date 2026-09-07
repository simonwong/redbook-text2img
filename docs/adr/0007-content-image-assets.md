---
status: accepted
---

# 内容图片入库引用与导出一致性

内容图片先导入本地资产库，再通过 `![说明](image:a1b2c3d4e5)` 引用。资产 id 由两个存储实现共用的生成函数通过 `crypto.getRandomValues` 生成，为 10 位 base36 小写字母数字。默认 `align=center` 与 `size=full` 不写入查询串；非默认配置如 `![说明](image:a1b2c3d4e5?align=left&size=s)`。解析仍兼容旧 id 与显式默认参数。Markdown 只保存短引用；图片不占用草稿和主题的 localStorage 配额。复制 Markdown 到其他浏览器或设备不会携带图片资产。

资产库用 IndexedDB 保存 Blob，存入、读取、列出、删除共用一个接口，内存实现用于测试和存储不可用时的会话回退。IndexedDB 打开或写入失败时提示图片仅在本次会话保留。上传解码后按最长边 2000 等比缩小；像素含透明度时输出 PNG，否则输出 JPEG。内容变更不删除资产，避免撤销后丢图。

禁止纯远程图片引用：html2canvas-pro 在跨域图片没有 CORS 许可时可能静默缺图，预览成功不能证明导出成功。未导入的图片显示说明占位；缺失资产也显示含 alt 的占位，并随卡片导出。

预览不做 SSR：`src/features/layouts/index.tsx` 在 `isHydrated` 为 false 时返回 null，预览仅在浏览器挂载。资产加载结果保存在模块级同步缓存，组件通过 `useSyncExternalStore` 订阅；object URL 在会话期间不撤销。缓存避免切页重新异步取图，且不使用 Suspense，以免导出截到 fallback。若将来启用预览 SSR，必须重新设计资产解析与 hydration 边界。

仅含一张图片的 Markdown 段落通过 react-markdown 提供的 node 判定，渲染为全宽 figure，不在 p 中嵌套块级容器。figure 负责居中；img 宽高均为 auto，同时受 max-width 和按卡片高度一半生成的像素 max-height 约束。正文和封面内的内容图片共用这些规则。

导出模块在单张和批量绘制前等待资产占位完成更新，再等待节点内所有 img.decode()；加载超时则终止该次导出。html2canvas-pro 等待图片像素不等于等待预览布局。溢出检测监听内容中的图片 load 和节点变化，在异步加载与占位替换后重新测量。
