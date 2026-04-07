import { SetMetadata } from '@nestjs/common';

export const PERMISSION_KEY = 'required_permission';
export const PROPERTY_PARAM_KEY = 'property_param';

/**
 * Decorator to require a specific backend permission key for a manager on a property.
 * @param permission - The backend permission key required (e.g. 'backend.PropertiesController.update.PUT')
 * @param propertyParam - The route/body param name that holds the property ID (default: 'id')
 * @param source - Where to find the property ID: 'param', 'body', or 'query'
 */
export const RequirePermission = (
  permission: string,
  propertyParam: string = 'id',
  source: 'param' | 'body' | 'query' = 'param',
) => SetMetadata(PERMISSION_KEY, { permission, propertyParam, source });
