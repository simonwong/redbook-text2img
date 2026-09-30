import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface MarkdownContentState {
  content: string;
  isChange: boolean;
  setContent: (content: string) => void;
  resetContent: () => void;
}

const defaultMarkdown = `# 欢迎使用图片生成器

*@simonwong*

这是一个强大的 Markdown 转图片工具，让您轻松创建精美的社交媒体图片。

**适用于小红书、小绿书、公众号图文等多个平台。**

---

## 封面制作说明

💡 **封面规则**：从第一个 \`# 标题\` 到第一个 \`---\` 分割线之间的内容会作为封面图片，默认**居中显示**。

您可以在封面中添加：
- 标题文字
- 作者署名（如 *@yourname*）
- 简短介绍

---

## 主要特点

**功能强大**：支持完整的 Markdown 语法，包括标题、列表、加粗、斜体等。

**样式丰富**：提供多种预设样式，满足不同的视觉需求。

主要功能包括：
- 支持完整的 Markdown 语法
- 多种精美的预设样式
- 一键导出高质量图片
- 实时预览编辑效果

---

## 使用方法

### 第一步：编写内容
在左侧编辑器中输入您的 Markdown 内容。

### 第二步：选择样式
点击右上角调色板图标，选择您喜欢的图片样式。

### 第三步：导出图片
点击导出按钮即可下载生成的图片。

---

## 小贴士

- 使用 \`---\` 分割线来分割不同的图片
- 支持 **加粗** 和 *斜体* 文字
- 三级及以下标题会自动加粗显示
- 支持无序列表，使用 \`-\` 或 \`*\` 开头
- 封面内容默认居中，其他图片左对齐`;

export const useMarkdownContentStore = create<MarkdownContentState>()(
  devtools(
    persist(
      (set) => ({
        content: defaultMarkdown,
        isChange: false,
        setContent: (content) => set({ content, isChange: true }),
        resetContent: () => set({ content: defaultMarkdown, isChange: false }),
      }),
      {
        name: "redbook-markdown-content",
      }
    )
  )
);
