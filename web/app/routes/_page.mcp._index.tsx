import { Link, useLoaderData } from "react-router";
import { PageContent } from "../modules/page-content";
import { PageContentSection } from "../modules/page-content-section";
import { AnchorLink, Anchors } from "../modules/anchors";
import { Separator } from "../modules/separator";
import { ExternalLink } from "../modules/external-link";
import { InfoPill } from "../modules/info-pill";
import {
  RiArrowRightSLine,
  RiExternalLinkLine,
  RiFileCopyLine,
  RiTerminalLine,
  RiSearchLine,
  RiUserLine,
  RiPagesLine,
} from "@remixicon/react";
import { Header } from "../modules/header";
import { mergeMeta } from "../modules/meta";
import { useState } from "react";
import { ClientOnly } from "remix-utils/client-only";
import { MCP_VERSION } from "../mcp/config.server";

const anchors = ["Overview", "Resources", "Tools", "Usage", "Integration"];

export const meta = mergeMeta(() => {
  return [
    { title: "MCP Server | CRAN/E" },
    {
      name: "description",
      content:
        "CRAN/E Model Context Protocol (MCP) Server for programmatic R package access",
    },
  ];
});

type LoaderData = {
  mcpVersion: string;
};

export async function loader(): Promise<LoaderData> {
  return { mcpVersion: MCP_VERSION };
}

