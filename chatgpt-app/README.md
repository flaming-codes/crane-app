# chatgpt-app: single-file UI for MCP visuals

## Goals

- Build a small React + TypeScript + Tailwind app using OpenAI Apps UI components.
- Produce **one self-contained HTML** (inline JS + CSS) via Vite for embedding in `web/app/mcp/mcp.server.ts` flows.
- Default to minified output suitable for transport/storage; no external asset dependencies unless explicitly allowed.

## Tech stack

- Vite (React + TS)
- Tailwind CSS
- OpenAI Apps UI component library
- `vite-plugin-singlefile` for inlining
- Optional post-step: `html-minifier-terser` for extra HTML minification

## Build strategy (single-file + minify)

- Vite plugins: `react()`, Tailwind, `viteSingleFile({ removeViteModuleLoader: true })`.
- Build opts: `cssCodeSplit: false`; `assetsInlineLimit` high (e.g., `100_000_000`); `rollupOptions.output.inlineDynamicImports = true`; `manualChunks: undefined`.
- Minification: keep Vite `build.minify: "esbuild"` (JS/CSS). Optionally run `html-minifier-terser` on `dist/index.html` for whitespace/comment stripping.
- Asset policy: prefer inlining fonts/icons or allow CDN fetches if acceptable. Avoid public/`assets/` leftovers.

## Outputs

- Primary artifact: `chatgpt-app/dist/index.html` (single file, minified JS/CSS inline). To be read/served by MCP tooling.
- No additional assets expected; fail build if extra files appear.
- Included in git for easier deployment for now, to avoid change to monorepo.

## Dev + testing

- `npm run dev` for iteration.
- `npm run build` then verify only `dist/index.html` exists and is self-contained.
- Smoke test: load `dist/index.html` directly in browser (file://) to confirm no network fetches unless intentional.

## Initial UI

- Simple “Hello, world” view using an Apps UI component (e.g., Button) to validate bundle and styling.

## Open questions / follow-ups

- Confirm whether external font/icon requests are acceptable; if not, inline alternatives or data URIs.
- Decide on optional HTML post-minification step (enable if size is critical).
