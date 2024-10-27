import { json, MetaFunction } from "@remix-run/react";
import { Anchors, AnchorLink } from "../modules/anchors";
import { PageContent } from "../modules/page-content";
import { PageContentSection } from "../modules/page-content-section";
import { Separator } from "../modules/separator";

const anchors = ["General", "Plausible"];

export const handle = {
  hasFooter: true,
};

export const meta: MetaFunction = () => {
  return [
    { title: "Privacy | CRAN/E" },
    { name: "description", content: "How privacy is handled to CRAN/E" },
  ];
};

export function loader() {
  return json({});
}

export default function PrivacyPage() {
  return (
    <>
      <Anchors>
        {anchors.map((anchor) => (
          <AnchorLink key={anchor} fragment={anchor.toLowerCase()}>
            {anchor}
          </AnchorLink>
        ))}
      </Anchors>
      <PageContent>
        <h1 className="text-3xl">Privacy</h1>

        <PageContentSection headline="General" fragment="general">
          CRAN/E is a modern PWA (Progressive Web App) that serves as a search
          engine and information display for packages hosted on CRAN. CRAN/E
          means The Comprehensive R Archive Network, Enhanced. None of our
          provided services host any of the packages. The only mission of this
          application is to make R-packages hosted on CRAN easier to find and
          better to read. CRAN/E services only store metadata associated to the
          packages for the purpose of searching and displaying information.
        </PageContentSection>

        <Separator />

        <PageContentSection headline="Plausible" fragment="plausible">
          CRAN/E uses plausible.io for a privacy-friendly, non-invasive way to
          collect some basic usage data of this PWA. This analytics service is
          hosted in the EU and doesn&apos;t collect any personal identifiable
          data. This is also the reason why you don&apos;t see a cookie-banner -
          we simply don&apos;t need consent for data we never collect in the
          first place. You can opt-out of those basic analytics by clicking the
          button below. Please note that we only collect anonymous core web
          vitals data and no personal identifiable data. This means that we
          can&apos;t identify you in any way. Your opt-out will be stored in
          your browser&apos;s local storage.
        </PageContentSection>
      </PageContent>
    </>
  );
}
