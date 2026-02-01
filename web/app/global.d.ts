declare interface Window {
  plausible?: (
    event: string,
    opts?: {
      callback?: () => void;
      props?: Record<string, string>;
    },
  ) => void;

  ENV: {
    isPlausibleEnabled: boolean;
    googleAdsClient?: string;
    googleAdsSlotLeft?: string;
    googleAdsSlotRight?: string;
  };

  adsbygoogle?: Array<Record<string, unknown>>;
}
