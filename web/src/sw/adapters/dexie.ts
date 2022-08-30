import Dexie, { type Table } from 'dexie';
import type { DBAdapter, TAItem } from '../types';
import { fetchTypeAheadItems } from '../utils/net';

let shards: TypeAheadDb[] = [];

class TypeAheadDb extends Dexie {
  items!: Table<TAItem>;

  constructor(postfix: string | number) {
    super(`typeahead_${postfix}`);
    this.version(1).stores({
      // Primary key and indexed props.
      items: '++id, name'
    });
  }
}

async function initShards() {
  shards = Array.from(
    { length: min(navigator.hardwareConcurrency ?? 2, 4) },
    (_, i) => new TypeAheadDb(i)
  );

  // Get all suggestions and store them in the DBs.
  const items = await fetchTypeAheadItems();
  const groups: any[] = [];

  {
    let i = 0;
    while (items.length > 0) {
      const now = i % shards.length;
      groups[i % shards.length] = [...(groups[now] || []), items.shift()];
      i++;
    }
  }

  // Has to succeed.
  await Promise.all(shards.map((db, i) => db.items.bulkAdd(groups[i])));

  return shards;
}

async function deleteExistingShards() {
  // Clean up old databases. This is sound, as this function
  // is only called when the service worker is activated, which
  // happens only after the initial installation or an update.
  await Promise.allSettled(
    shards.map(async (db) => {
      await db.items.clear();
    })
  );

  shards = [];
}

function min(a: number, b: number) {
  return a < b ? a : b;
}

/**
 *
 * @param options
 */
async function initIfNeeded(options?: { deleteExisting?: boolean }) {
  const [shard] = shards;
  let count = 0;

  if (shard) {
    count = await shard.items.count();

    if (count && options?.deleteExisting) {
      await deleteExistingShards();
    }
  }

  if (count <= 0 || !shard) {
    shards = await initShards();
  }
}

/**
 *
 * @param q
 * @returns
 */
async function query(q: string) {
  const hits = await Promise.all(
    shards.map((db) => db.items.where('name').startsWith(q).toArray())
  );

  return hits.flat();
}

/**
 *
 */
export const adapter: DBAdapter<TAItem> = {
  initIfNeeded,
  query
};
