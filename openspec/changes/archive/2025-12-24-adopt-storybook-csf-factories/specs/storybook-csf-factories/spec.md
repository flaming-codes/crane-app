## ADDED Requirements

### Requirement: Story files use CSF Next factories

Storybook `.stories.tsx` files SHALL use CSF Next (CSF factories) by importing the project `preview` and defining component metadata via `preview.meta(...)`, then defining stories via `meta.story(...)`.

#### Scenario: New story uses meta.story

- **WHEN** a contributor adds or upgrades a story file to CSF Next
- **THEN** the file defines `const meta = preview.meta({ ... })` and exports stories via `export const Example = meta.story({ ... })`

### Requirement: Storybook config uses defineMain and definePreview

The project Storybook configuration SHALL be compatible with CSF Next by defining `.storybook/main.*` using `defineMain(...)` and `.storybook/preview.*` using `definePreview(...)`.

#### Scenario: CSF Next prerequisites are met

- **WHEN** any story file uses CSF Next factories
- **THEN** the project has been upgraded so `.storybook/main.*` and `.storybook/preview.*` use `defineMain` and `definePreview` respectively

### Requirement: Story reuse uses extend and composed

When one story reuses properties from another story, authors SHALL prefer `<Story>.extend(...)`. If a story's inherited properties (args/parameters/etc.) are referenced, they SHALL be accessed via `<Story>.composed.*` rather than direct property access.

#### Scenario: Variant reuses args safely

- **WHEN** a variant derives from another story and reuses args
- **THEN** it is created via `.extend(...)` or it spreads from `BaseStory.composed.args` (not `BaseStory.args`)

### Requirement: No mixed story formats within a file

Storybook story files SHALL NOT mix CSF Next factories with prior CSF formats in the same file.

#### Scenario: Incremental migration

- **WHEN** a contributor migrates a subset of story files
- **THEN** each migrated file is entirely CSF Next, while unmigrated files may remain CSF 1/2/3

### Requirement: Migration maintains Storybook health

The migration to CSF Next SHALL keep Storybook authoring and build workflows healthy (typecheck, lint, and Storybook build/dev flows continue to succeed).

#### Scenario: Build passes after migration

- **WHEN** stories and config are migrated to CSF Next
- **THEN** Storybook-related checks (typecheck, lint on touched files, and Storybook build/preview where available) continue to pass without errors attributable to story definitions
