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

function prepareDirectories(source: Array<string[]>) {
  if (fs.existsSync(base)) {
    fs.rmSync(base, { recursive: true });
  }

  source.forEach((fragments) => {
    const dir = path.join(...fragments.slice(0, -1));
    fs.mkdirSync(dir, { recursive: true });
  });
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

function composeFakeUsersByFollowersItems(params: { count: number }) {
  const { count } = params;

  const items = Array.from({ length: count }).map((_, index) => {
    const name = faker.word.adjective(50);
    const login = name.toLowerCase();
    const avatar_url = faker.image.abstract();

    return {
      original: {
        id: index + 100,
        name,
        bio: faker.lorem.sentence(10),
        login,
        avatar_url,
        html_url: `https://github.com/${login}`,
        followers: Number(faker.random.numeric(3)),
        following: Number(faker.random.numeric(2)),
        public_repos: Number(faker.random.numeric(2))
      },
      trend: {
        followers: Number(faker.random.numeric(2))
      }
    };
  });

  return items.sort((a, b) => b.trend.followers - a.trend.followers);
}

function composeConfigs(params: { count: number }) {
  const { count } = params;

  const res = ranges.map((range) => [
    [
      [base, 'github', 'trends', 'repos-by-stars', `${range}.json`],
      composeFakeReposByStarsItems({ count })
    ],
    [
      [base, 'github', 'trends', 'users-by-followers', `${range}.json`],
      composeFakeUsersByFollowersItems({ count })
    ]
  ]);

  return res.flat() as Array<[string[], unknown[]]>;
}

/**
 * Sequence of actions to execute.
 */
function run() {
  const { count } = getArgv();
  const configs = composeConfigs({ count });
  const itemPaths = configs.map((tuples) => tuples[0]);

  prepareDirectories(itemPaths);
  persist(configs);
}

run();
