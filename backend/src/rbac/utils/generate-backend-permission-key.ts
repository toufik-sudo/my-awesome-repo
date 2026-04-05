/**
 * Generate a standardised backend RBAC permission key.
 *
 * Format: backend.<ControllerName>.<EndpointName>.<METHOD>
 *
 * @example
 *   generateBackendPermissionKey('PropertiesController', 'create', 'POST')
 *   // → 'backend.PropertiesController.create.POST'
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export function generateBackendPermissionKey(
  controllerName: string,
  endpointName: string,
  method: HttpMethod,
): string {
  if (!controllerName || !endpointName || !method) {
    throw new Error(
      `Invalid permission key parts: controller='${controllerName}', endpoint='${endpointName}', method='${method}'`,
    );
  }
  return `backend.${controllerName}.${endpointName}.${method}`;
}
