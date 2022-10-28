/**
 * Database adapter for the service worker.
 * Unifies the access interface for the different database implementations.
 */
export type DBAdapter<T> = {
  initIfNeeded(options?: { deleteExisting?: boolean }): Promise<number>;
  query(q: string): Promise<T[]>;
  reset(): Promise<void>;
};

export type TAItem = { id: string; slug: string };
