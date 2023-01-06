/* eslint-disable @typescript-eslint/ban-ts-comment */

import { faker } from '@faker-js/faker';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
// @ts-ignore
import fs from 'node:fs';
// @ts-ignore
import path from 'node:path';

// @ts-ignore Issue w/ node types.
const cwd = process.cwd();
const base = path.join(cwd, 'static', 'data', 'stats');
const ranges = ['1h', '6h', '12h', '24h', '48h', '72h', '1w', '2w', '1m'];

/**
 * Simple parser for CLI arguments.
 * @returns
 */
function getArgv() {
  // @ts-ignore Issue w/ node types.
  const args: string[] = process.argv;
  return yargs(hideBin(args)).argv as unknown as { count: number };
}

function persist(data: Array<[pathFragments: string[], items: unknown[]]>) {
  for (const [pathFragments, items] of data) {
    fs.writeFileSync(path.join(...pathFragments), JSON.stringify(items, null, 2));
  }
}

function composeFakeReposByStarsItems(params: { count: number }) {
  const { count } = params;

  const items = Array.from({ length: count }).map((_, index) => {
    const name = faker.word.adjective(50);
    const author = faker.word.adjective(50);
    const stargazers_count = Number(faker.random.numeric(4));
    const watchers = Number(faker.random.numeric(4));
    const avatar_url = faker.image.abstract();

    return {
      original: {
        id: index + 100,
        name,
        full_name: author + '/' + name,
        html_url: `https://github.com/${author}/${name}`,
        description: faker.lorem.sentence(10),
        stargazers_count,
        watchers,
        owner: {
          login: author,
          avatar_url
        }
      },
      trend: {
        stargazers_count: Number(faker.random.numeric(2))
      }
    };
  });

  return items.sort((a, b) => b.trend.stargazers_count - a.trend.stargazers_count);
}

function prepareDirectories(source: Array<string[]>) {
  if (fs.existsSync(base)) {
    fs.rmSync(base, { recursive: true });
  }

  source.forEach((fragments) => {
    const dir = path.join(...fragments.slice(0, -1));
    fs.mkdirSync(dir, { recursive: true });
  });
}

function composeConfigs(params: { count: number }): Array<[pathFragments: string[], items: any[]]> {
  const { count } = params;

  return ranges.map((range) => [
    [base, 'github', 'trends', 'repos-by-stars', `${range}.json`],
    composeFakeReposByStarsItems({ count })
  ]);
}

/**
 * Sequence of actions to execute.
 */
function run() {
  const { count } = getArgv();
  const configs = composeConfigs({ count });

  prepareDirectories(configs.map(([fragments]) => fragments));
  persist(configs);
}

run();
