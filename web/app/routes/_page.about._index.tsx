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
} from "@remixicon/react";
import { Header } from "../modules/header";
import { PlausibleChoicePillButton } from "../modules/plausible";
import { mergeMeta } from "../modules/meta";
import { LicenseTable } from "../modules/licenses";

const anchors = ["Mission", "Team", "Analytics", "Source Code", "Licenses"];

export const meta = mergeMeta(() => {
  return [
    { title: "About | CRAN/E" },
    { name: "description", content: "About the creators of CRAN/E" },
  ];
});

export default function PrivacyPage() {
  return (
    <>
      <Header
        gradient="sand"
        headline="About"
        subline="Learn more about the creators of CRAN/E"
      />

      <Anchors>
        {anchors.map((anchor) => (
          <AnchorLink key={anchor} fragment={anchor.toLowerCase()}>
            {anchor}
          </AnchorLink>
        ))}
      </Anchors>

      <PageContent>
        <PageContentSection headline="Mission" fragment="mission">
          <p>
            CRAN/E is a modern PWA (Progressive Web App) that serves as a search
            engine and information display for packages hosted on CRAN. CRAN/E
            means The Comprehensive R Archive Network, Enhanced. None of our
            provided services host any of the packages. The only mission of this
            application is to make R-packages hosted on CRAN easier to find and
            better to read. CRAN/E services only store metadata associated to
            the packages for the purpose of searching and displaying
            information.
          </p>
        </PageContentSection>

        <Separator />

        <PageContentSection headline="Team" fragment="team">
          <div className="flex gap-6 md:justify-center md:gap-16">
            {["Lukas", "Tom"].map((name) => (
              <figure
                key={name}
                className="text-gray-dim space-y-2 text-center text-sm"
              >
                <img
                  src={`/images/we/${name.toLowerCase()}.webp`}
                  alt={`A portrait of ${name}`}
                  className="aspect-square w-20 rounded-full hover:animate-wiggle hover:animate-infinite"
                />
                <figcaption>{name}</figcaption>
              </figure>
            ))}
          </div>
          <p>
            Our names are Lukas and Tom and we&apos;re two developers from
            Austria. Our passion for coding (the one in R, the other in
            TypeScript) led us to the discovery of the original CRAN-site.
            Seeing the desperate visual state the site was in, we decided to
            give it a facelift. We&apos;re not affiliated with CRAN or RStudio
            in any way. CRAN/E is the culmination of our efforts to make the
            site more modern and user-friendly and we hope you enjoy it as much
            as we do! Our main focus was ease of use and accessibility,
            especially for lightning fast searches.
          </p>
          <div className="flex flex-wrap gap-4">
            <ExternalLink href="https://www.linkedin.com/in/lukas-schönmann-70781a215/">
              <InfoPill variant="slate" label={<RiLinkedinFill size={16} />}>
                Lukas&apos; LinkedIn
                <RiExternalLinkLine size={16} className="text-gray-dim ml-2" />
              </InfoPill>
            </ExternalLink>
            <ExternalLink href="https://www.linkedin.com/in/tom-schönmann-487b97164/">
              <InfoPill variant="slate" label={<RiLinkedinFill size={16} />}>
                Tom&apos;s LinkedIn
                <RiExternalLinkLine size={16} className="text-gray-dim ml-2" />
              </InfoPill>
            </ExternalLink>
          </div>
        </PageContentSection>

        <Separator />

        <PageContentSection headline="Analytics" fragment="analytics">
          <p>
            CRAN/E uses plausible.io for a privacy-friendly, non-invasive way to
            collect some basic usage data of this PWA. This analytics service is
            hosted in the EU and doesn&apos;t collect any personal identifiable
            data. This is also the reason why you don&apos;t see a cookie-banner
            - we simply don&apos;t need consent for data we never collect in the
            first place. You can opt-out of those basic analytics by clicking
            the button below. Please note that we only collect anonymous core
            web vitals data and no personal identifiable data. This means that
            we can&apos;t identify you in any way. Your opt-out will be stored
            in your browser&apos;s local storage.
          </p>
          <div className="flex flex-wrap gap-4">
            <ExternalLink href="https://plausible.io">
              <InfoPill
                label={<RiPieChart2Fill size={20} className="-ml-2" />}
                variant="slate"
              >
                Plausible
                <RiExternalLinkLine size={16} className="text-gray-dim ml-2" />
              </InfoPill>
            </ExternalLink>
            <Link to="/privacy">
              <InfoPill label="Visit" variant="sand">
                Privacy policy
                <RiArrowRightSLine size={16} className="text-gray-dim ml-2" />
              </InfoPill>
            </Link>
            <PlausibleChoicePillButton />
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
