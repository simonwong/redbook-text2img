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
