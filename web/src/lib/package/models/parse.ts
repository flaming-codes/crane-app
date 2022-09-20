import type { SubGridMeta } from '$lib/blocks/types';
import { differenceInDays } from 'date-fns';
import type { Dependency, Pkg } from '../type';

/**
 *
 * @param p
 * @returns
 */
export function parseOverviewTuples(p: Pkg) {
  type Result = Array<[string, string, SubGridMeta | undefined]>;

  const diffInDays = differenceInDays(Date.now(), new Date(p.date));

  return [
    p.version && ['Version', p.version],
    p.depends?.find((d) => d.name === 'R') && ['R', p.depends.find((d) => d.name === 'R')?.version],
    p.date && [
      'Published',
      p.date,
      { text: diffInDays === 0 ? 'Today' : `${diffInDays} ${diffInDays > 1 ? 'days' : 'day'} ago` }
    ],
    p.needscompilation && ['Needs compilation?', p.needscompilation],
    ...(p.license?.map(
      (l) =>
        l.name && [
          'License',
          l.name.replace('file LICENSE', 'File'),
          { url: l.link, isExternal: true }
        ]
    ) || []),
    p.cran_checks && [
      'CRAN checks',
      p.cran_checks.label,
      { url: p.cran_checks.link, isExternal: true }
    ],
    p.language && ['Language', p.language],
    p.os_type && ['OS', p.os_type]
  ].filter(Boolean) as Result;
}

/**
 *
 * @param p
 * @returns
 */
export function parseContacts(p: Pkg) {
  if (p.contact) {
    return p.contact.names.map((name, i) => ({
      name,
      email: p.contact!.emails[i]
    }));
  }
}

/**
 *
 * @param p
 * @returns
 */
export function parseMaterials(p: Pkg): Pkg['materials'] {
  const getType = (m: NonNullable<Pkg['materials']>[number]) => {
    switch (m.name.toLowerCase()) {
      case 'citation':
        return 'citation';
      case 'license':
        return 'license';
      case 'changelog':
      case 'news':
        return 'changelog';
      case 'download':
        return 'download';

      default:
        return 'file';
    }
  };

  return [
    ...(p.materials?.map((m) => ({
      ...m,
      type: getType(m)
    })) || []),
    p.reference_manual && {
      name: 'Reference manual',
      link: p.reference_manual.link,
      type: 'file'
    },
    p.package_source && {
      name: 'Package source',
      link: p.package_source.link,
      type: 'download'
    }
  ].filter(Boolean) as Pkg['materials'];
}

/**
 *
 * @param p
 */
export function parseAboutItems(p: Pkg) {
  const next = [];

  if (p.citation) {
    next.push(['Citation', p.citation.label, { url: p.citation.link, isExternal: true }]);
  }
  if (p.link) {
    const texts = p.link.text.split(',').map((t) => t.trim());
    p.link.links.forEach((url, i) => {
      next.push([
        texts[i] || p.link?.text,
        '',
        {
          url,
          isExternal: true,
          icon: url.startsWith('https://github.com') ? 'carbon:logo-github' : undefined
        }
      ]);
    });
  }
  if (p.copyright) {
    next.push(['Copyright', p.copyright.text, { url: p.copyright.link, isExternal: true }]);
  }
  if (p.priority) {
    next.push(['Priority', p.priority]);
  }
  if (p.mailinglist) {
    next.push(['Mailing list', p.mailinglist, { url: p.mailinglist, isExternal: true }]);
  }
  if (p.systemreqs) {
    next.push(['System requirements', p.systemreqs, undefined]);
  }
  if (p.bugreports) {
    let bugReportMeta: Partial<SubGridMeta> = {};
    if (p.bugreports) {
      if (p.bugreports.startsWith('mailto:')) {
        bugReportMeta = { mail: p.bugreports };
      } else {
        bugReportMeta = { url: p.bugreports, isExternal: true };
      }
    }
    next.push(['Bug report', 'File report', bugReportMeta]);
  }

  return next as [string, string, SubGridMeta | undefined][];
}

/**
 *
 * @param p
 * @returns
 */
export function parseMaintainer(p: Pkg) {
  return (
    p.maintainer &&
    (['Maintainer', p.maintainer.name, { mail: p.maintainer.email }] as [
      string,
      string,
      SubGridMeta | undefined
    ])
  );
}

/**
 *
 * @param items
 * @returns
 */
export function parseDependencies(items: Dependency[]) {
  return items.map((item) => {
    const next = { ...item };
    if (item.link) {
      next.link = item.link
        ?.replace('https://cran.r-project.org/web/packages/', '/package/')
        .replace('/index.html', '');
    }
    return next;
  });
}

export function parseMacOsBinaries(pkg: Pkg): Pkg['macos_binaries'] {
  return pkg.macos_binaries?.map((m) => {
    const [name, cpu] = m.label.trim().split(' ');
    return {
      ...m,
      label: name.trim(),
      meta: cpu?.replace(':', '').replace('(', '').replace(')', '')
    };
  });
}

export function parseWindowsBinaries(pkg: Pkg): Pkg['windows_binaries'] {
  return pkg.windows_binaries?.map((m) => {
    return {
      ...m,
      label: m.label.trim().replace(':', ''),
      // Windows-packages only support 'x86_64' on CRAN.
      meta: 'x86_64'
    };
  });
}
