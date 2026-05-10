/**
 * Standard pagination helpers shared across controllers.
 * Default response shape: { data, total, page, limit, totalPages }
 */

export const clampPage = (p?: number | string): number =>
  Math.max(1, parseInt(String(p ?? 1), 10) || 1);

export const clampLimit = (l?: number | string, max = 100): number =>
  Math.min(max, Math.max(1, parseInt(String(l ?? 20), 10) || 20));

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function paginateArray<T>(
  items: T[],
  page?: number | string,
  limit?: number | string,
): PaginatedResponse<T> {
  const p = clampPage(page);
  const l = clampLimit(limit);
  const total = items.length;
  const start = (p - 1) * l;
  const data = items.slice(start, start + l);
  return {
    data,
    total,
    page: p,
    limit: l,
    totalPages: Math.max(1, Math.ceil(total / l)),
  };
}

/**
 * Backwards-compatible pagination wrapper.
 * - If neither `page` nor `limit` query is provided -> return the raw array
 *   (preserves existing frontend consumers).
 * - If either is provided -> return the standard PaginatedResponse shape.
 */
export function maybePaginate<T>(
  items: T[],
  page?: number | string,
  limit?: number | string,
): T[] | PaginatedResponse<T> {
  if (page === undefined && limit === undefined) return items;
  return paginateArray(items, page, limit);
}
