import fs from 'node:fs';
import path from 'node:path';
import { faker } from '@faker-js/faker';

function initPackages(length) {
  return Array.from({ length }, (_, i) => ({
    id: faker.word.interjection(50) + '-' + faker.word.interjection(50) + '-' + i,
    title: faker.lorem.sentence(6),
    lastUpdate: 1658957301903,
    version: [0, 1, i],
    maintainerName: faker.name.firstName() + ' ' + faker.name.lastName(),
    maintainerEmail: faker.internet.email(),
    license: 'GPL-3'
  }));
}

console.log('Generating fake data...');

const rawData = initPackages(20_000);

const handlers = [
  {
    name: 'db.json',
    mapper: (item) => item,
    filter: () => true
  },
  {
    name: 'db-ta.json',
    mapper: ({ id }) => [id.toLowerCase(), id],
    filter: ({ id }, i, acc) => acc.findIndex((item) => item.id === id) === i
  },
  {
    name: 'db-lp.json',
    mapper: ({ id, title, version }) => ({ id, title, version }),
    filter: () => true
  }
];

handlers.forEach(({ name, mapper, filter }) => {
  const file = path.join(process.cwd(), 'data', name);

  try {
    fs.unlinkSync(file);
  } catch (error) {
    console.warn('no existing file to delete');
  }

  fs.writeFileSync(file, JSON.stringify(rawData.filter(filter).map(mapper)), 'utf8');
});

console.log('Fake DB generated');
