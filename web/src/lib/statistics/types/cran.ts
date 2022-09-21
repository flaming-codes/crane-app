export type CranDownloadsResponse = Array<{
  downloads: number;
  start: string;
  end: string;
  package: string;
}>;

export type CranResponse = CranDownloadsResponse;
