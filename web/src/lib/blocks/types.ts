export type SubGridMeta =
  | { url: string; isExternal?: boolean; icon?: string }
  | { mail: string }
  | { boolean: boolean }
  | { text: string };
