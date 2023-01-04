/* eslint-disable @typescript-eslint/ban-ts-comment */

// @ts-ignore
import fs from 'node:fs';
// @ts-ignore
import path from 'node:path';
import { faker } from '@faker-js/faker';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

// @ts-ignore Issue w/ node types.
const cwd = process.cwd();

/**
 * Simple parser for CLI arguments.
 * @returns
 */
function getArgv() {
  // @ts-ignore Issue w/ node types.
  const args: string[] = process.argv;
  return yargs(hideBin(args)).argv as unknown as { count: number };
}

/*
{
    "original": {
      "id": 8635720,
      "name": "rethinking",
      "full_name": "rmcelreath/rethinking",
      "html_url": "https://github.com/rmcelreath/rethinking",
      "description": "Statistical Rethinking course and book package",
      "stargazers_count": 1847,
      "watchers": 1847,
      "owner": {
        "login": "rmcelreath",
        "avatar_url": "https://avatars.githubusercontent.com/u/3230381?v=4"
      }
    },
    "trend": {
      "stargazers_count": 5
    }
  },
*/

function persist(data: Array<[pathFragments: string[], items: unknown[]]>) {
  for (const [pathFragments, items] of data) {
    fs.writeFileSync(path.join(pathFragments), JSON.stringify(items, null, 2));
  }
}

function composeFakeGithubTrendItems(params: { count: number }) {
  const { count } = params;

  const items = Array.from({ length: count }).map((_, index) => {
    const name = faker.word.adjective(50);
    const author = faker.word.adjective(50);
    const stargazers_count = faker.random.numeric(4);
    const watchers = Number(faker.random.numeric(4));
    const avatar_url = Number(faker.image.avatar());

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

/**
 * Delete the existing fake packages in 'static/data'.
 */
function prepareDirectories(source: Array<string[]>) {
  const base = path.join(cwd, 'static', 'stats');

  if (fs.existsSync(base)) {
    fs.rmSync(base, { recursive: true });
  }

  source.forEach((fragments) => {
    const dir = path.join(base, ...fragments.slice(0, -1));
    fs.mkdirSync(dir, { recursive: true });
  });
}

function composeConfigs(params: { count: number }): Array<[pathFragments: string[], items: any[]]> {
  const { count } = params;

  return [
    [['static', 'stats', 'github', 'trends', '6h.json'], composeFakeGithubTrendItems({ count })]
  ];
}

/**
 * Sequence of actions to execute.
 */
void function run() {
  const { count } = getArgv();
  const configs = composeConfigs({ count });

  prepareDirectories(configs.map(([fragments]) => fragments));
  persist(configs);
};
