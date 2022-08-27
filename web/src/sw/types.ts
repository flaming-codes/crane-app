/**
 * Database adapter for the service worker.
 * Unifies the access interface for the different database implementations.
 */
export type DBAdapter<T> = {
  initIfNeeded(options?: { deleteExisting?: boolean }): Promise<void>;
  query(q: string): Promise<T[]>;
};

/**
 * Type-ahead item.
 */
export type TAItem = { id: string; slug: string };
