import type { IDBPDatabase } from 'idb';
import { openDB, deleteDB } from 'idb';
import IndexedStorage from '@lokidb/indexed-storage';
import type Loki from '@lokidb/loki';
import type { Collection } from '@lokidb/loki';
import { get, set, del } from 'idb-keyval';
import type { DBAdapter, TAItem } from './types';
import { fetchTypeAheadItems } from '../utils/net';

let db: IDBPDatabase<unknown> | undefined;
let loki: Loki | undefined;
let collection: Collection<TAItem> | undefined;

/**
 *
 */
async function open() {
  db = await openDB('loki-idb-store', 1, {
    upgrade(db) {
      try {
        db.createObjectStore('loki-idbs', {
          keyPath: 'id'
        });
      } catch (error) {
        console.error('loki adapter idb upgrade:', error);
      }
    }
  });
}

/**
 *
 * @param options
 */
const initIfNeeded = async (options?: { deleteExisting?: boolean }) => {
  const status = 200;

  try {
    if (!db) {
      await open();
    }
  } catch (error) {
    console.error('loki adapter idb open:', error);
  }

  return status;
};

/**
 *
 */
async function reset() {
  await db?.clear('loki-idbs').catch();
  await loki?.deleteDatabase().catch();
  await del('ta-db-active-init').catch();
  await deleteDB('loki-idb-store').catch();

  db = undefined;
  loki = undefined;
  collection = undefined;
}

/**
 *
 * @param q
 * @returns
 */
const query = async (q: string) => {
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
  query,
  reset
};
