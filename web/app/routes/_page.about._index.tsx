import { Link } from "react-router";
import { PageContent } from "../modules/page-content";
import { PageContentSection } from "../modules/page-content-section";
import { AnchorLink, Anchors } from "../modules/anchors";
import { Separator } from "../modules/separator";
import { ExternalLink } from "../modules/external-link";
import { InfoPill } from "../modules/info-pill";
import {
  RiArrowRightSLine,
  RiExternalLinkLine,
  RiGithubFill,
  RiLinkedinFill,
  RiPieChart2Fill,
  RiFileCopyLine,
} from "@remixicon/react";
import { Header } from "../modules/header";
import { PlausibleChoicePillButton } from "../modules/plausible";
import { mergeMeta } from "../modules/meta";
import { LicenseTable } from "../modules/licenses";
import { useState } from "react";
import { AboutCreatorCard } from "../modules/about-creator-card";
import { AboutStoryBox } from "../modules/about-story-box";
import { ArcjetLogo } from "../modules/arcjet-logo";

const anchors = [
  "Creators",
  "Mission",
  "MCP",
  "Analytics",
  "Security",
  "Source Code",
  "Licenses",
];

const creatorSpotlight = [
  {
    name: "Lukas Schönmann",
    role: "Bioinformatics & R Development",
    location: "Vienna, Austria",
    portrait: "/images/we/lukas_v2.webp",
    tagline:
      "Specializes in Bioinformatics with a master's from the University of Life Sciences in Vienna, working at the intersection of R research and data analysis.",
    bio: [
      "Lukas brings expertise in Bioinformatics, combining his master's degree from the University of Life Sciences in Vienna with practical R development skills.",
      "He focuses on data analysis and research applications, bridging the gap between biological data and computational insights through R programming.",
    ],
    focusAreas: ["Bioinformatics", "R programming", "Data analysis"],
    links: [
      {
        href: "https://www.linkedin.com/in/lukas-schönmann-70781a215/",
        copy: "Connect with Lukas",
        icon: <RiLinkedinFill size={16} />,
      },
    ],
  },
  {
    name: "Tom Schönmann",
    role: "Informatics & TypeScript Development",
    location: "Vienna, Austria",
    portrait: "/images/we/tom_v2.webp",
    tagline:
      "Works in informatics with a focus on TypeScript development, turning raw CRAN data into lightning-fast search experiences.",
    bio: [
      "Tom specializes in informatics and TypeScript development, architecting the infrastructure that indexes and hydrates tens of thousands of R packages.",
      "He focuses on technical implementation and performance optimization, ensuring the search functionality works seamlessly across the platform.",
    ],
    focusAreas: ["Informatics", "TypeScript", "Search architecture"],
    links: [
      {
        href: "https://www.linkedin.com/in/tom-schönmann-487b97164/",
        copy: "Connect with Tom",
        icon: <RiLinkedinFill size={16} />,
      },
    ],
  },
];

export const meta = mergeMeta(() => {
  return [
    { title: "About | CRAN/E" },
    { name: "description", content: "About the creators of CRAN/E" },
  ];
});

