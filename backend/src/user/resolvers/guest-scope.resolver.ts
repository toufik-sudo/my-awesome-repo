import { Injectable } from '@nestjs/common';
import { RolesService } from '../services/roles.service';
import { ScopeFilterService, ScopedPerm } from '../../rbac/services/scope-filter.service';

/**
 * Guest Scope Resolver
 *
 * Resolves the accessible property/service IDs for a guest based on their
 * scoped permissions in guest_permissions table.
 */
@Injectable()
export class GuestScopeResolver {
  constructor(
    private readonly rolesService: RolesService,
    private readonly scopeFilter: ScopeFilterService,
  ) {}

  /**
   * Returns property IDs the guest can access, or null for "all" (global scope).
   */
  async resolvePropertyScope(guestId: number): Promise<string[] | null> {
    return this.rolesService.getGuestAccessibleProperties(guestId);
  }

  /**
   * Returns service IDs the guest can access, or null for "all".
   */
  async resolveServiceScope(guestId: number): Promise<string[] | null> {
    return this.rolesService.getGuestAccessibleServices(guestId);
  }
}
