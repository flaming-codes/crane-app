# MCP Server (Crane App) & ChatGPT Apps SDK Integration

This document captures the live MCP surface and how it is wired for the ChatGPT Apps SDK (directory submission).

## Endpoint
- Path: `/api/mcp`
- Transport: Streamable HTTP (supports SSE for streaming); see `web/app/routes/api.mcp.ts`.
- Hosted inside Remix route (`loader` + `action`) so it ships with every deployment.

## Server Info
- Name: `Crane App MCP Server`
- Version: `1.0.0`

## Widget (Apps SDK UI)
- Resource: `ui://widget/cran.html`
- File: `web/public/cran-widget.html`
- MIME: `text/html+skybridge`
- Purpose: Renders search UI and consumes `structuredContent` from tool responses via `window.openai.toolOutput` + `callTool`.
- Meta: `_meta["openai/widgetPrefersBorder"] = true`

## Tools (all read-only, open-world)
- `search_packages`
  - Input: `{ query: string; limit?: number }`
  - Action: Searches CRAN packages via `PackageService.searchPackages`.
  - Response (structuredContent): `{ searchType: "packages", query, combined, packages: { hits }, authors: { hits: [] } }`
  - Metadata: `_meta.openai/outputTemplate = ui://widget/cran.html`, toolInvocation labels, `openai/toolDefinition.readOnlyHint = true`, `openWorldHint = true`.
- `search_authors`
  - Input: `{ query: string; limit?: number }`
  - Action: Searches authors via `AuthorService.searchAuthors`.
  - Response (structuredContent): `{ searchType: "authors", query, combined, packages: { hits: { combined: [] } }, authors: { hits } }`
  - Metadata: same annotations as above.
- `search_universal`
  - Input: `{ query: string }`
  - Action: Combined packages + authors via `SearchService.searchUniversal`.
  - Response (structuredContent): `{ searchType: "universal", query, combined, packages: { hits }, authors: { hits } }`
  - Metadata: same annotations as above.

All tool responses also include `content` with a JSON string for debugging.

## Resources
- `cran://package/{name}`
  - Description: Full details for a CRAN package.
  - Data: Includes metadata, authors, maintainer, dependency relations, download stats (month/year), and links back to site.
- `cran://author/{name}`
  - Description: Full details for a package author.
  - Data: Includes author metadata and list of authored packages with roles and links.
- `ui://widget/cran.html`
  - Description: ChatGPT widget HTML used as output template for search tools.

## Client Connect (example)
```ts
import { Client } from "@modelcontextprotocol/sdk/client";
import { WebSocket } from "ws"; // or fetch-based transport depending on client

const client = new Client({ serverUrl: "https://<host>/api/mcp" });
await client.connect();
```
For raw HTTP/SSE clients, POST MCP JSON-RPC messages to `/api/mcp` and GET the same path to open the stream.

## Deployment & CSP (for ChatGPT app submission)
- MCP must be publicly reachable (no localhost/test endpoints).
- Define CSP to allow fetches to Supabase/CRAN and serving `ui://widget/cran.html`. Example:
  - `connect-src`: your MCP host, Supabase API domains, CRAN logs.
  - `frame-ancestors`: `https://chat.openai.com`.
  - `default-src` / `script-src`: self + any CDN you actually use for the widget (currently none besides inline).
- Ensure CORS is permissive for `/api/mcp` (Streamable HTTP).

## Submission checklist (OpenAI Apps Directory)
- Verified organization; submit via https://platform.openai.com/apps-manage (Owner role).
- Privacy policy URL + support contact.
- Accurate app name/description/screenshots.
- Tools labeled with readOnlyHint/openWorldHint; no destructive actions.
- Widget served at `ui://widget/cran.html` and bound via `_meta.openai/outputTemplate`.
- Global data residency (EU projects currently not accepted for submission).

## Dependencies
- `@modelcontextprotocol/sdk`
- `zod`

## Notes
- Stateless by default; adjust `WebStandardStreamableHTTPServerTransport` options in `app/routes/api.mcp.ts` if you need session IDs or retry tuning.
