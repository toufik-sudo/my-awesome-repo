/**
 * Generic pageable result interface for API responses
 */
export interface IPageableResult<T> {
  entries: T[];
  total: number;
}
