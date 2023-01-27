declare interface Window {
  plausible?: (
    event: string,
    opts?: {
      callback?: () => void;
      props?: Record<string, string>;
    }
  ) => void;
}

declare type Fetch = typeof fetch;

declare module 'svelte-confetti';
