import { Injectable } from '@nestjs/common';
import { RolesService } from '../services/roles.service';
import { AppRole } from '../entity/user.entity';

/**
 * [BE-04] Guest Scope Resolver
 *
 * Resolves the accessible property/service IDs for a guest based on their inviter:
 * - Invited by hyper_admin → scope global (all properties/services)
 * - Invited by hyper_manager → scope = hyper_manager's assignments
 * - Invited by admin → scope = admin's own properties/services (hostId)
 * - Invited by manager → exact subset of the manager's assignments (per admin pair)
 *
 * This is called by PermissionGuard for every guest request to filter resources.
 * The actual assignment creation happens in RolesService.createGuestAssignmentsFromInviter()
 * when the invitation is accepted.
 *
 * The guest's assignments are pre-computed at accept time, so this resolver
 * just delegates to RolesService.getGuestAccessibleProperties() which reads
 * from manager_assignments table.
 */
@Injectable()
export class GuestScopeResolver {
  constructor(private readonly rolesService: RolesService) {}

  /**
   * Returns property IDs the guest can access, or null for "all" (global scope).
   */
  async resolvePropertyScope(guestId: number): Promise<string[] | null> {
    return this.rolesService.getGuestAccessibleProperties(guestId);
  }

  /**
   * Returns service IDs the guest can access, or null for "all".
   * Services are linked to admin/providers, so we look up the admin's services
   * from the guest's assignments.
   */
  async resolveServiceScope(guestId: number): Promise<string[] | null> {
    const propertyScope = await this.resolvePropertyScope(guestId);

    // Global scope → all services
    if (propertyScope === null) return null;

    // No access at all
    if (propertyScope.length === 0) return [];

    // Get the admin IDs from the guest's assignments
    const adminIds = await this.getAssignedAdminIds(guestId);
    if (adminIds.length === 0) return [];

    // Get all service IDs owned by those admins
    const serviceIds: string[] = [];
    for (const adminId of adminIds) {
      const ids = await this.rolesService.getAdminServiceIds(adminId);
      serviceIds.push(...ids);
    }

    return [...new Set(serviceIds)];
  }

  private async getAssignedAdminIds(guestId: number): Promise<number[]> {
    // Delegate to roles service — assignments store assignedByAdminId
    const assignments = await this.rolesService.getAllAssignments(guestId);
    const adminIds = new Set<number>();
    for (const a of assignments) {
      if (a.assignedByAdminId) adminIds.add(a.assignedByAdminId);
    }
    return Array.from(adminIds);
  }
}
