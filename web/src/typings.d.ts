declare interface Window {
  pa?: {
    track(params: { name: string; value?: number | string; unit?: number | string }): void;
  };
}
