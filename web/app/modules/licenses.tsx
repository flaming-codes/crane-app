import { clsx } from "clsx";
import licenses from "../licenses.json";
import { RiExternalLinkLine } from "@remixicon/react";

const columns = [
  "Name",
  "License Period",
  "License Type",
  "Version Info",
] as const;

export function LicenseTable() {
  const handleRowClick = (link: string) => {
    if (link) {
      const clean = link
        .replace(/\/$/, "")
        .replace("git+", "")
        .replace("ssh://git@", "https://");
      window.open(clean, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="overflow-x-auto">
      <table
        className="min-w-full border-collapse"
        role="table"
        aria-label="License Information Table"
      >
        <thead>
          <tr className="text-gray-normal bg-sand-ui">
            {columns.map((column, index) => (
              <th
                key={index}
                scope="col"
                className={clsx(
                  "whitespace-nowrap py-3 pr-6 text-left text-sm",
                  "overflow-hidden first:rounded-s-lg first:pl-2 last:rounded-e-lg last:pr-2",
                )}
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {licenses.map((license, index) => {
            const values = [
              <span key="name" className="flex items-center gap-2">
                {license.name}
                {license.link && (
                  <a
                    href={license.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    tabIndex={-1}
                    aria-label={`More information about ${license.name}`}
                  >
                    <RiExternalLinkLine
                      className="text-gray-dim inline-block opacity-0 transition-opacity group-hover/item:opacity-100"
                      size={16}
                    />
                  </a>
                )}
              </span>,
              license.licensePeriod,
              license.licenseType,
              <span
                key="versions"
                className="flex flex-col gap-1 font-mono leading-none"
              >
                {license.remoteVersion === license.installedVersion ? (
                  license.remoteVersion
                ) : (
                  <>
                    <span>Remote: {license.remoteVersion}</span>
                    <span>Installed: {license.installedVersion}</span>
                  </>
                )}
              </span>,
            ];

            return (
              <tr
                key={index}
                className={clsx(
                  "group/item transition-colors hover:bg-gray-2 dark:hover:bg-gray-12/40",
                  {
                    "cursor-pointer": Boolean(license.link),
                  },
                )}
                tabIndex={0} // Allows the row to be focusable
                onClick={() => handleRowClick(license.link)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && license.link) {
                    handleRowClick(license.link);
                  }
                }}
                role="row"
                aria-label={`Row for ${license.name}`}
              >
                {values.map((value, index) => (
                  <td
                    key={index}
                    className={clsx(
                      "whitespace-nowrap py-2 pl-2 pr-4 text-xs",
                      "first:rounded-s-lg last:rounded-e-lg",
                    )}
                    // eslint-disable-next-line jsx-a11y/no-interactive-element-to-noninteractive-role
                    role="cell"
                  >
                    {value}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
