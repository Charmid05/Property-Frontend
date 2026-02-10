export interface ApiError {
  message?: string;
  detail?: string;
  error?: string;
  [key: string]: any;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface TimeStamped {
  created_at: string;
  updated_at: string;
}