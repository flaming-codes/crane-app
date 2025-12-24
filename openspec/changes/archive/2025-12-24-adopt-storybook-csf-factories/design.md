## Context

Storybook stories in this project still use older patterns (e.g., inline CSF objects or `Template.bind`). Storybook's CSF Next (CSF factories) introduces a factory chain (`definePreview` → `preview.meta` → `meta.story`) that improves type inference and story reuse ergonomics.

## Goals / Non-Goals

- Goals: unify `.stories.tsx` files on CSF Next factories (`preview.meta` + `meta.story`); rely on factory inference rather than manual `Meta`/`StoryObj` typing; keep rendered stories functionally unchanged.
- Non-Goals: change component behavior or styling; add new stories beyond existing coverage; overhaul Storybook tooling or CI beyond what migration needs.

## Decisions

- Use Storybook's CSF Next factories directly: import `preview`, create `const meta = preview.meta({...})`, and export stories via `meta.story({...})`.
- Replace legacy reuse patterns with `<Story>.extend(...)` and access inherited values via `<Story>.composed.*` (direct property access like `Story.args` is deprecated in CSF Next).
- Keep additional helpers minimal; any helper should only reduce repetition (e.g., shared base args) without obscuring the CSF Next API.

## Risks / Trade-offs

- Large migration touchpoints may create merge conflicts; batching updates by feature area can mitigate churn.
- Story behavior could drift during refactors; rely on visual/manual Storybook checks plus type/lint to catch regressions.

## Migration Plan

- Upgrade `.storybook/main.*` and `.storybook/preview.*` to `defineMain(...)` and `definePreview(...)` prerequisites.
- Migrate story files in scoped batches (e.g., per module) to `preview.meta` + `meta.story` while verifying Storybook render and controls locally.
- Remove legacy patterns (`Template.bind`, direct `Story.args` reuse) once migrated.
- Check https://storybook.js.org/docs/api/csf/csf-next#upgrading-from-csf-1-2-or-3 for reference to see valid code examples.

## Open Questions

- Should we add a guard (lint rule or code review checklist) to prevent reintroducing `Template.bind` or mixed CSF formats within a file?
