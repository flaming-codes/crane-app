declare interface Window {
  plausible?: (
    event: string,
    opts?: {
      callback?: () => void;
      props?: Record<string, string>;
    },
  ) => void;

  /** Client-only env vars injected into window. */
  ENV: {
    isPlausibleEnabled: boolean;
  };
}
