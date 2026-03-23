import { SetMetadata } from '@nestjs/common';
import { AppRole } from '../../user/entity/user-role.entity';

export const ROLES_KEY = 'required_roles';

/**
 * Decorator to restrict endpoint access to specific roles.
 * Hyper managers always pass. Multiple roles = OR logic.
 */
export const RequireRole = (...roles: AppRole[]) => SetMetadata(ROLES_KEY, roles);
