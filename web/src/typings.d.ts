declare interface Window {
  plausible?: (
    event: string,
    opts?: {
      callback?: () => void;
      props?: Record<string, string>;
    }
  ) => void;
}
