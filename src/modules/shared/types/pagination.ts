/**
 * Standardized server pagination response shape used across the API.
 * Matches the backend `{ data, total, page, limit, totalPages }` format
 * produced by `paginateArray` / `maybePaginate`.
 */
export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 100;
