import type { SubGridMeta } from '$lib/blocks/types';
import { differenceInDays } from 'date-fns';
import type { Pkg } from '../type';

/**
 *
 * @param p
 * @returns
 */
export function parseOverviewTuples(p: Pkg) {
  type Result = Array<[string, string, SubGridMeta | undefined]>;

  const diffInDays = differenceInDays(Date.now(), p.createdAt);

  let bugReportMeta: Partial<SubGridMeta> = {};
  if (p.bugreports) {
    if (p.bugreports.startsWith('mailto:')) {
      bugReportMeta = { mail: p.bugreports };
    } else {
      bugReportMeta = { url: p.bugreports, isExternal: true };
    }
  }

  return [
    p.version && ['Version', p.version],
    p.depends?.find((d) => d.name === 'R') && ['R', p.depends.find((d) => d.name === 'R')?.version],
    p.createdAt && ['Published', diffInDays > 0 ? `${diffInDays} days ago` : 'Today'],
    ...p.license.map((l) => l.name && ['License', l.name, { url: l.link, isExternal: true }]),
    p.needscompilation && [
      'Needs compilation?',
      p.needscompilation,
      { boolean: p.needscompilation === 'yes' }
    ],
    p.cran_checks && [
      'CRAN checks',
      p.cran_checks.label,
      { url: p.cran_checks.link, isExternal: true }
    ],
    p.language && ['Language', p.language],
    p.os_type && ['OS', p.os_type],
    p.bugreports && ['Bug report', 'File report', bugReportMeta]
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
  return [
    ...(p.materials || []),
    p.reference_manual && {
      name: 'Reference manual',
      link: p.reference_manual.link,
      type: 'file'
    },
    {
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

  if (p.link) {
    p.link?.forEach(({ text, link }) => {
      next.push([text, '', { url: link, isExternal: true }]);
    });
  }
  if (p.copyright) {
    next.push(['Copyright', p.copyright.text, { url: p.copyright.link, isExternal: true }]);
  }
  if (p.priority) {
    next.push(['Priority', p.priority]);
  }
  if (p.citation) {
    next.push(['Citation', p.citation.label, { url: p.citation.link, isExternal: true }]);
  }
  if (p.mailinglist) {
    next.push(['Mailing list', p.mailinglist, { url: p.mailinglist, isExternal: true }]);
  }
  /*
   * TODO: Check if string or object.
   * sparklyr.nested.json
  if (p.systemreqs) {
    p.systemreqs.forEach((s) => {
      const item: [string, string, SubGridMeta | undefined] = ['System requirements', s, undefined];
      next.push(item);
    });
    
  }
  */

  return next as [string, string, SubGridMeta | undefined][];
}

/**
 *
 * @param p
 * @returns
 */
export function parseMaintainer(p: Pkg) {
  return ['Maintainer', p.maintainer.name, { mail: p.maintainer.email }] as [
    string,
    string,
    SubGridMeta | undefined
  ];
}
