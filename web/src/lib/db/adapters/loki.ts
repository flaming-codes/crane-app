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
  let status = 200;
  status = 200;

  try {
    if (!db) {
      await open();
    }
  } catch (error) {
    console.error('loki adapter idb open:', error);
  }

  if (!db) {
    console.error('loki adapter, no db found');
    return 500;
  }

  let count = await db.count('loki-idbs');
  let all: TAItem[] = [];
  all = [];
  let deleteExisting = options?.deleteExisting ?? false;

  // Check for a failed past init. This marker gets only
  // deleted after a successful init, so if it exists,
  // we need to init again.
  try {
    const resumeFromFailed = await get('ta-db-active-init');
    if (resumeFromFailed) {
      count = 0;
      deleteExisting = true;
    }
  } catch (error) {
    console.error('loki adapter idb get resumeFromFailed:', error);
  }

  // Set the marker to indicate that we are currently
  // initializing the db.
  try {
    await set('ta-db-active-init', true);
  } catch (error) {
    console.error('loki adapter idb set active-init:', error);
  }

  if (count > 0 && deleteExisting) {
    try {
      await db.clear('loki-idbs');
    } catch (error) {
      console.error('loki adapter idb clear:', error);
    }
    try {
      await loki?.deleteDatabase();
    } catch (error) {
      console.error('loki adapter loki delete:', error);
    }

    count = 0;
    loki = undefined;
    collection = undefined;
  }

  // No IDB data, fetch from the network and store.
  if (count === 0) {
    const next = await fetchTypeAheadItems();
    const tx = db.transaction('loki-idbs', 'readwrite');
    await Promise.all([...next.map((item) => tx.store.add(item)), tx.done]);

    all = next;
    count = all.length;

    status = 201;
  }

  /*
  // IDB is available at this point, check for Loki.
  if (!loki) {
    try {
      loki = new Loki('loki.db', { env: 'BROWSER' });
    } catch (error) {
      console.error('new loki', error);
    }

    try {
      await loki?.initializePersistence({ adapter: new IndexedStorage() });
    } catch (error) {
      console.error('loki adapter initializePersistence:', error);
    }

    try {
      collection = loki?.addCollection<TAItem>('items', {
        defaultLokiOperatorPackage: 'js',
        rangedIndexes: {
          id: { indexTypeName: 'avl', comparatorName: 'js' }
        }
      });
    } catch (error) {
      console.error('loki adapter addCollection:', error);
    }

    try {
      await loki?.saveDatabase();
    } catch (error) {
      console.error('loki adapter saveDatabase:', error);
    }
  }

  // Now assure that Loki has data.
  try {
    if (collection && collection.count() === 0) {
      if (all.length === 0) {
        all = await db.getAll('loki-idbs');
      }
      collection.insert(all);
    }
  } catch (error) {
    console.error('loki adapter insert:', error);
  }

  // Clear marker for failed init.
  try {
    await del('ta-db-active-init');
  } catch (error) {
    console.error('loki adapter del:', error);
  }
  */

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
