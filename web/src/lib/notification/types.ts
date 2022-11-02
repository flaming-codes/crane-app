export type Intel = {
  type: 'success' | 'error' | 'info' | 'neutral' | 'warning';
  value: string;
  duration?: number;
  meta?: {
    kbd?: string[];
    align?: 'start' | 'center';
  };
};