export default function PrivacyPage() {
  const [copied, setCopied] = useState(false);

  const handleCopyMcpUrl = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/api/mcp`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Failed to copy:", err);
    }
  };

  return (
    <>
      <Header
        gradient="sand"
        headline="About"
        subline="Learn more about the creators of CRAN/E"
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
          headline="Mission"
          fragment="mission"
          className="gap-10"
        >
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="text-gray-normal space-y-6 text-lg leading-relaxed">
              <p>
                CRAN/E is a modern PWA (Progressive Web App) that serves as a
                search engine and information display for the incredible
                catalogue of packages hosted on CRAN. CRAN/E means The
                Comprehensive R Archive Network, Enhanced.
              </p>
              <p>
                None of our provided services host any of the packages. Our
                mission is to make R-packages easier to find and better to read.
                We only store metadata associated to the packages for the
                purpose of searching and displaying information.
              </p>
            </div>
          </div>
        </PageContentSection>

        <Separator />

        <PageContentSection
          headline="Creators"
          fragment="creators"
          subline="Portraits, bios, and the craft that keeps CRAN/E alive."
          className="gap-14"
        >
          <div className="grid gap-10 xl:grid-cols-2">
            {creatorSpotlight.map((creator) => (
              <AboutCreatorCard key={creator.name} {...creator} />
            ))}
          </div>
          <AboutStoryBox
            title="Our story"
            headline="Two developers from Austria passionate about coding."
          >
            <p>
              Our names are Lukas and Tom and we&apos;re two developers from
              Austria. Our passion for coding (the one in R, the other in
              TypeScript) led us to the discovery of the original CRAN-site.
            </p>
            <p>
              Seeing the desperate visual state the site was in, we decided to
              give it a facelift. We&apos;re not affiliated with CRAN or RStudio
              in any way. CRAN/E is the culmination of our efforts to make the
              site more modern and user-friendly and we hope you enjoy it as
              much as we do!
            </p>
            <p>
              Our main focus was ease of use and accessibility, especially for
              lightning fast searches.
            </p>
          </AboutStoryBox>
        </PageContentSection>

        <Separator />

        <PageContentSection headline="MCP" fragment="mcp">
          <p>
            CRAN/E provides a Model Context Protocol (MCP) server that enables
            programmatic access to our comprehensive R package database. This
            MCP server allows AI assistants and other tools to directly query
            CRAN package information, author details, and perform searches with
            real-time data.
          </p>
          <p>The MCP server exposes three main resources and tools:</p>
          <ul className="ml-4 list-inside list-disc space-y-2">
            <li>
              <strong>Package Resource:</strong> Access detailed metadata for
              any CRAN package including dependencies, authors, download
              statistics, and release information
            </li>
            <li>
              <strong>Author Resource:</strong> Retrieve comprehensive author
              profiles with their associated packages and contributions
            </li>
            <li>
              <strong>Search Tools:</strong> Perform intelligent searches across
              packages, authors, or both with flexible querying options
            </li>
          </ul>
          <p>
            This integration makes CRAN/E&apos;s data seamlessly accessible to
            AI-powered development workflows, enabling smarter package
            discovery, automated dependency analysis, and enhanced R development
            experiences.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <ExternalLink href="https://modelcontextprotocol.io">
              <InfoPill variant="slate" label="Learn more">
                About MCP
                <RiExternalLinkLine size={16} className="text-gray-dim ml-2" />
              </InfoPill>
            </ExternalLink>
            <button
              type="button"
              onClick={handleCopyMcpUrl}
              className="hover:bg-slate-6 cursor-pointer rounded-full transition-colors"
            >
              <InfoPill variant="slate" label={<RiFileCopyLine size={16} />}>
                {copied ? "Copied!" : "Copy MCP URL"}
              </InfoPill>
            </button>
          </div>
        </PageContentSection>

        <Separator />

        <PageContentSection headline="Analytics" fragment="analytics">
          <p>
            CRAN/E uses{" "}
            <a
              href="https://plausible.io"
              target="_blank"
              rel="noopener noreferrer"
            >
              plausible.io
            </a>{" "}
            for a privacy-friendly, non-invasive way to collect some basic usage
            data of this PWA. This analytics service is hosted in the EU and
            doesn&apos;t collect any personal identifiable data. This is also
            the reason why you don&apos;t see a cookie-banner - we simply
            don&apos;t need consent for data we never collect in the first
            place. You can opt-out of those basic analytics by clicking the
            button below. Please note that we only collect anonymous core web
            vitals data and no personal identifiable data. This means that we
            can&apos;t identify you in any way. Your opt-out will be stored in
            your browser&apos;s local storage.
          </p>
          <div className="flex flex-wrap gap-4">
            <ExternalLink href="https://plausible.flaming.codes">
              <InfoPill
                label={<RiPieChart2Fill size={20} className="-ml-2" />}
                variant="slate"
              >
                Plausible
                <RiExternalLinkLine size={16} className="text-gray-dim ml-2" />
              </InfoPill>
            </ExternalLink>
            <Link viewTransition to="/privacy">
              <InfoPill label="Visit" variant="sand">
                Privacy policy
                <RiArrowRightSLine size={16} className="text-gray-dim ml-2" />
              </InfoPill>
            </Link>
            <PlausibleChoicePillButton />
          </div>
        </PageContentSection>

        <Separator />

        <PageContentSection headline="Security" fragment="security">
          <div className="flex flex-col gap-2">
            <a
              href="https://arcjet.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-1 w-32 shrink-0"
              aria-label="Visit Arcjet.com"
            >
              <ArcjetLogo className="w-full" />
              <span className="sr-only">Arcjet logo</span>
            </a>
            <div className="space-y-6">
              <p>
                We use{" "}
                <a
                  href="https://arcjet.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Arcjet
                </a>{" "}
                to protect our application from bots and malicious traffic.
                Arcjet provides advanced security features that help keep CRAN/E
                safe and performant for everyone.
              </p>
              <div className="flex flex-wrap gap-4">
                <ExternalLink href="https://arcjet.com">
                  <InfoPill
                    label={<ArcjetLogo className="h-5 w-5" />}
                    variant="slate"
                  >
                    Protected by Arcjet
                    <RiExternalLinkLine
                      size={16}
                      className="text-gray-dim ml-2"
                    />
                  </InfoPill>
                </ExternalLink>
              </div>
            </div>
          </div>
        </PageContentSection>

        <Separator />

        <PageContentSection headline="Source Code" fragment="source-code">
          <p>
            The source code for the CRAN/E frontend is available on Github as
            OSS (open source software). We believe in the power of open source
            and are happy to share our work with the community. For more details
            including the license, please visit the repository. If you want to
            contribute to the project, feel free to open a pull request or an
            issue on Github. We&apos;re always happy to hear from you! If you
            want to support us, you can do so by donating to our BuyMeACoffee.
          </p>

          <a href="https://www.digitalocean.com/?refcode=fd7f0da41296&utm_campaign=Referral_Invite&utm_medium=Referral_Program&utm_source=badge">
            <img
              src="https://web-platforms.sfo2.cdn.digitaloceanspaces.com/WWW/Badge%201.svg"
              alt="DigitalOcean Referral Badge"
            />
          </a>

          <div className="flex flex-wrap gap-4">
            <ExternalLink href="https://github.com/flaming-codes/crane-app">
              <InfoPill
                label={<RiGithubFill size={24} className="-ml-2" />}
                variant="slate"
              >
                Github
                <RiExternalLinkLine size={16} className="text-gray-dim ml-2" />
              </InfoPill>
            </ExternalLink>
            <ExternalLink href="https://buymeacoffee.com/v5728ggzwfI">
              <InfoPill variant="slate" label="Support us">
                Donate via BuyMeACoffee
                <RiExternalLinkLine size={16} className="text-gray-dim ml-2" />
              </InfoPill>
            </ExternalLink>
          </div>
        </PageContentSection>

        <Separator />
        <PageContentSection headline="Licenses" fragment="licenses">
          <p>
            The following list contains all package dependencies of external
            code used by CRAN/E. Click each link to visit the respective source
            code page.
          </p>
          <LicenseTable />
        </PageContentSection>
      </PageContent>
    </>
  );
}
