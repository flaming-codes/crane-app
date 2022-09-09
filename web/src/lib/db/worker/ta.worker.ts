import { expose } from 'comlink';
import type { DBAdapter } from '../adapters/types';
import type { TAItem } from 'src/sw/types';
import { adapter } from '../adapters/loki';

class Worker implements DBAdapter<TAItem> {
  static adapter: DBAdapter<TAItem> = adapter;

  async initIfNeeded(options?: { deleteExisting?: boolean }): Promise<number> {
    try {
      return Worker.adapter.initIfNeeded(options);
    } catch (error) {
      console.error(error);
      return 500;
    }
  }

  async query(q: string) {
    return Worker.adapter.query(q);
  }
}

expose(Worker);
