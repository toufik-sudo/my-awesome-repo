import { SetMetadata } from '@nestjs/common';
import { PermissionType } from '../../user/entity/manager-permission.entity';

export const PERMISSION_KEY = 'required_permission';
export const PROPERTY_PARAM_KEY = 'property_param';

/**
 * Decorator to require a specific permission for a manager on a property.
 * @param permission - The permission type required
 * @param propertyParam - The route/body param name that holds the property ID (default: 'id')
 * @param source - Where to find the property ID: 'param', 'body', or 'query'
 */
export const RequirePermission = (
  permission: PermissionType,
  propertyParam: string = 'id',
  source: 'param' | 'body' | 'query' = 'param',
) => SetMetadata(PERMISSION_KEY, { permission, propertyParam, source });
