export type ApiResponse<T> = {
  success: boolean;
  data: T;
  meta?: {
    cached?: boolean;
    timestamp?: string;
    durationMs?: number | null;
  };
};
