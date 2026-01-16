import { ISortable } from 'interfaces/api/ISortable';
import { HTTP_STATUS } from 'constants/api';
import { SORT_DIRECTION } from 'constants/api/sorting';

export const toggleSorting = (sortBy: string, isAscending: boolean): ISortable => {
  return {
    sortBy,
    sortDirection: isAscending ? SORT_DIRECTION.DESC : SORT_DIRECTION.ASC
  };
};

/**
 * Returns whether the given HTTP response has 404 status
 * @param response
 */
export const isNotFound = response => response && response.status === HTTP_STATUS.NOT_FOUND;

/**
 * Returns whether the given HTTP response has 403 status
 * @param response
 */
export const isForbidden = response => response && response.status === HTTP_STATUS.FORBIDDEN;

/**
 * Extracts the error code from the response body, if present
 * @param response
 */
export const extractErrorCode = response => response && response.data && response.data.code;

/**
 * Trim last part of the url with a given size
 *
 * @param url
 * @param size
 */
export const trimUrl = (url, size) => url.slice(0, url.indexOf(size));
