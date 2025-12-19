# MCP Server (Crane App)

Minimal notes to integrate the deployed MCP server.

## Endpoint
- Path: `/api/mcp`
- Transport: Streamable HTTP (supports SSE for streaming). Works with standard MCP clients.
- Hosted inside React Router (`loader` + `action`) so it ships with every deployment.

## Server Info
- Name: `Crane App MCP Server`
- Version: `1.0.0`

## Tools
- `search_packages`
  - Input: `{ query: string; limit?: number }`
  - Action: Searches CRAN packages via `PackageService.searchPackages`.
  - Response: includes `url` pointing to the package page (`/package/<name>`).
- `search_authors`
  - Input: `{ query: string; limit?: number }`
  - Action: Searches authors via `AuthorService.searchAuthors`.
  - Response: includes `url` pointing to the author page (`/author/<name>`).
- `search_universal`
  - Input: `{ query: string }`
  - Action: Combined packages + authors via `SearchService.searchUniversal`.
  - Response: each item has `url` to the package/author page.

Responses are returned as MCP tool results with `content: [{ type: "text", text: JSON.stringify(result, null, 2) }]`.

## Client Connect (example)
```ts
import { Client } from "@modelcontextprotocol/sdk/client";
import { WebSocket } from "ws"; // or fetch-based transport depending on client

const client = new Client({ serverUrl: "https://<host>/api/mcp" });
await client.connect();
```

For raw HTTP/SSE clients, POST MCP JSON-RPC messages to `/api/mcp` and GET the same path to open the stream.

## Dependencies
- `@modelcontextprotocol/sdk`
- `zod`

## Notes
- Stateless by default; adjust `WebStandardStreamableHTTPServerTransport` options in `app/routes/api.mcp.ts` if you need session IDs or retry tuning.
