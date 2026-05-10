/**
 * RBAC API tagging utilities.
 *
 * Each API call should include a `_frontendApiKey` in its axios config
 * so the pre-flight interceptor can check it against the binding map.
 *
 * @example
 *   api.get('/properties', rbac('propertiesApi.getAll.GET'))
 *   api.post('/bookings', data, rbac('bookingsApi.create.POST'))
 */
import type { AxiosRequestConfig } from 'axios';

/**
 * Returns an AxiosRequestConfig fragment containing the RBAC frontend API key.
 * Merge into the config of any axios call to enable pre-flight permission checks.
 */
export function rbac(frontendApiKey: string): AxiosRequestConfig & { _frontendApiKey: string } {
  return { _frontendApiKey: frontendApiKey } as any;
}

/**
 * Merge an RBAC tag with an existing config object (e.g. when you already have headers).
 */
export function rbacMerge(frontendApiKey: string, config: AxiosRequestConfig): AxiosRequestConfig {
  return { ...config, _frontendApiKey: frontendApiKey } as any;
}
