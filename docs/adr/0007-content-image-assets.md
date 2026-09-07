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


## 图片导入入口与远程代理

本地文件选择、粘贴和拖拽共用入库与插入流程；图片文件由 CodeMirror DOM 事件处理器拦截，非图片文件保持默认行为。拖拽使用落点位置，异步入库期间通过文档变更映射维护插入范围，多张图片在一次事务中插入，撤销一步恢复。

远程链接由浏览器使用 CORS 与 no-referrer 直连抓取，失败统一回落 Node Route Handler；不根据浏览器异常猜测 CORS、404 或离线。代理仅接受 same-origin 或 none 的 Sec-Fetch-Site，不转发 Referer、Cookie 或认证头。每跳都校验 URL、解析全部 DNS 地址并拒绝受限网段，再用 Node http/https 的 lookup 固定已校验地址，最多跟随三次重定向。只接收 image/* 且通过 PNG、JPEG、GIF、WebP、AVIF 或 BMP 魔数检查的响应；原始图片字节流上限 4MiB，DNS、重定向、响应头和响应体共用 10 秒总期限。

代理以 NDJSON 流封装图片字节块与最终完成或错误消息，不积累整张图片后再返回。原因是 HTTP 头发出后无法把超限或超时改为 413/504；流内错误码让用户仍能得到准确原因。头发出前的错误使用 HTTP 状态码与同样的错误码，浏览器只在收到完成标记后构造 Blob 并入库，截断流与错误流均不插入引用。传输层 Content-Type 为 application/x-ndjson，image/* 限制作用于上游响应，图片的实际类型以魔数为准。
