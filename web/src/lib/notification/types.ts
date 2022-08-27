export type Intel = {
  type: 'success' | 'error' | 'info' | 'neutral';
  value: string;
  meta?: {
    kbd?: string[];
  };
};
