import { RiExternalLinkLine } from "@remixicon/react";
import { ExternalLink } from "./external-link";
import { InfoPill } from "./info-pill";

export interface AboutCreatorLink {
  href: string;
  copy: string;
  icon: React.ReactNode;
}

export interface AboutCreatorCardProps {
  name: string;
  portrait: string;
  tagline: string;
  bio: string[];
  focusAreas: string[];
  links: AboutCreatorLink[];
}

/** Card component for displaying creator information on the About page. */
export function AboutCreatorCard({
  name,
  portrait,
  tagline,
  bio,
  focusAreas,
  links,
}: AboutCreatorCardProps) {
  return (
    <article className="group border-gray-6/30 dark:border-gray-1/20 dark:bg-gray-12/40 overflow-hidden rounded-3xl border bg-white/80 shadow-[0_35px_120px_-60px_rgba(15,23,42,0.9)] backdrop-blur-xl">
      <div className="relative h-90 w-full overflow-hidden lg:h-105">
        <img
          src={portrait}
          alt={`Portrait of ${name}`}
          className="size-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="from-gray-12/80 via-gray-12/20 dark:from-gray-12/80 pointer-events-none absolute inset-0 bg-linear-to-t to-transparent" />
        <div className="dark:bg-gray-12/60 border-gray-6/40 dark:border-gray-1/40 absolute inset-x-0 bottom-0 flex flex-col gap-1 border-t bg-white/5 px-8 pt-5 pb-5 text-white backdrop-blur-md">
          <p className="text-2xl leading-tight font-semibold">{name}</p>
        </div>
      </div>

      <div className="flex flex-col gap-6 p-8">
        <p className="text-gray-normal text-lg leading-relaxed">{tagline}</p>
        <div className="text-gray-normal space-y-4 text-base leading-relaxed">
          {bio.map((paragraph, index) => (
            <p key={`${name}-bio-${index}`}>{paragraph}</p>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          {focusAreas.map((focus) => (
            <span
              key={`${name}-${focus}`}
              className="border-gray-6/40 text-gray-dim dark:border-gray-1/40 dark:bg-gray-12/20 dark:text-gray-3 rounded-full border bg-white/60 px-4 py-1 text-xs tracking-[0.2em] uppercase"
            >
              {focus}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          {links.map((link) => (
            <ExternalLink key={link.href} href={link.href}>
              <InfoPill variant="sand" label={link.icon}>
                {link.copy}
                <RiExternalLinkLine size={16} className="text-gray-dim ml-2" />
              </InfoPill>
            </ExternalLink>
          ))}
        </div>
      </div>
    </article>
  );
}
