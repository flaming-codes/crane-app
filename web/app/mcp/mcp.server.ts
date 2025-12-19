import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { AuthorService } from "../data/author.service";
import { PackageService } from "../data/package.service";
import { SearchService } from "../data/search.service";
import { BASE_URL } from "../modules/app";

// Create a singleton instance
let mcpServer: McpServer | null = null;

export function getMcpServer() {
  if (mcpServer) return mcpServer;

  const server = new McpServer({
    name: "Crane App MCP Server",
    version: "1.0.0",
  });

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
    },
    async ({ query, limit }) => {
      const results = await PackageService.searchPackages(query, { limit });
      const nonNull = <T>(item: T): item is NonNullable<T> => item != null;
      const withLinks = {
        ...results,
        combined: (results.combined ?? []).filter(nonNull).map((item) => ({
          ...item,
          url: `${BASE_URL}/package/${encodeURIComponent(item.name)}`,
        })),
      };
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(withLinks, null, 2),
          },
        ],
      };
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
    },
    async ({ query, limit }) => {
      const results = await AuthorService.searchAuthors(query, { limit });
      const withLinks = results.map((item) => ({
        ...item,
        url: `${BASE_URL}/author/${encodeURIComponent(item.name)}`,
      }));
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(withLinks, null, 2),
          },
        ],
      };
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
    },
    async ({ query }) => {
      const results = await SearchService.searchUniversal(query);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(results, null, 2),
          },
        ],
      };
    },
  );

  mcpServer = server;
  return mcpServer;
}
