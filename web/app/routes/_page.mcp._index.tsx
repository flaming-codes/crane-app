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
        gradient="sand"
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
          className="gap-8"
        >
          <div className="text-gray-normal space-y-4 text-lg leading-relaxed">
            <p>
              CRAN/E provides a Model Context Protocol (MCP) server that enables
              programmatic access to our comprehensive R package database. AI
              assistants and tools can query packages, authors, and perform
              searches with real-time data.
            </p>
            <p>
              The server is available at{" "}
              <code className="bg-gray-2 dark:bg-gray-12 rounded px-2 py-1 text-sm">
                /api/mcp
              </code>{" "}
              and follows the MCP specification for seamless integration.
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-gray-dim text-xs font-semibold tracking-[0.35em] uppercase">
              Quick MCP config
            </p>
            <div className="border-gray-6/40 dark:border-gray-1/20 bg-gray-2/80 dark:bg-gray-12/60 rounded-lg border p-4 font-mono text-sm leading-relaxed">
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
            <div className="text-gray-dim flex flex-wrap items-center gap-3 text-sm">
              <ClientOnly
                fallback={
                  <div className="cursor-pointer rounded-full">
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
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-gray-9">Endpoint:</span>
                <code className="bg-gray-2 dark:bg-gray-12 rounded px-2 py-1 font-mono">
                  /api/mcp
                </code>
                <span className="text-gray-8">•</span>
                <span className="text-gray-9">Version:</span>
                <code className="bg-gray-2 dark:bg-gray-12 rounded px-2 py-1 font-mono">
                  {mcpVersion}
                </code>
              </div>
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
          <div className="space-y-4">
            <div className="border-gray-6/40 dark:border-gray-1/20 dark:bg-gray-12/40 rounded-lg border bg-white/60 p-4">
              <div className="text-gray-11 dark:text-gray-3 mb-2 flex items-center gap-2 text-base font-semibold">
                <RiPagesLine size={20} /> Package resource
              </div>
              <p className="text-gray-normal">
                Access detailed metadata for any CRAN package including
                dependencies, authors, download statistics, and release
                information.
              </p>
              <div className="bg-gray-2 dark:bg-gray-12 mt-3 inline-block rounded px-3 py-2 font-mono text-sm">
                cran://package/{"{name}"}
              </div>
            </div>
            <div className="border-gray-6/40 dark:border-gray-1/20 dark:bg-gray-12/40 rounded-lg border bg-white/60 p-4">
              <div className="text-gray-11 dark:text-gray-3 mb-2 flex items-center gap-2 text-base font-semibold">
                <RiUserLine size={20} /> Author resource
              </div>
              <p className="text-gray-normal">
                Retrieve comprehensive author profiles with their associated
                packages and contributions to the R ecosystem.
              </p>
              <div className="bg-gray-2 dark:bg-gray-12 mt-3 inline-block rounded px-3 py-2 font-mono text-sm">
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
          <div className="space-y-4">
            <div className="border-gray-6/40 dark:border-gray-1/20 dark:bg-gray-12/40 rounded-lg border bg-white/60 p-4">
              <div className="text-gray-11 dark:text-gray-3 mb-2 flex items-center gap-2 font-semibold">
                <RiSearchLine size={20} /> search_packages
              </div>
              <p className="text-gray-normal">
                Search for R packages in the CRAN database. Returns name, title,
                description, and other metadata.
              </p>
              <div className="bg-gray-2 dark:bg-gray-12 mt-3 inline-block rounded px-3 py-2 font-mono text-sm">
                query (string) · limit (optional, default 20)
              </div>
            </div>
            <div className="border-gray-6/40 dark:border-gray-1/20 dark:bg-gray-12/40 rounded-lg border bg-white/60 p-4">
              <div className="text-gray-11 dark:text-gray-3 mb-2 flex items-center gap-2 font-semibold">
                <RiUserLine size={20} /> search_authors
              </div>
              <p className="text-gray-normal">
                Search for R package authors. Returns author names and their
                associated packages.
              </p>
              <div className="bg-gray-2 dark:bg-gray-12 mt-3 inline-block rounded px-3 py-2 font-mono text-sm">
                query (string) · limit (optional, default 8)
              </div>
            </div>
            <div className="border-gray-6/40 dark:border-gray-1/20 dark:bg-gray-12/40 rounded-lg border bg-white/60 p-4">
              <div className="text-gray-11 dark:text-gray-3 mb-2 flex items-center gap-2 font-semibold">
                <RiTerminalLine size={20} /> search_universal
              </div>
              <p className="text-gray-normal">
                Combined search for both packages and authors when intent is
                ambiguous or a full match list is desired.
              </p>
              <div className="bg-gray-2 dark:bg-gray-12 mt-3 inline-block rounded px-3 py-2 font-mono text-sm">
                query (string)
              </div>
            </div>
          </div>
        </PageContentSection>

        <Separator />

        <PageContentSection headline="Usage" fragment="usage">
          <div className="text-gray-normal space-y-4">
            <p>
              Configure your MCP client with the JSON above. The server will
              register all resources and tools for immediate use.
            </p>
            <ul className="ml-4 list-inside list-disc space-y-2">
              <li>Add the MCP entry to your client configuration.</li>
              <li>
                Connect to <code className="font-mono">/api/mcp</code>.
              </li>
              <li>Call the resources and tools as needed.</li>
            </ul>
            <p>
              Responses include enriched metadata with direct URLs to CRAN/E
              pages for quick reference.
            </p>
          </div>
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
