## Copilot onboarding for `flaming-codes/crane-app`

### What this repo is
- Frontend for **CRAN/E** (pronounced “CRANE”), a PWA that searches CRAN (Comprehensive R Archive Network) packages/authors. Live at https://cran-e.com.
- Tech: TypeScript + React Router v7 (Vite build), Tailwind CSS, Remix-style file-based routes, Supabase data, MCP endpoint. No backend outside the Remix server build.
- Primary code lives in `/web`; the repo root also contains docs/CHANGELOG/README files.

### Repo layout (where to look first)
- Root files: `README.md`, `CHANGELOG.md`, `docs/mcp.md` (MCP server details), `tailwind.config.js`.
- Main project: `/web`
  - `package.json` scripts (build/dev/lint/typecheck), `.nvmrc` (v23.3.0, Node >=20), `.npmrc` (`legacy-peer-deps=true`), `.env.example`.
  - Config: `tsconfig.json`, `.eslintrc.cjs`, `eslint.config.mjs`, `.prettierrc`, `vite.config.ts`, `tailwind.css`.
  - Entrypoints: `app/entry.client.tsx`, `app/entry.server.tsx`, `app/root.tsx`.
  - Routing: `app/routes.ts` + file-based routes under `app/routes` (`_index.tsx` home, `_page.*` layouts/pages, `api.search._index.ts`, `api.mcp.ts`, `*.og` for OG images, sitemap/xml routes).
  - Data/services: `app/data` (env schema, package/author services, types), `app/modules` (UI components), `app/ai`, `app/mcp`, `app/mocks`.
  - Assets: `public/` (icons, manifest), build output goes to `web/build/`.
  - Generated: `.react-router/types` (from `react-router typegen`), `app/licenses.json` (postinstall).

### Environment & prerequisites
- Use Node **>=20** (repo suggests v23.3.0 via `.nvmrc`). Package manager: **npm**.
- `.npmrc` forces `legacy-peer-deps`; keep it to avoid install conflicts.
- Env vars (see `.env.example`, validated by `app/data/env.ts`):
  - **Required:** `VITE_PLAUSIBLE_SITE_ID`, `VITE_PLAUSIBLE_API_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`.
  - **Optional:** `POSTHOG_*`, `GOOGLE_GENERATIVE_AI_API_KEY`, `OTEL_*`, `VITE_RELEASE_CHANNEL`.
  - For local dev/tests, set dummy non-empty strings to satisfy the schema.

### Commands (locally verified)
Run from `/web` unless noted. Always `npm install` first (postinstall regenerates `app/licenses.json`; use `git restore web/app/licenses.json` before committing if you don’t want that change).
- **Install:** `npm install` (19s). Works with provided lockfile; uses `license-report` postinstall to refresh `app/licenses.json` (restorable via `git restore web/app/licenses.json`).
- **Lint:** `npm run lint` → currently **fails** due to pre-existing lint violations in the repo. Expect non-zero exit until fixed; ensure your changes don’t add new lint errors. For iterative work, lint just the files you touch (e.g., `npx eslint app/routes/yourfile.tsx --fix`) to keep new code clean.
- **Typecheck:** `npm run typecheck` (runs `react-router typegen` then `tsc`, success).
- **Build:** `npm run build` (Vite/React Router prod build, succeeds; creates `web/build`).
- **Dev server:** `npm run dev` (React Router dev, Vite-based).
- **Preview/Start:** `npm run preview` runs build then `npm run start` (served via `react-router-serve ./build/server/index.js`). Ensure env vars are set before serving.
- **Other scripts:** `npm run format` (Prettier + tailwind plugin), `npm run licenses.build` (regenerates licenses), `npm run db.types` (requires Supabase CLI + creds to generate DB types).
- No dedicated test suite is defined; validation relies on lint/typecheck/build.

### CI / workflows
- GitHub Actions workflows present: Dependabot updates and “Copilot coding agent” (dynamic). No standard push/PR CI for lint/build; rely on local commands above.

### Working effectively
- Key configs for editing: lint rules (`.eslintrc.cjs`), formatter (`.prettierrc`), path aliases (`tsconfig.json` uses `~/*`), Vite/React Router config (`vite.config.ts`).
- Layout: `app/root.tsx` defines HTML shell/meta/plausible injection + footer toggle. Layout route `_page.tsx` wraps subpages; `_index.tsx` is home search UI; `_page.package.*` handles package detail/OG images; `_page.author.*` handles author pages; `_page.statistic.*` for stats; `api.search._index.ts` provides search JSON; `api.mcp.ts` hosts the MCP server endpoint.
- Public assets & PWA: `public/manifest.webmanifest`, icons under `public/icons`.
- Avoid committing build artifacts (`web/build`) or regenerated `app/licenses.json` unless intentionally updated; clean with `rm -rf web/build` and `git restore web/app/licenses.json`.

### Trust these notes
Follow the commands and file locations above; only search further if something here seems wrong or incomplete.
