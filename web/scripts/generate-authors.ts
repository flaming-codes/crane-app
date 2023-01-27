/* eslint-disable @typescript-eslint/ban-ts-comment */

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { faker } from '@faker-js/faker';
// @ts-ignore
import fs from 'node:fs';
// @ts-ignore
import path from 'node:path';

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
 * Generates a set of packages.
 */
function composeFakeAuthorsPackagesMap(): Record<string, string[]> {
  const { count } = getArgv();
  const tuples: Array<[string, string[]]> = Array.from({ length: count }, (_, i) => [
    faker.name.fullName(),
    Array.from({ length: Math.floor(Math.random() * 5) + 1 }, () => faker.lorem.word())
  ]);

  return tuples.reduce((acc, [name, pkgs]) => {
    acc[name] = pkgs;
    return acc;
  }, {} as Record<string, string[]>);
}

function composeAndPersistVariants() {
  // @ts-ignore Issue w/ node types.
  const cwd = process.cwd();

  const handlers = [
    {
      name: 'db-ap.json',
      data: composeFakeAuthorsPackagesMap()
    }
  ];

  handlers.forEach(({ name, data }) => {
    const file = path.join(cwd, 'static', 'data', name);

    try {
      fs.unlinkSync(file);
    } catch (error) {
      // Do nothing.
    }

    fs.writeFileSync(file, JSON.stringify(data), 'utf8');
  });
}

/**
 * Sequence of actions to execute.
 */
function run() {
  composeAndPersistVariants();
}

run();
