import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesService } from '../../user/services/roles.service';
import { RbacConfigService } from '../../user/services/rbac-config.service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { AppRole } from '../../user/entity/user.entity';
import { generateBackendPermissionKey, type HttpMethod } from '../../rbac/utils/generate-backend-permission-key';
import { canMakeBooking, INVITATION_ALLOWED_ROLES } from '../../user/constants/invitation-rules.constant';

/**
 * Unified RBAC PermissionGuard.
 *
 * For every non-public endpoint it:
 * 1. Authenticates via JWT (user must exist on request)
 * 2. Derives the permission key: backend.<ControllerClass>.<handlerName>.<METHOD>
 * 3. Looks up the key in the RBAC cache (memory → Redis → DB)
 * 4. Checks if the user's role is in the allowed user_roles[]
 * 5. Enforces scope (admin ownership, manager property scope, guest scope)
 * 6. Enforces booking and invitation business rules
 */
@Injectable()
export class PermissionGuard implements CanActivate {
  private readonly logger = new Logger(PermissionGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly rolesService: RolesService,
    private readonly rbacConfig: RbacConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. Public endpoints bypass
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    // 2. Authenticated user required
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user?.id) {
      throw new UnauthorizedException('Authentication required.');
    }

    const userId: number = user.id;
    const userRole: AppRole = await this.rolesService.getUserRole(userId);
    request.userRole = userRole;

    const method = (request.method?.toUpperCase() ?? 'GET') as HttpMethod;
    const path: string = request.route?.path ?? '';

    // 3. Derive the permission key from controller + handler + method
    const controllerClass = context.getClass();
    const handler = context.getHandler();
    const controllerName = controllerClass.name;
    const endpointName = handler.name;
    const permissionKey = generateBackendPermissionKey(controllerName, endpointName, method);

    // 4. RBAC lookup — check if role is allowed
    if (this.rbacConfig.isLoaded()) {
      const isAllowed = this.rbacConfig.can(userRole, permissionKey);
      if (!isAllowed) {
        this.logger.warn(`DENIED: ${userRole} → ${permissionKey}`);
        throw new ForbiddenException(
          `Permission denied: '${permissionKey}' is not allowed for role '${userRole}'.`,
        );
      }
    } else {
      // Cache not loaded yet — deny by default for safety
      this.logger.error('RBAC cache not loaded — denying request');
      throw new ForbiddenException('RBAC system not ready. Please try again.');
    }

    // 5. Business rules

    // 5a. Booking restriction
    if (this.isBookingCreateEndpoint(controllerName, endpointName)) {
      if (!canMakeBooking(userRole)) {
        throw new ForbiddenException(`Role '${userRole}' cannot make bookings.`);
      }
    }

    // 5b. Invitation rules
    if (path.includes('/invitations') && method === 'POST' && endpointName === 'create') {
      const targetRole: AppRole = request.body?.role;
      if (targetRole) {
        const allowed = INVITATION_ALLOWED_ROLES[userRole] ?? [];
        if (!allowed.includes(targetRole)) {
          throw new ForbiddenException(
            `'${userRole}' cannot invite role '${targetRole}'. Allowed: [${allowed.join(', ') || 'none'}].`,
          );
        }
      }
    }

    // 6. Scope enforcement

    // Admin: ownership scope
    if (userRole === 'admin') {
      request.scopedAdminId = userId;
      await this.enforceAdminScope(request, userId, path, method);
    }

    // Manager: property-level scope
    if (userRole === 'manager') {
      const managerPropertyScope = await this.rolesService.getManagerProperties(userId);
      request.managerPropertyScope = managerPropertyScope;
    }

    // Guest: inherited scope
    if (userRole === 'guest') {
      await this.enforceGuestScope(request, userId);
    }

    return true;
  }

  // ─── Helpers ───────────────────────────────────────────────────────────

  private isBookingCreateEndpoint(controller: string, endpoint: string): boolean {
    return (
      (controller === 'BookingsController' && endpoint === 'create') ||
      (controller === 'ServiceBookingsController' && endpoint === 'create')
    );
  }

  private async enforceAdminScope(request: any, userId: number, path: string, method: string): Promise<void> {
    if (['GET', 'HEAD', 'OPTIONS'].includes(method)) return;

    const propertyId = request.params?.id || request.params?.propertyId;
    if (propertyId && path.includes('/properties')) {
      const isOwner = await this.rolesService.isPropertyOwner(userId, propertyId);
      if (!isOwner) {
        throw new ForbiddenException('Admin can only modify own properties.');
      }
    }

    const serviceId = request.params?.id || request.params?.serviceId;
    if (serviceId && path.includes('/services')) {
      const isOwner = await this.rolesService.isServiceOwner(userId, serviceId);
      if (!isOwner) {
        throw new ForbiddenException('Admin can only modify own services.');
      }
    }
  }

  private async enforceGuestScope(request: any, userId: number): Promise<void> {
    try {
      const accessibleProperties = await this.rolesService.getGuestAccessibleProperties(userId);
      const accessibleServices = await this.rolesService.getGuestAccessibleServices(userId);
      request.guestPropertyScope = accessibleProperties;
      request.guestServiceScope = accessibleServices;
    } catch {
      // Fail open — let the service handle filtering
    }
  }
}
