## 1. Implementation

- [x] 1.1 Upgrade Storybook to latest and (optionally) run `npx storybook automigrate csf-factories` to apply baseline changes.
- [x] 1.2 Update `.storybook/main.*` to use `defineMain(...)`.
- [x] 1.3 Update `.storybook/preview.*` to use `definePreview(...)` and ensure addons are declared there.
- [x] 1.4 Migrate `.stories.tsx` files under `web/app/modules` to CSF Next factories (`preview.meta` + `meta.story`), removing `Template.bind` and legacy CSF patterns.
- [x] 1.5 Update story reuse patterns to use `<Story>.extend(...)` and `BaseStory.composed.*` when inheriting args/parameters.
- [x] 1.6 Migrate any remaining Storybook stories elsewhere in the repo to the same pattern for consistency.
- [x] 1.7 Validate migration by running `npm run typecheck`, linting the touched files (or `npm run lint` if feasible), and confirming Storybook/dev build still succeeds.
