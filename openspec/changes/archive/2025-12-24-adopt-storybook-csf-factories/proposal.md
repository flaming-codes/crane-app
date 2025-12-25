# Change: Adopt Storybook CSF factories

## Why

- Story files currently use older Storybook patterns, creating duplicated args and weaker inference.
- CSF Next (CSF factories) provides a type-safe, ergonomic authoring model (`preview.meta` → `meta.story`) and clearer story reuse (`.extend`, `.composed`).

## What Changes

- Upgrade Storybook configuration prerequisites to CSF Next (`defineMain` and `definePreview`).
- Migrate `.stories.tsx` files to CSF Next factories by using `preview.meta(...)` and `meta.story(...)`.
- Standardize story reuse using `<Story>.extend(...)` and inherited property access via `<Story>.composed.*`.
- Optionally use `npx storybook automigrate csf-factories` as a baseline, followed by manual cleanup where needed.

## Impact

- Affected specs: storybook-csf-factories
- Affected code: web/app/modules/\*_/_.stories.tsx, any shared Storybook helpers/config, Storybook authoring docs
