import { Link } from "react-router";
import { Anchors, AnchorLink } from "../modules/anchors";
import { PageContent } from "../modules/page-content";
import { PageContentSection } from "../modules/page-content-section";
import { Separator } from "../modules/separator";
import { Header } from "../modules/header";
import { PlausibleChoicePillButton } from "../modules/plausible";
import {
  RiPieChart2Fill,
  RiExternalLinkLine,
  RiArrowRightSLine,
} from "@remixicon/react";
import { ExternalLink } from "../modules/external-link";
import { InfoPill } from "../modules/info-pill";
import { mergeMeta } from "../modules/meta";

const anchors = ["General", "Plausible"];

export const handle = {
  hasFooter: true,
};

export const meta = mergeMeta(() => {
  return [
    { title: "Privacy | CRAN/E" },
    { name: "description", content: "How privacy is handled to CRAN/E" },
  ];
});

export default function PrivacyPage() {
  return (
    <>
      <Header
        gradient="sand"
        headline="Privacy"
        subline="Learn more about how privacy is handled to CRAN/E"
      />

      <Anchors anchorIds={anchors.map((item) => item.toLowerCase())}>
        {anchors.map((anchor) => (
          <AnchorLink key={anchor} fragment={anchor.toLowerCase()}>
            {anchor}
          </AnchorLink>
        ))}
      </Anchors>

      <PageContent>
        <PageContentSection headline="General" fragment="general">
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

        <PageContentSection headline="Plausible" fragment="plausible">
          <p>
            CRAN/E uses plausible.flaming.codes for a privacy-friendly,
            non-invasive way to collect some basic usage data of this PWA. This
            analytics service is hosted in the EU and doesn&apos;t collect any
            personal identifiable data. This is also the reason why you
            don&apos;t see a cookie-banner - we simply don&apos;t need consent
            for data we never collect in the first place. You can opt-out of
            those basic analytics by clicking the button below. Please note that
            we only collect anonymous core web vitals data and no personal
            identifiable data. This means that we can&apos;t identify you in any
            way. Your opt-out will be stored in your browser&apos;s local
            storage.
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
      </PageContent>
    </>
  );
}
