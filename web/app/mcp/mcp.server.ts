import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { AuthorService } from "../data/author.service";
import { PackageService } from "../data/package.service";
import { SearchService } from "../data/search.service";
import { BASE_URL } from "../modules/app";
import { PackageInsightService } from "../data/package-insight.service.server";
import { format, formatRelative, subDays } from "date-fns";
import { groupBy } from "es-toolkit";
import { Tables } from "../data/supabase.types.generated";

// Create a singleton instance
let mcpServer: McpServer | null = null;

export function getMcpServer() {
  if (mcpServer) return mcpServer;

  const server = new McpServer({
    name: "Crane App MCP Server",
    version: "1.0.0",
  });

  server.registerResource(
    "package",
    new ResourceTemplate("cran://package/{name}", { list: undefined }),
    {
      mimeType: "application/json",
      description: "Get full details for a specific CRAN package by name",
    },
    async (uri, { name }) => {
      const pkgName = String(name);
      const pkg = await PackageService.getPackageByName(pkgName);
      if (!pkg) {
        throw new Error(`Package not found: ${pkgName}`);
      }

      const now = new Date();

      const [
        relations,
        authorsData,
        dailyDownloads,
        yearlyDailyDownloads,
        trendingPackages,
      ] = await Promise.all([
        PackageService.getPackageRelationsByPackageId(pkg.id),
        AuthorService.getAuthorsByPackageId(pkg.id),
        PackageInsightService.getDailyDownloadsForPackage(
          pkgName,
          "last-month",
        ),
        PackageInsightService.getDailyDownloadsForPackage(
          pkgName,
          `${format(subDays(now, 365), "yyyy-MM-dd")}:${format(now, "yyyy-MM-dd")}`,
        ),
        PackageInsightService.getTrendingPackages(),
      ]);

      // Process Relations
      const groupedRelations = groupBy(
        relations || [],
        (item) => item.relationship_type,
      );

      // Process Authors & Maintainers
      const authorsList = (authorsData || [])
        .map(({ author, roles }) => ({
          ...((Array.isArray(author)
            ? author[0]
            : author) as Tables<"authors">),
          roles: roles || [],
        }))
        .filter((a) => !a.roles.includes("mnt"));

      const maintainer = (authorsData || [])
        .map(({ author, roles }) => ({
          ...((Array.isArray(author)
            ? author[0]
            : author) as Tables<"authors">),
          roles: roles || [],
        }))
        .filter((a) => a.roles.includes("mnt"))
        .at(0);

      // Process Downloads
      const totalMonthDownloads =
        dailyDownloads
          .at(0)
          ?.downloads?.reduce((acc, curr) => acc + curr.downloads, 0) || 0;

      const totalYearDownloads =
        yearlyDailyDownloads
          .at(0)
          ?.downloads?.reduce((acc, curr) => acc + curr.downloads, 0) || 0;

      const isTrending =
        trendingPackages.findIndex((item) => item.package === pkgName) !== -1;

      const enriched = {
        ...pkg,
        url: `${BASE_URL}/package/${encodeURIComponent(pkg.name)}`,
        lastRelease: formatRelative(new Date(pkg.last_released_at), now),
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
