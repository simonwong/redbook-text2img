# 主题系统发布审计

日期：2026-08-25

范围：内置 8 个主题、样式设置、实时预览与 PNG 导出

结论：通过

## 结构与交互

- 主题保持一个无分类的 2×4 网格，桌面与移动端均为 8 个同级选项。
- 每张缩略图同时读取 `Style System.resolve()` 的封面、正文和顶栏结果；未按主题 ID 复制样式规则。
- 缩略图表达画布背景、内容底板、字体、标题装饰、密度、封面水平与垂直版式，以及备忘录顶栏。
- 当前主题显示“当前”；产生任意配置覆盖后显示“已调整”。键盘焦点额外使用 2px 虚线轮廓，三个状态均不只依赖颜色。
- 主题卡和全部设置控件在 390px 触控视口中至少为 44×44px。
- 设置继续固定显示主题、背景、排版、正文标题、封面、卡片标记六组，不折叠。

## 渲染矩阵

Playwright 对每个主题分别验证封面与正文，并覆盖以下内容：

- 长标题、短正文、长正文；
- 中文、English、emoji；
- 列表、引用、链接、强调、inline code、fenced code；
- 四页分页与 `03 / 04` 页码；
- 内容不溢出时的几何边界；
- 超长正文时 8 个主题均显示分页提示，且提示不在 `.img-preview` 导出节点内。

每个主题均下载并解码当前页 PNG。导出尺寸固定为 1125×1500；浏览器预览与 PNG 在背景、内容底板、标题装饰、页码和卡片标记采样点保持一致。

## 对比度与背景

- 正文、标题、强调、链接、页码、引用和代码的普通文本门槛为 4.5:1；因此同时高于大字 3:1 门槛。
- 每套主题在隐藏内容后，从画布 3×3 网格读取真实像素，逐点校验所有语义文字色。
- 渐变背景按多个位置采样；三角图片背景按实际栅格像素采样；浮层和备忘录底板单独验证。
- 深色主题平均背景亮度保持深色范围；其余主题保持浅色范围。

## 导出安全

Style System 单测遍历 8 个主题的封面和正文，共 16 个解析上下文：

- 禁止 `filter`、`backdropFilter`、`maskImage`、`mixBlendMode`；
- 禁止 `http:`、`https:` 和 `javascript:` 样式值；
- CSS `url()` 只允许本地 `data:image/`；
- 标题波浪和三角背景均为内联 SVG data URI；
- PNG 测试通过真实 `html2canvas-pro` 导出路径，不只检查样式对象。

## Impeccable 审计

- `adapt`：验证 767、768、1199、1200px 四个边界；移动端使用唯一底部抽屉，中间宽度使用右侧覆盖层，1200px 使用内嵌设置栏。
- `harden`：验证长短内容、多语言、emoji、代码、分页、溢出提示和 44px 触控目标。
- `colorize`：逐套检查画布、底板、标题装饰和语义文字的真实像素对比度。
- `polish`：人工检查 1200×900 与 390×844 渲染截图。8 个缩略图的层级、装饰和版式可辨；状态徽标未遮挡标题或触控区；Apple 顶栏只作装饰。
- `audit` detector 返回 1 条 `side-tab`：`src/lib/theme/generator.ts` 的 Markdown `blockquote` 使用左边框。该规则针对卡片侧边强调，此处是引用语义和 Markdown 常规呈现，判定为 false positive，保留实现。

Detector 是机械线索，不作为通过依据。发布结论同时依赖浏览器几何、语义、键盘、触控、真实像素、导出 PNG 与人工视觉检查。

## 验证命令

```text
pnpm exec ultracite check <changed files>
pnpm exec tsc --noEmit --ignoreDeprecations 6.0
pnpm test
pnpm exec playwright test
pnpm build
node /Users/simon/.agents/skills/impeccable/scripts/detect.mjs --json src/features/configurator src/features/preview src/lib/theme src/lib/style-system
```

最终结果：124 个 Vitest 测试、14 个 Playwright 测试及生产构建全部通过。
