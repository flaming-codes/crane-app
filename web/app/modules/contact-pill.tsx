import {
  RiArrowRightSLine,
  RiExternalLinkLine,
  RiUserFill,
  RiVipCrown2Fill,
} from "@remixicon/react";
import clsx from "clsx";
import { InfoPill } from "./info-pill";
import { Link } from "@remix-run/react";
import { z } from "zod";

type Props = {
  className?: string;
  isMaintainer?: boolean;
  /**
   * aut - Author (Full authors who have made substantial contributions to the package and should show up in the package citation.)
   * cre - Creator (Package maintainer)
   * com - Compiler (Persons who collected code (potentially in other languages) but did not make further substantial contributions to the package)
   * ctb - Contributor (Authors who have made smaller contributions (such as code patches etc.) but should not show up in the package citation.
   * cph - Copyright holder
   * rev - Reviewer (Persons who have reviewed the package as part of the review process)
   * ths - Thesis Advisor (Thesis advisor, if the package is part of a thesis)
   * trl - Translator (Translator to R, if the R code is a translation from another language (typically S))
   */
  roles: Array<Role | (string & {})>;
  name: string;
  link?: string;
};

// const whoDidWhatUrl = "https://journal.r-project.org/archive/2012-1/RJournal_2012-1_Hornik~et~al.pdf";

const emailSchema = z.string().email();

type Role = "aut" | "cre" | "ctb" | "rev" | "cph" | "com" | "ths" | "trl";

const readableRoles: Record<Role, string> = {
  aut: "Author",
  cre: "Maintainer",
  com: "Compiler",
  ctb: "Contributor",
  cph: "Copyright holder",
  rev: "Reviewer",
  ths: "Thesis advisor",
  trl: "Translator",
};

export function ContactPill(props: Props) {
  const { className, name, isMaintainer, roles, link } = props;

  const hasRoles = roles.length > 0;

  return (
    <div className={clsx("flex flex-col gap-4 sm:flex-row", className)}>
      <h3 className="shrink-0 text-lg">{name}</h3>
      <div className="flex flex-wrap gap-2">
        {isMaintainer ? (
          <InfoPill
            size="sm"
            label={
              <RiVipCrown2Fill
                size={16}
                className="text-gold-1 dark:text-gold-2"
              />
            }
            className="border-transparent text-gold-1 dark:bg-gold-12"
          >
            Maintainer
          </InfoPill>
        ) : null}
        <Link to={`/author/${name}`}>
          <InfoPill size="sm" label={<RiUserFill size={16} />} variant="jade">
            Show author details{" "}
            <RiArrowRightSLine size={16} className="text-gray-dim" />
          </InfoPill>
        </Link>
        {hasRoles ? (
          <InfoPill size="sm" label="Roles">
            {roles
              .map((role) => {
                const readableRole = readableRoles[role as Role];
                return readableRole ? readableRole : role;
              })
              .join(", ")}
          </InfoPill>
        ) : null}
        {link ? <ContactLinkPill link={link} /> : null}
      </div>
    </div>
  );
}

function ContactLinkPill(props: Required<Pick<Props, "link">>) {
  const { link } = props;

  const isEmail = emailSchema.safeParse(link).success;
  const isOrcID = !isEmail && link?.startsWith("https://orcid.org/");

  return (
    <a
      href={isEmail ? `mailto:${link}` : link}
      target={isOrcID ? "_blank" : undefined}
      rel={isOrcID ? "noreferrer" : undefined}
    >
      <InfoPill size="sm" label={isOrcID ? "ORCID" : "@"}>
        {link?.replace("https://orcid.org/", "")}
        {isOrcID ? (
          <RiExternalLinkLine size={12} className="text-gray-dim ml-1" />
        ) : null}
      </InfoPill>
    </a>
  );
}
