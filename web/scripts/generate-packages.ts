/* eslint-disable @typescript-eslint/ban-ts-comment */

import type { Pkg } from '../src/lib/package/type';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { faker } from '@faker-js/faker';
// @ts-ignore
import fs from 'node:fs';
// @ts-ignore
import path from 'node:path';

/**
 *
 * @param {*} s
 * @returns
 */
function composeSlug(s: string) {
  return encodeURIComponent(s);
}

/**
 * Simple parser for CLI arguments.
 * @returns
 */
function getArgv() {
  // @ts-ignore Issue w/ node types.
  const args: string[] = process.argv;
  return yargs(hideBin(args)).argv as unknown as { count: number };
}

/**
 * Generate the data for a single fake package.
 * @param i
 * @returns
 */
function composeFakePackage(i: number): Pkg {
  const id = `${faker.word.adjective(50)}-${faker.word.conjunction(100)}-${i}`;
  const date = faker.date.past().toISOString().slice(0, 10);

  return {
    id,
    slug: composeSlug(id),
    url: 'https://cran.r-project.org/web/packages/' + id,
    name: id,
    title: faker.lorem.sentence(10),
    description: faker.lorem.paragraph(10),
    version: faker.random.numeric() + '.' + faker.random.numeric() + '.' + faker.random.numeric(),
    date,
    createdAt: new Date(date).getTime(),
    maintainer: {
      name: faker.name.fullName(),
      email: faker.internet.email()
    },
    link: [
      {
        text: 'Homepage',
        link: 'https://cran.r-project.org/web/packages/' + id
      },
      {
        text: 'CRAN',
        link: 'https://cran.r-project.org/web/packages/' + id
      }
    ],
    bugreports: 'https://cran.r-project.org/web/packages/' + id + '/bugs',
    needscompilation: 'yes',
    cran_checks: {
      label: 'CRAN checks',
      link: 'https://cran.r-project.org/web/packages/' + id + '/CRAN_checks'
    },
    language: 'R',
    inviews: [
      {
        name: 'RStudio',
        link: 'https://www.rstudio.com/products/rstudio/'
      },
      {
        name: 'RStudio',
        link: 'https://www.rstudio.com/products/rstudio/'
      }
    ],
    systemreqs: ['R version >= 3.5.0', 'Rcpp version >= 1.0.0'],
    materials: [
      {
        name: 'RStudio',
        link: 'https://www.rstudio.com/products/rstudio/',
        type: 'RStudio'
      },
      {
        name: 'RStudio',
        link: 'https://www.rstudio.com/products/rstudio/',
        type: 'RStudio'
      }
    ],
    citation: {
      label: 'Citation',
      link: [
        'https://cran.r-project.org/web/packages/' + id + '/manuals',
        'https://cran.r-project.org/web/packages/' + id + '/manuals'
      ]
    },
    contact: {
      names: [faker.name.fullName()],
      emails: [faker.internet.email()]
    },
    copyright: {
      text: 'RStudio',
      link: 'https://www.rstudio.com/products/rstudio/'
    },
    priority: 'low',
    additional_repositories: [
      {
        name: 'RStudio',
        link: 'https://www.rstudio.com/products/rstudio/'
      },
      {
        name: 'RStudio',
        link: 'https://www.rstudio.com/products/rstudio/'
      }
    ],
    author: [
      {
        name: faker.name.fullName(),
        roles: ['cre']
      },
      {
        name: faker.name.fullName(),
        roles: ['cre', 'dre']
      }
    ],
    license: [
      {
        name: 'Fake License',
        link: 'https://www.rstudio.com/products/rstudio/'
      }
    ],
    reference_manual: {
      label: 'Reference Manual',
      link: 'https://cran.r-project.org/web/packages/' + id + '/manuals'
    },
    package_source: {
      label: 'Source',
      link: 'https://cran.r-project.org/web/packages/' + id + '/src'
    },
    windows_binaries: [
      {
        label: 'Windows binaries',
        link: 'https://cran.r-project.org/web/packages/' + id + '/windows'
      }
    ],
    macos_binaries: [
      {
        label: 'MacOS binaries',
        link: 'https://cran.r-project.org/web/packages/' + id + '/macos',
        meta: 'arm64'
      }
    ],
    last_scraped: new Date().toISOString(),
    lastScrapedAt: new Date().getTime(),
    imports: [
      {
        name: 'RStudio',
        link: 'https://www.rstudio.com/products/rstudio/'
      }
    ],
    suggests: [
      {
        name: 'RStudio',
        link: 'https://www.rstudio.com/products/rstudio/'
      }
    ]
  };
}

/**
 * Generates a set of packages.
 */
function composeFakePackages(): Pkg[] {
  const { count } = getArgv();
  return Array.from({ length: count }, (_, i) => composeFakePackage(i));
}

/**
 * Store the packages each in a JSON file in the app's static dir.
 */
function persistFakePackages(packages: Pkg[]) {
  // @ts-ignore Issue w/ node types.
  const cwd = process.cwd();

  const base = path.join(cwd, 'static', 'data');
  if (!fs.existsSync(base)) fs.mkdirSync(base);

  const baseData = path.join(base, 'packages');
  if (!fs.existsSync(baseData)) fs.mkdirSync(baseData);

  packages.forEach((pkg) => {
    const file = path.join(baseData, pkg.slug + '.json');

    try {
      fs.unlinkSync(file);
    } catch (error) {
      // Do nothing.
    }

    fs.writeFileSync(file, JSON.stringify(pkg), 'utf8');
  });
}

/**
 * Generate DB-variants for Typeahead, overview, etc.
 */
function composeAndPersistVariants(packages: Pkg[]) {
  const handlers: Array<{
    name: string;
    mapper: (pkg: Pkg) => unknown | unknown[];
    filter: (pkg: Pkg, i: number, acc: Pkg[]) => boolean;
  }> = [
    {
      name: 'db-sm.json',
      mapper: ({ slug, date }) => [slug, date],
      filter: ({ name }, i, acc) => acc.findIndex((item) => item.name === name) === i
    },
    {
      name: 'db-ta.json',
      mapper: ({ name, slug }) => [name.toLowerCase(), slug],
      filter: ({ name }, i, acc) => acc.findIndex((item) => item.name === name) === i
    },
    {
      name: 'db-ta.test.json',
      mapper: ({ name, slug }) => [name.toLowerCase(), slug],
      filter: ({ name }, i, acc) => i < 20 && acc.findIndex((item) => item.name === name) === i
    },
    {
      name: 'db-lp.json',
      mapper: ({ name, title, version, slug }) => ({
        id: name,
        name,
        title,
        version,
        slug
      }),
      filter: () => true
    }
  ];

  // @ts-ignore Issue w/ node types.
  const cwd = process.cwd();

  handlers.forEach(({ name, mapper, filter }) => {
    const file = path.join(cwd, 'static', 'data', name);

    try {
      fs.unlinkSync(file);
    } catch (error) {
      // Do nothing.
    }

    fs.writeFileSync(file, JSON.stringify(packages.filter(filter).map(mapper)), 'utf8');
  });
}

/**
 * Delete the existing fake packages in 'static/data'.
 */
function wipeExisting() {
  // @ts-ignore Issue w/ node types.
  const cwd = process.cwd();
  const dir = path.join(cwd, 'static', 'data');

  fs.rmdirSync(dir, { recursive: true });
}

/**
 * Sequence of actions to execute.
 */
function run() {
  const packages = composeFakePackages();

  wipeExisting();

  persistFakePackages(packages);
  composeAndPersistVariants(packages);
}

run();
