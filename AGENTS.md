# Repository Instructions

## Workflow

- Use `pnpm` exclusively.
- Select validation by scope: `pnpm build`, `pnpm test`, or `pnpm test:e2e`.
- Check only changed files: `pnpm exec ultracite check <files...>`.
- Keep the development server stopped. Never run `pnpm dev`.
- **FORBIDDEN:** Never run repository-wide `pnpm lint:check` or `pnpm lint:fix`.

## Context

- Documentation, theme, style, rendering, or export changes: read `docs/README.md`, then follow the pointer matching the task.

## Design

- Prefer deep Modules: keep the Interface small and hide domain rules in the Implementation.
- Add a Seam only when at least two Adapters actually vary. Callers and tests cross the same Interface.
- Keep domain rules in pure Modules. React and Zustand handle interaction, subscription, and persistence.
- Define one React component per file. Put each custom SVG icon in its own file.
- Prefer `@hugeicons/react` with `@hugeicons/core-free-icons`. Put custom icons in `src/components/icons/`.

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