export default function McpPage() {
  const { mcpVersion } = useLoaderData<typeof loader>();
  const [copied, setCopied] = useState(false);

  return (
    <>
      <Header
        gradient="iris"
        headline="MCP Server"
        subline="Model Context Protocol for CRAN/E"
      />

      <Anchors anchorIds={anchors.map((item) => item.toLowerCase())}>
        {anchors.map((anchor) => (
          <AnchorLink key={anchor} fragment={anchor.toLowerCase()}>
            {anchor}
          </AnchorLink>
        ))}
      </Anchors>

      <PageContent>
        <PageContentSection
          headline="Overview"
          fragment="overview"
          className="gap-10"
        >
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="text-gray-normal space-y-6 text-lg leading-relaxed">
              <p>
                CRAN/E provides a Model Context Protocol (MCP) server that
                enables programmatic access to our comprehensive R package
                database. This MCP server allows AI assistants and other tools
                to directly query CRAN package information, author details, and
                perform searches with real-time data.
              </p>
              <p>
                The server is available at{" "}
                <code className="bg-gray-2 dark:bg-gray-12 rounded px-2 py-1 text-sm">
                  /api/mcp
                </code>{" "}
                and follows the Model Context Protocol specification for
                seamless integration with AI-powered development workflows.
              </p>
            </div>
            <div className="border-gray-6/30 from-slate-3/50 via-blue-2/40 text-gray-normal dark:border-gray-1/20 dark:from-slate-9/40 dark:via-blue-9/20 dark:to-gray-12/40 dark:text-gray-2 space-y-4 rounded-2xl border bg-linear-to-br to-white/60 p-6 text-base leading-relaxed">
              <p className="text-gray-dim text-xs font-semibold tracking-[0.35em] uppercase">
                Server Info
              </p>
              <p className="text-gray-normal mt-1 text-xl font-semibold">
                CRAN/E MCP Server
              </p>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Version:</strong>{" "}
                  <span className="font-mono">{mcpVersion}</span>
                </p>
                <p>
                  <strong>Endpoint:</strong>{" "}
                  <span className="font-mono">/api/mcp</span>
                </p>
              </div>
              <ClientOnly
                fallback={
                  <div className="hover:bg-slate-6 cursor-pointer rounded-full transition-colors">
                    <InfoPill
                      variant="slate"
                      label={<RiFileCopyLine size={16} />}
                    >
                      Copy MCP URL
                    </InfoPill>
                  </div>
                }
              >
                {() => {
                  const handleCopyMcpUrl = async () => {
                    try {
                      await navigator.clipboard.writeText(
                        `${window.location.origin}/api/mcp`,
                      );
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    } catch {
                      // Ignore copy errors
                    }
                  };

                  return (
                    <button
                      onClick={handleCopyMcpUrl}
                      className="hover:bg-slate-6 cursor-pointer rounded-full transition-colors"
                    >
                      <InfoPill
                        variant="slate"
                        label={<RiFileCopyLine size={16} />}
                      >
                        {copied ? "Copied!" : "Copy MCP URL"}
                      </InfoPill>
                    </button>
                  );
                }}
              </ClientOnly>
            </div>
          </div>
        </PageContentSection>

        <Separator />

        <PageContentSection headline="Resources" fragment="resources">
          <p>
            The MCP server exposes two main resources that provide structured
            access to CRAN data with enriched metadata and direct links to the
            CRAN/E web interface.
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="border-gray-6/30 dark:border-gray-1/20 dark:bg-gray-12/40 rounded-xl border bg-white/80 p-6 shadow-lg">
              <div className="mb-4 flex items-center gap-3">
                <RiPagesLine size={24} className="text-blue-500" />
                <h3 className="text-lg font-semibold">Package Resource</h3>
              </div>
              <p className="text-gray-normal mb-4">
                Access detailed metadata for any CRAN package including
                dependencies, authors, download statistics, and release
                information.
              </p>
              <div className="bg-gray-2 dark:bg-gray-12 rounded-lg p-3 font-mono text-sm">
                cran://package/{"{name}"}
              </div>
            </div>
            <div className="border-gray-6/30 dark:border-gray-1/20 dark:bg-gray-12/40 rounded-xl border bg-white/80 p-6 shadow-lg">
              <div className="mb-4 flex items-center gap-3">
                <RiUserLine size={24} className="text-green-500" />
                <h3 className="text-lg font-semibold">Author Resource</h3>
              </div>
              <p className="text-gray-normal mb-4">
                Retrieve comprehensive author profiles with their associated
                packages and contributions to the R ecosystem.
              </p>
              <div className="bg-gray-2 dark:bg-gray-12 rounded-lg p-3 font-mono text-sm">
                cran://author/{"{name}"}
              </div>
            </div>
          </div>
        </PageContentSection>

        <Separator />

        <PageContentSection headline="Tools" fragment="tools">
          <p>
            The MCP server provides three powerful tools for searching and
            querying the CRAN database with flexible options and real-time
            results.
          </p>
          <div className="space-y-6">
            <div className="border-gray-6/30 dark:border-gray-1/20 dark:bg-gray-12/40 rounded-xl border bg-white/80 p-6 shadow-lg">
              <div className="mb-4 flex items-center gap-3">
                <RiSearchLine size={24} className="text-purple-500" />
                <h3 className="text-lg font-semibold">search_packages</h3>
              </div>
              <p className="text-gray-normal mb-4">
                Search for R packages in the CRAN database. Returns package
                metadata including name, title, description, and other details.
              </p>
              <div className="bg-gray-2 dark:bg-gray-12 rounded-lg p-3 font-mono text-sm">
                <div>Parameters:</div>
                <div>- query (string): The search query string</div>
                <div>
                  - limit (number, optional): Maximum results (default: 20)
                </div>
              </div>
            </div>
            <div className="border-gray-6/30 dark:border-gray-1/20 dark:bg-gray-12/40 rounded-xl border bg-white/80 p-6 shadow-lg">
              <div className="mb-4 flex items-center gap-3">
                <RiUserLine size={24} className="text-green-500" />
                <h3 className="text-lg font-semibold">search_authors</h3>
              </div>
              <p className="text-gray-normal mb-4">
                Search for R package authors. Returns author names and their
                associated packages.
              </p>
              <div className="bg-gray-2 dark:bg-gray-12 rounded-lg p-3 font-mono text-sm">
                <div>Parameters:</div>
                <div>- query (string): The search query string</div>
                <div>
                  - limit (number, optional): Maximum results (default: 8)
                </div>
              </div>
            </div>
            <div className="border-gray-6/30 dark:border-gray-1/20 dark:bg-gray-12/40 rounded-xl border bg-white/80 p-6 shadow-lg">
              <div className="mb-4 flex items-center gap-3">
                <RiTerminalLine size={24} className="text-orange-500" />
                <h3 className="text-lg font-semibold">search_universal</h3>
              </div>
              <p className="text-gray-normal mb-4">
                Combined search for both R packages and authors. Use this when
                the user&apos;s intent is ambiguous or when they want to see all
                matches.
              </p>
              <div className="bg-gray-2 dark:bg-gray-12 rounded-lg p-3 font-mono text-sm">
                <div>Parameters:</div>
                <div>- query (string): The search query string</div>
              </div>
            </div>
          </div>
        </PageContentSection>

        <Separator />

        <PageContentSection headline="Usage" fragment="usage">
          <p>
            To use the CRAN/E MCP server, configure your MCP client to connect
            to our server endpoint. The server will automatically register all
            available resources and tools for immediate use.
          </p>
          <div className="bg-gray-2 dark:bg-gray-12 rounded-xl p-6 font-mono text-sm">
            <div className="text-gray-dim mb-4"># MCP Server Configuration</div>
            <ClientOnly
              fallback={
                <pre>
                  {`{
  "cran-mcp": {
    "type": "http",
    "url": "https://crane.dev/api/mcp"
  }
}`}
                </pre>
              }
            >
              {() => (
                <pre>
                  {`{
  "cran-mcp": {
    "type": "http",
    "url": "${window?.location?.origin || "https://crane.dev"}/api/mcp"
  }
}`}
                </pre>
              )}
            </ClientOnly>
          </div>
          <p className="mt-6">
            Once connected, you can immediately start using the resources and
            tools to query CRAN data programmatically. All responses include
            enriched metadata with direct URLs to the corresponding CRAN/E web
            pages for easy reference.
          </p>
        </PageContentSection>

        <Separator />

        <PageContentSection headline="Integration" fragment="integration">
          <p>
            This MCP integration makes CRAN/E&#39;s data seamlessly accessible
            to AI-powered development workflows, enabling:
          </p>
          <ul className="text-gray-normal ml-4 list-inside list-disc space-y-2">
            <li>Smarter package discovery and recommendation</li>
            <li>Automated dependency analysis and management</li>
            <li>Enhanced R development experiences with AI assistance</li>
            <li>Real-time access to the latest CRAN package information</li>
            <li>Seamless integration with development tools and IDEs</li>
          </ul>
          <div className="mt-6 flex flex-wrap gap-4">
            <ExternalLink href="https://modelcontextprotocol.io">
              <InfoPill variant="slate" label="Learn more">
                About MCP
                <RiExternalLinkLine size={16} className="text-gray-dim ml-2" />
              </InfoPill>
            </ExternalLink>
            <ExternalLink href="https://code.visualstudio.com/docs/copilot/customization/mcp-servers">
              <InfoPill variant="slate" label="VS Code">
                MCP Server Setup
                <RiExternalLinkLine size={16} className="text-gray-dim ml-2" />
              </InfoPill>
            </ExternalLink>
            <ExternalLink href="https://modelcontextprotocol.io/docs/develop/connect-remote-servers">
              <InfoPill variant="slate" label="Documentation">
                Remote Servers
                <RiExternalLinkLine size={16} className="text-gray-dim ml-2" />
              </InfoPill>
            </ExternalLink>
            <Link viewTransition to="/about">
              <InfoPill variant="sand" label="Visit">
                About CRAN/E
                <RiArrowRightSLine size={16} className="text-gray-dim ml-2" />
              </InfoPill>
            </Link>
          </div>
        </PageContentSection>
      </PageContent>
    </>
  );
}
