import { Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { ROLES_KEY } from './decorators/require-role.decorator';
import { AppRole } from '../user/entity/user.entity';

/**
 * Lightweight role guard for simple role checks.
 * For full RBAC with scope + permission checks, use PermissionGuard instead.
 *
 * Role hierarchy:
 *   hyper_admin (100) > hyper_manager (90) > admin (50) > manager (30) > user (10) > guest (5)
 *
 * hyper_admin and hyper_manager always pass role checks.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<AppRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles || roles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) return false;

    // Single role stored as string in users.role
    const userRole: AppRole = (user.role || user.roles?.[0] || 'user') as AppRole;

    // hyper_admin always passes
    if (userRole === 'hyper_admin') return true;

    // hyper_manager passes unless hyper_admin is explicitly required
    if (userRole === 'hyper_manager') {
      const requiresHyperAdminOnly = roles.length === 1 && roles[0] === 'hyper_admin';
      if (requiresHyperAdminOnly) {
        throw new ForbiddenException('Only hyper_admin can perform this action');
      }
      return true;
    }

    if (!roles.includes(userRole)) {
      throw new ForbiddenException(
        `Requires one of: ${roles.join(', ')}. Your role: ${userRole}`,
      );
    }

    return true;
  }
}
