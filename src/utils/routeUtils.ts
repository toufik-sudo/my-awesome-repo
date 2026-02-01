import qs from 'qs';
import { PROGRAM_ID } from '@/constants/wall/launch';

const PLATFORM_ID = 'platformId';

/**
 * Checks the query param provided programId and platformId and overwrites the store values
 *
 * @param selectedProgramId
 * @param selectedPlatformId
 */
export const getRouteForcedParams = (selectedProgramId: number, selectedPlatformId: number) => {
  const params = qs.parse(window.location.search.slice(1));

  return {
    programId: params[PROGRAM_ID] && params[PLATFORM_ID] ? Number(params[PROGRAM_ID]) : selectedProgramId,
    platformId: Number(params[PLATFORM_ID]) || selectedPlatformId
  };
};

/**
 * Get query parameter by name
 * @param name - Parameter name
 */
export const getQueryParam = (name: string): string | null => {
  const params = qs.parse(window.location.search.slice(1));
  return params[name] as string || null;
};

/**
 * Set query parameter
 * @param name - Parameter name
 * @param value - Parameter value
 */
export const setQueryParam = (name: string, value: string): void => {
  const params = qs.parse(window.location.search.slice(1));
  params[name] = value;
  const newSearch = qs.stringify(params);
  window.history.replaceState(null, '', `${window.location.pathname}?${newSearch}`);
};

/**
 * Remove query parameter
 * @param name - Parameter name
 */
export const removeQueryParam = (name: string): void => {
  const params = qs.parse(window.location.search.slice(1));
  delete params[name];
  const newSearch = qs.stringify(params);
  const newUrl = newSearch ? `${window.location.pathname}?${newSearch}` : window.location.pathname;
  window.history.replaceState(null, '', newUrl);
};

/**
 * Get all query parameters as object
 */
export const getAllQueryParams = (): Record<string, string> => {
  return qs.parse(window.location.search.slice(1)) as Record<string, string>;
};

/**
 * Build URL with query parameters
 * @param baseUrl - Base URL
 * @param params - Query parameters
 */
export const buildUrlWithParams = (baseUrl: string, params: Record<string, any>): string => {
  const queryString = qs.stringify(params, { skipNulls: true });
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};
