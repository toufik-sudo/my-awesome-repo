import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesService } from '../../user/services/roles.service';
import { PERMISSION_KEY } from '../decorators/require-permission.decorator';
import { ROLES_KEY } from '../decorators/require-role.decorator';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { PermissionType } from '../../user/entity/manager-permission.entity';
import { AppRole } from '../../user/entity/user.entity';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly rolesService: RolesService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Skip public endpoints
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user?.id) return false;

    const userId: number = user.id;

    // Get user role from users table
    const userRole = await this.rolesService.getUserRole(userId);

    // Hyper admins and hyper managers always pass role checks
    if (userRole === 'hyper_admin' || userRole === 'hyper_manager') return true;

    // Guests are read-only — block all write operations
    if (userRole === 'guest') {
      const method = request.method?.toUpperCase();
      if (method && method !== 'GET' && method !== 'HEAD' && method !== 'OPTIONS') {
        throw new ForbiddenException('Guest role is read-only');
      }
    }

    // ─── Role check ─────────────────────────────────────────────────────
    const requiredRoles = this.reflector.getAllAndOverride<AppRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (requiredRoles && requiredRoles.length > 0) {
      if (!requiredRoles.includes(userRole)) {
        throw new ForbiddenException(
          `Requires one of: ${requiredRoles.join(', ')}`,
        );
      }
    }

    // ─── Permission check (for managers) ────────────────────────────────
    const permMeta = this.reflector.getAllAndOverride<{
      permission: PermissionType;
      propertyParam: string;
      source: 'param' | 'body' | 'query';
    }>(PERMISSION_KEY, [context.getHandler(), context.getClass()]);

    if (permMeta) {
      // Admins pass permission checks (they own properties)
      if (userRole === 'admin') return true;

      // Managers need explicit permission
      if (userRole !== 'manager') {
        throw new ForbiddenException('Manager role required');
      }

      // Extract propertyId from the request
      let propertyId: string | undefined;
      if (permMeta.source === 'param') {
        propertyId = request.params?.[permMeta.propertyParam];
      } else if (permMeta.source === 'body') {
        propertyId = request.body?.[permMeta.propertyParam];
      } else if (permMeta.source === 'query') {
        propertyId = request.query?.[permMeta.propertyParam];
      }

      if (!propertyId) {
        throw new ForbiddenException('Property context required for this action');
      }

      const hasPermission = await this.rolesService.hasPermissionForProperty(
        userId,
        propertyId,
        permMeta.permission,
      );

      if (!hasPermission) {
        throw new ForbiddenException(
          `Missing permission: ${permMeta.permission}`,
        );
      }
    }

    return true;
  }
}
