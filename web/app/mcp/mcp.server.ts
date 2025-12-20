import { readFileSync } from "node:fs";
import path from "node:path";
import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { AuthorService } from "../data/author.service";
import { PackageService } from "../data/package.service";
import { SearchService } from "../data/search.service";
import { BASE_URL } from "../modules/app";

// Create a singleton instance
let mcpServer: McpServer | null = null;

const WIDGET_URI = "ui://widget/cran.html";
const WIDGET_PATH = path.resolve("public", "cran-widget.html");
const widgetHtml = readFileSync(WIDGET_PATH, "utf8");

function makeToolResponse(structured: unknown, textPayload?: unknown) {
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(textPayload ?? structured, null, 2),
      },
    ],
    structuredContent: structured as Record<string, unknown>,
  };
}

export function getMcpServer() {
  if (mcpServer) return mcpServer;

  const server = new McpServer({
    name: "Crane App MCP Server",
    version: "1.0.0",
  });

  server.registerResource(
    "cran_widget",
    new ResourceTemplate(WIDGET_URI, { list: undefined }),
    {
      mimeType: "text/html+skybridge",
      description: "ChatGPT widget for searching CRAN packages and authors",
    },
    async (uri) => {
      return {
        contents: [
          {
            uri: uri.toString(),
            mimeType: "text/html+skybridge",
            text: widgetHtml,
            _meta: {
              "openai/widgetPrefersBorder": true,
            },
          },
        ],
      };
    },
  );

  server.registerResource(
    "package",
    new ResourceTemplate("cran://package/{name}", { list: undefined }),
    {
      mimeType: "application/json",
      description: "Get full details for a specific CRAN package by name",
    },
    async (uri, { name }) => {
      const pkgName = String(name);
      const enrichedData =
        await PackageService.getEnrichedPackageByName(pkgName);

      if (!enrichedData) {
        throw new Error(`Package not found: ${pkgName}`);
      }

      const {
        pkg,
        groupedRelations,
        authorsList,
        maintainer,
        dailyDownloads,
        totalMonthDownloads,
        totalYearDownloads,
        isTrending,
        lastRelease,
      } = enrichedData;

      const enriched = {
        ...pkg,
        url: `${BASE_URL}/package/${encodeURIComponent(pkg.name)}`,
        lastRelease,
        authors: authorsList.map((a) => ({
          name: a.name,
          url: `${BASE_URL}/author/${encodeURIComponent(a.name)}`,
        })),
        maintainer: maintainer
          ? {
              name: maintainer.name,
              url: `${BASE_URL}/author/${encodeURIComponent(maintainer.name)}`,
            }
          : null,
        relations: groupedRelations,
        statistics: {
          downloads: {
            lastMonth: totalMonthDownloads,
            lastYear: totalYearDownloads,
            history: dailyDownloads,
          },
          isTrending,
        },
      };

      return {
        contents: [
          {
            uri: uri.toString(),
            mimeType: "application/json",
            text: JSON.stringify(enriched, null, 2),
          },
        ],
      };
    },
  );

  server.registerResource(
    "author",
    new ResourceTemplate("cran://author/{name}", { list: undefined }),
    {
      mimeType: "application/json",
      description: "Get full details for a specific author by name",
    },
    async (uri, { name }) => {
      const author = await AuthorService.getAuthorDetailsByName(String(name));
      if (!author) {
        throw new Error(`Author not found: ${name}`);
      }

      const enriched = {
        ...author,
        url: `${BASE_URL}/author/${encodeURIComponent(author.authorName)}`,
        packages: author.packages.map((p) => ({
          ...p,
          url: `${BASE_URL}/package/${encodeURIComponent(p.package.name)}`,
        })),
      };

      return {
        contents: [
          {
            uri: uri.toString(),
            mimeType: "application/json",
            text: JSON.stringify(enriched, null, 2),
          },
        ],
      };
    },
  );

  server.registerTool(
    "search_packages",
    {
      description:
        "Search for R packages in the CRAN database. Returns package metadata including name, title, description, and other details.",
      inputSchema: z.object({
        query: z.string().describe("The search query string"),
        limit: z
          .number()
          .optional()
          .describe("Maximum number of results to return (default: 20)"),
      }),
      _meta: {
        "openai/outputTemplate": WIDGET_URI,
        "openai/toolInvocation/invoking": "Searching CRAN packages",
        "openai/toolInvocation/invoked": "Found CRAN packages",
        "openai/toolDefinition": {
          readOnlyHint: true,
          openWorldHint: true,
        },
      },
    },
    async ({ query, limit }) => {
      const results = await PackageService.searchPackages(query, { limit });
      const nonNull = <T>(item: T): item is NonNullable<T> => item != null;
      const withLinks = {
        ...results,
        combined: (results.combined ?? []).filter(nonNull).map((item) => ({
          ...item,
          url: `${BASE_URL}/package/${encodeURIComponent(item.name)}`,
          type: "package" as const,
        })),
      };
      const structured = {
        searchType: "packages" as const,
        query,
        combined: withLinks.combined,
      };
      return makeToolResponse(structured, withLinks);
    },
  );

  server.registerTool(
    "search_authors",
    {
      description:
        "Search for R package authors. Returns author names and their associated packages.",
      inputSchema: z.object({
        query: z.string().describe("The search query string"),
        limit: z
          .number()
          .optional()
          .describe("Maximum number of results to return (default: 8)"),
      }),
      _meta: {
        "openai/outputTemplate": WIDGET_URI,
        "openai/toolInvocation/invoking": "Searching authors",
        "openai/toolInvocation/invoked": "Found authors",
        "openai/toolDefinition": {
          readOnlyHint: true,
          openWorldHint: true,
        },
      },
    },
    async ({ query, limit }) => {
      const results = await AuthorService.searchAuthors(query, { limit });
      const withLinks = results.map((item) => ({
        ...item,
        url: `${BASE_URL}/author/${encodeURIComponent(item.name)}`,
        type: "author" as const,
      }));
      const structured = {
        searchType: "authors" as const,
        query,
        combined: withLinks,
      };
      return makeToolResponse(structured, withLinks);
    },
  );

  server.registerTool(
    "search_universal",
    {
      description:
        "Combined search for both R packages and authors. Use this when the user's intent is ambiguous or when they want to see all matches.",
      inputSchema: z.object({
        query: z.string().describe("The search query string"),
      }),
      _meta: {
        "openai/outputTemplate": WIDGET_URI,
        "openai/toolInvocation/invoking": "Searching CRAN",
        "openai/toolInvocation/invoked": "CRAN results ready",
        "openai/toolDefinition": {
          readOnlyHint: true,
          openWorldHint: true,
        },
      },
    },
    async ({ query }) => {
      const results = await SearchService.searchUniversal(query);
      const structured = {
        ...results,
        searchType: "universal" as const,
        query,
      };
      return makeToolResponse(structured, results);
    },
  );

  mcpServer = server;
  return mcpServer;
}
