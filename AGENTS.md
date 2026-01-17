# Agent Guidelines

This file provides guidance to Agent when working with code in this repository.

## Commands

```bash
bun dev          # Start development server (http://localhost:3000)
bun build        # Production build
bun start        # Start production server
bun lint         # Lint code
```

Always use `bun` instead of `npm` or `pnpm`.

## Code Principles (MUST follow strictly)

- **KISS**: Keep it simple, prefer straightforward solutions over clever ones
- **DRY**: Don't repeat yourself, eliminate duplication through abstraction and composition
- **Single Responsibility**: Each function, component, and file should do one thing well
- **Minimal Complexity**: Reduce cognitive load by breaking down complex logic
- **One component per file**: Never put multiple components in one file. SVG icons must also be separate files.
