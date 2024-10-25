import { RiUserFill, RiVipCrown2Fill } from "@remixicon/react";
import clsx from "clsx";
import { InfoPill } from "./info-pill";
import { Link } from "@remix-run/react";

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
  email?: string;
};

const whoDidWhatUrl =
  "https://journal.r-project.org/archive/2012-1/RJournal_2012-1_Hornik~et~al.pdf";

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

const readableRolesList = Object.entries(readableRoles) as [Role, string][];

export function ContactPill(props: Props) {
  const { className, name, isMaintainer, roles, email } = props;

  const hasRoles = roles.length > 0;

  return (
    <div className={clsx("flex flex-col sm:flex-row gap-3", className)}>
      <h4 className="text-lg">{name}</h4>
      <div className="flex gap-2 flex-wrap">
        {isMaintainer ? (
          <InfoPill
            size="sm"
            label={
              <RiVipCrown2Fill
                size={16}
                className="text-gold-1 dark:text-gold-2"
              />
            }
            className="bg-gold-10 dark:bg-gold-11 text-gold-1 dark:text-gold-2 border-transparent"
          >
            Maintainer
          </InfoPill>
        ) : null}
        <Link to={`/author/${name}`}>
          <InfoPill
            size="sm"
            label={<RiUserFill size={16} />}
            className="bg-gray-ui border-transparent"
          >
            Show author details
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
        {email ? (
          <a href={`mailto:${email}`}>
            <InfoPill size="sm" label="Email">
              {email}
            </InfoPill>
          </a>
        ) : null}
      </div>
    </div>
  );
}
