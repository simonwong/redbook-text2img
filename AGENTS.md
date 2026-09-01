# Agent Guidelines

This file provides guidance to Agent when working with code in this repository.

## Commands

- `pnpm build` - 可以运行构建验证
- `pnpm dev` - 禁止 启动开发服务器验证
- `pnpm lint:check` - 禁止 lint 检查，使用 `pnpm exec ultracite check [files...]` 检查指定文件
- `pnpm lint:fix` - 禁止 lint 修复，使用 `pnpm exec ultracite check [files...]` 修复指定文件

Always use `pnpm` instead of `npm`.

## Code Principles (MUST follow strictly)

- **KISS**: Keep it simple, prefer straightforward solutions over clever ones
- **DRY**: Don't repeat yourself, eliminate duplication through abstraction and composition
- **Single Responsibility**: Each function, component, and file should do one thing well
- **Minimal Complexity**: Reduce cognitive load by breaking down complex logic
- **One component per file**: Never put multiple components in one file. SVG icons must also be separate files.

## 项目结构

```
src/
├── app/                    # Next.js App Router 页面
├── components/             # 通用组件（含 icons/ 和 ui/ 子目录）
├── features/              # 功能模块（editor、preview、configurator）
├── lib/                   # 工具函数和配置
└── store/                 # Zustand 状态管理
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

## Agent skills

### Issue tracker

Issues are tracked in this repo's GitHub Issues via the `gh` CLI; external PRs are not a triage surface. See `docs/agents/issue-tracker.md`.

### Triage labels

The five canonical triage roles map 1:1 to label strings of the same name. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `CONTEXT.md` + `docs/adr/` at the repo root, created lazily by `/domain-modeling`. See `docs/agents/domain.md`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
