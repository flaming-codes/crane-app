import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { MCP_VERSION } from "./config.server";
import { AuthorService } from "../data/author.service";
import { PackageService } from "../data/package.service";
import { SearchService } from "../data/search.service";
import { BASE_URL } from "../modules/app";
import { enrichPackageSearchResults } from "./package-enrichment.server";

// Create a singleton instance
let mcpServer: McpServer | null = null;

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
    name: "CRAN/E MCP Server",
    version: MCP_VERSION,
  });

  server.registerResource(
    "package",
    new ResourceTemplate("cran://package/{name}", { list: undefined }),
    {
      mimeType: "application/json",
      description: "Get full details for a specific CRAN R-package by name",
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
          .describe("Maximum number of results to return (max: 10)"),
      }),
      _meta: {
        "openai/toolInvocation/invoking": "Searching CRAN packages",
        "openai/toolInvocation/invoked": "Found CRAN packages",
        "openai/toolDefinition": {
          readOnlyHint: true,
          openWorldHint: true,
        },
      },
    },
    async ({ query, limit = 10 }) => {
      // Limit to maximum 10 packages
      const effectiveLimit = Math.min(limit, 10);
      const results = await PackageService.searchPackages(query, { limit: effectiveLimit });
      const nonNull = <T>(item: T): item is NonNullable<T> => item != null;
      
      // Extract package names from search results
      const packageNames = (results.combined ?? [])
        .filter(nonNull)
        .map((item) => item.name)
        .slice(0, effectiveLimit);
      
      // Enrich packages with detailed data
      const enrichedPackages = await enrichPackageSearchResults(packageNames, effectiveLimit);
      
      const structured = {
        searchType: "packages" as const,
        query,
        combined: enrichedPackages.map((item) => ({
          ...item,
          type: "package" as const,
        })),
      };
      return makeToolResponse(structured);
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
        "openai/toolInvocation/invoking": "Searching CRAN/E",
        "openai/toolInvocation/invoked": "CRAN/E results ready",
        "openai/toolDefinition": {
          readOnlyHint: true,
          openWorldHint: true,
        },
      },
    },
    async ({ query }) => {
      const results = await SearchService.searchUniversal(query);
      
      // Limit to 10 results and enrich packages
      const limitedResults = results.combined.slice(0, 10);
      
      // Separate packages and authors
      const packageNames = limitedResults
        .filter((item) => item.type === "package")
        .map((item) => item.name);
      
      // Enrich packages with detailed data
      const enrichedPackages = await enrichPackageSearchResults(packageNames, 10);
      
      // Create a map for quick lookup
      const enrichedMap = new Map(
        enrichedPackages.map((pkg) => [pkg.name, pkg])
      );
      
      // Merge enriched packages with authors, preserving order
      const enrichedCombined = limitedResults.map((item) => {
        if (item.type === "package") {
          return enrichedMap.get(item.name) || item;
        }
        return item;
      }).filter(Boolean);
      
      const structured = {
        searchType: "universal" as const,
        query,
        combined: enrichedCombined,
      };
      return makeToolResponse(structured);
    },
  );

  mcpServer = server;
  return mcpServer;
}
