import type { DBAdapter, TAItem } from '../types';
import type { IDBPDatabase } from 'idb';
import { openDB } from 'idb';
import IndexedStorage from '@lokidb/indexed-storage';
import Loki, { Collection } from '@lokidb/loki';
import { fetchTypeAheadItems } from '../utils/net';

let db: IDBPDatabase<unknown>;
let loki: Loki | undefined;
let collection: Collection<TAItem> | undefined;

/**
 *
 */
async function open() {
  db = await openDB('idb-store', 1, {
    upgrade(db) {
      db.createObjectStore('idbs', {
        keyPath: 'id'
      });
    }
  });
}

/**
 *
 * @param options
 */
const initIfNeeded = async (options?: { deleteExisting?: boolean }) => {
  if (!db) {
    await open();
  }

  let count = await db.count('idbs');
  let all: TAItem[] = [];

  if (count > 0 && options?.deleteExisting) {
    await db.clear('idbs');
    await loki?.deleteDatabase();

    count = 0;
    loki = undefined;
    collection = undefined;
  }

  // No IDB data, fetch from the network and store.
  if (count === 0) {
    const next = await fetchTypeAheadItems();
    const tx = db.transaction('idbs', 'readwrite');
    await Promise.all([...next.map((item) => tx.store.add(item)), tx.done]);

    all = next;
    count = all.length;
  }

  // IDB is available at this point, check for Loki.
  if (!loki) {
    loki = new Loki('loki.db', { env: 'BROWSER' });
    await loki.initializePersistence({ adapter: new IndexedStorage() });

    collection = loki.addCollection<TAItem>('items', {
      defaultLokiOperatorPackage: 'js',
      rangedIndexes: {
        id: { indexTypeName: 'avl', comparatorName: 'js' }
      }
    });

    await loki.saveDatabase();
  }

  // No assure that Loki has data.
  if (collection && collection.count() === 0) {
    collection.insert(all);
  }
};

/**
 *
 * @param q
 * @returns
 */
const query = async (q: string) => {
  if (!collection) {
    await initIfNeeded();
  }

  // Loki adds a 'meta' and '$loki' to the result set,
  // therefore we need to filter them out.
  return collection!
    .find({ id: { $regex: new RegExp(`^${q}`, 'i') } })
    .map((hit) => ({ id: hit.id, slug: hit.slug }));
};

/**
 *
 */
export const adapter: DBAdapter<TAItem> = {
  initIfNeeded,
  query
};
