import { expose } from 'comlink';
import type { DBAdapter, TAItem } from '../adapters/types';
import { adapter } from '../adapters/loki';
import { get, set } from 'idb-keyval';

/**
 *
 */
class Worker {
  static adapter: DBAdapter<TAItem> = adapter;

  async initIfNeeded(options?: { deleteExisting?: boolean }): Promise<number> {
    const cacheKey = 'ta-db-timestamp';

    try {
      const timestamp = await get(cacheKey);
      // 6 hours cache time.
      const isStale = timestamp && Date.now() - timestamp > 1_000 * 60 * 60 * 6;

      let res = 500;
      try {
        res = await Worker.adapter.initIfNeeded({
          ...options,
          deleteExisting: isStale || options?.deleteExisting
        });
      } catch (error) {
        console.error(error);
      }

      set(cacheKey, Date.now());

      return res;
    } catch (error) {
      await adapter.reset();

      console.error(error);

      await adapter.reset();

      return 500;
    }
  }

  async query(q: string) {
    return Worker.adapter.query(q);
  }
}

expose(Worker);
