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
          <div className="space-y-4 text-lg leading-relaxed text-gray-normal">
            <p>
              CRAN/E provides a Model Context Protocol (MCP) server that enables
              programmatic access to our comprehensive R package database. AI
              assistants and tools can query packages, authors, and perform
              searches with real-time data.
            </p>
            <p>
              The server is available at{" "}
              <code className="px-2 py-1 text-sm rounded bg-gray-2 dark:bg-gray-12">
                /api/mcp
              </code>{" "}
              and follows the MCP specification for seamless integration.
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-gray-dim text-xs font-semibold tracking-[0.35em] uppercase">
              Quick MCP config
            </p>
            <div className="p-4 font-mono text-sm leading-relaxed border rounded-lg border-gray-6/40 dark:border-gray-1/20 bg-gray-2/80 dark:bg-gray-12/60">
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
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-dim">
              <ClientOnly
                fallback={
                  <div className="rounded-full cursor-pointer">
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
                      className="transition-colors rounded-full cursor-pointer hover:bg-slate-6"
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
                <code className="px-2 py-1 font-mono rounded bg-gray-2 dark:bg-gray-12">
                  /api/mcp
                </code>
                <span className="text-gray-8">•</span>
                <span className="text-gray-9">Version:</span>
                <code className="px-2 py-1 font-mono rounded bg-gray-2 dark:bg-gray-12">
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
            <div className="p-4 border rounded-lg border-gray-6/40 dark:border-gray-1/20 dark:bg-gray-12/40 bg-white/60">
              <div className="flex items-center gap-2 mb-2 text-base font-semibold text-gray-11 dark:text-gray-3">
                <RiPagesLine size={20} /> Package resource
              </div>
              <p className="text-gray-normal">
                Access detailed metadata for any CRAN package including
                dependencies, authors, download statistics, and release
                information.
              </p>
              <div className="inline-block px-3 py-2 mt-3 font-mono text-sm rounded bg-gray-2 dark:bg-gray-12">
                cran://package/{"{name}"}
              </div>
            </div>
            <div className="p-4 border rounded-lg border-gray-6/40 dark:border-gray-1/20 dark:bg-gray-12/40 bg-white/60">
              <div className="flex items-center gap-2 mb-2 text-base font-semibold text-gray-11 dark:text-gray-3">
                <RiUserLine size={20} /> Author resource
              </div>
              <p className="text-gray-normal">
                Retrieve comprehensive author profiles with their associated
                packages and contributions to the R ecosystem.
              </p>
              <div className="inline-block px-3 py-2 mt-3 font-mono text-sm rounded bg-gray-2 dark:bg-gray-12">
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
            <div className="p-4 border rounded-lg border-gray-6/40 dark:border-gray-1/20 dark:bg-gray-12/40 bg-white/60">
              <div className="flex items-center gap-2 mb-2 font-semibold text-gray-11 dark:text-gray-3">
                <RiSearchLine size={20} /> search_packages
              </div>
              <p className="text-gray-normal">
                Search for R packages in the CRAN database. Returns name, title,
                description, and other metadata.
              </p>
              <div className="inline-block px-3 py-2 mt-3 font-mono text-sm rounded bg-gray-2 dark:bg-gray-12">
                query (string) · limit (optional, default 20)
              </div>
            </div>
            <div className="p-4 border rounded-lg border-gray-6/40 dark:border-gray-1/20 dark:bg-gray-12/40 bg-white/60">
              <div className="flex items-center gap-2 mb-2 font-semibold text-gray-11 dark:text-gray-3">
                <RiUserLine size={20} /> search_authors
              </div>
              <p className="text-gray-normal">
                Search for R package authors. Returns author names and their
                associated packages.
              </p>
              <div className="inline-block px-3 py-2 mt-3 font-mono text-sm rounded bg-gray-2 dark:bg-gray-12">
                query (string) · limit (optional, default 8)
              </div>
            </div>
            <div className="p-4 border rounded-lg border-gray-6/40 dark:border-gray-1/20 dark:bg-gray-12/40 bg-white/60">
              <div className="flex items-center gap-2 mb-2 font-semibold text-gray-11 dark:text-gray-3">
                <RiTerminalLine size={20} /> search_universal
              </div>
              <p className="text-gray-normal">
                Combined search for both packages and authors when intent is
                ambiguous or a full match list is desired.
              </p>
              <div className="inline-block px-3 py-2 mt-3 font-mono text-sm rounded bg-gray-2 dark:bg-gray-12">
                query (string)
              </div>
            </div>
          </div>
        </PageContentSection>

        <Separator />

        <PageContentSection headline="Usage" fragment="usage">
          <div className="space-y-4 text-gray-normal">
            <p>
              Configure your MCP client with the JSON above. The server will
              register all resources and tools for immediate use.
            </p>
            <ul className="ml-4 space-y-2 list-disc list-inside">
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
          <ul className="ml-4 space-y-2 list-disc list-inside text-gray-normal">
            <li>Smarter package discovery and recommendation</li>
            <li>Automated dependency analysis and management</li>
            <li>Enhanced R development experiences with AI assistance</li>
            <li>Real-time access to the latest CRAN package information</li>
            <li>Seamless integration with development tools and IDEs</li>
          </ul>
          <div className="flex flex-wrap gap-4 mt-6">
            <ExternalLink href="https://modelcontextprotocol.io">
              <InfoPill variant="slate" label="Learn more">
                About MCP
                <RiExternalLinkLine size={16} className="ml-2 text-gray-dim" />
              </InfoPill>
            </ExternalLink>
            <ExternalLink href="https://code.visualstudio.com/docs/copilot/customization/mcp-servers">
              <InfoPill variant="slate" label="VS Code">
                MCP Server Setup
                <RiExternalLinkLine size={16} className="ml-2 text-gray-dim" />
              </InfoPill>
            </ExternalLink>
            <ExternalLink href="https://modelcontextprotocol.io/docs/develop/connect-remote-servers">
              <InfoPill variant="slate" label="Documentation">
                Remote Servers
                <RiExternalLinkLine size={16} className="ml-2 text-gray-dim" />
              </InfoPill>
            </ExternalLink>
            <Link viewTransition to="/about">
              <InfoPill variant="sand" label="Visit">
                About CRAN/E
                <RiArrowRightSLine size={16} className="ml-2 text-gray-dim" />
              </InfoPill>
            </Link>
          </div>
        </PageContentSection>
      </PageContent>
    </>
  );
}
