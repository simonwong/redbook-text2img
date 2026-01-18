# Agent Guidelines

This file provides guidance to Agent when working with code in this repository.

## Commands

```bash
pnpm build        # Production build
pnpm lint:fix     # Fix lint errors
```

Always use `pnpm` instead of `npm`.

## Code Principles (MUST follow strictly)

- **KISS**: Keep it simple, prefer straightforward solutions over clever ones
- **DRY**: Don't repeat yourself, eliminate duplication through abstraction and composition
- **Single Responsibility**: Each function, component, and file should do one thing well
- **Minimal Complexity**: Reduce cognitive load by breaking down complex logic
- **One component per file**: Never put multiple components in one file. SVG icons must also be separate files.

## Test and verify

不要使用 pnpm dev 、pnpm lint:check 等命令验证。

## 项目结构

```
src/
├── app/                    # Next.js App Router 页面
├── components/             # 通用组件
│   ├── icons/             # 自定义 SVG 图标组件
│   ├── ui/                # UI 基础组件（按钮、选择器等）
│   ├── header.tsx         # 顶部导航栏
│   ├── theme-toggle.tsx   # 主题切换组件
│   └── seo-optimized-text.tsx  # SEO 优化的隐藏文本
├── features/              # 功能模块
│   ├── editor/            # Markdown 编辑器
│   ├── preview/           # 图片预览和导出
│   └── configurator/      # 样式配置面板
├── lib/                   # 工具函数和配置
│   ├── seo-config.ts      # SEO 配置（关键词、结构化数据）
│   ├── theme.ts           # 主题配置
│   └── markdown-parser.ts # Markdown 解析器
└── store/                 # Zustand 状态管理
    ├── markdownContent.ts # Markdown 内容状态
    └── theme.ts           # 主题状态
```

## 核心组件说明

### 编辑器 (features/editor)
- `MarkdownEditor`: Markdown 文本编辑器
- 支持实时预览
- 内容持久化到 localStorage

### 预览 (features/preview)
- `ImagePreview`: 图片预览组件
- `useImageExport`: 图片导出 Hook
- 支持单张/批量导出 PNG

### 配置器 (features/configurator)
- 主题选择
- 字体、密度、对齐方式调整
- 样式实时应用

## 状态管理架构

使用 Zustand 进行状态管理：

- `useMarkdownContentStore`: 管理 Markdown 内容和编辑状态
- `useContentThemeStore`: 管理主题和样式配置
- `useSettingsPanelStore`: 管理配置面板显示状态

## 图标库

项目使用 **hugeicons** 图标库：

```typescript
import { HugeiconsIcon } from '@hugeicons/react';
import { IconName } from '@hugeicons/core-free-icons';

<HugeiconsIcon icon={IconName} className="h-4 w-4" />
```

自定义图标放在 `src/components/icons/` 目录。
