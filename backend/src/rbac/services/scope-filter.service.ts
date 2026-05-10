import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { PropertyGroup } from '../../properties/entity/property-group.entity';
import { ServiceGroup } from '../../services/entity/service-group.entity';
import { Property } from '../../properties/entity/property.entity';
import { TourismService } from '../../services/entity/tourism-service.entity';
import { ScopeContext, getScopedPerms } from '../scope-context';
import { logScopeFallback } from '../utils/scope-fallback-logger';

export interface ScopedPerm {
  userId: number;
  backendPermissionKey: string;
  frontendPermissionKey: string | null;
  scope: string;
  properties: string[] | null;
  services: string[] | null;
  propertyGroups: string[] | null;
  serviceGroups: string[] | null;
  admins: number[] | null;
  isGranted: boolean;
  assignedById: number;
}

export interface ResolvedScope {
  propertyIds: string[] | null;
  serviceIds: string[] | null;
}

@Injectable()
export class ScopeFilterService {
  private readonly logger = new Logger(ScopeFilterService.name);

  constructor(
    @InjectRepository(PropertyGroup)
    private readonly propGroupRepo: Repository<PropertyGroup>,
    @InjectRepository(ServiceGroup)
    private readonly svcGroupRepo: Repository<ServiceGroup>,
    @InjectRepository(Property)
    private readonly propertyRepo: Repository<Property>,
    @InjectRepository(TourismService)
    private readonly serviceRepo: Repository<TourismService>,
  ) {}

  /** Whether a scoped perm carries a property-side scope target. */
  private permTouchesProperties(p: ScopedPerm): boolean {
    if (p.scope === 'properties' || p.scope === 'property_groups') return true;
    if (p.scope === 'admins' || p.scope === 'all') return true; // inherits inviter inventory
    return false;
  }

  /** Whether a scoped perm carries a service-side scope target. */
  private permTouchesServices(p: ScopedPerm): boolean {
    if (p.scope === 'services' || p.scope === 'service_groups') return true;
    if (p.scope === 'admins' || p.scope === 'all') return true; // inherits inviter inventory
    return false;
  }

  /**
   * A "narrow" property perm explicitly targets specific properties or property groups
   * (non-empty target arrays). When any narrow property perm exists for a manager/guest,
   * it MUST take precedence over broader 'all' / 'admins' / empty-target perms which
   * would otherwise inherit the inviter admin's full inventory.
   */
  private isNarrowPropertyPerm(p: ScopedPerm): boolean {
    if (p.scope === 'properties' && p.properties && p.properties.length > 0) return true;
    if (p.scope === 'property_groups' && p.propertyGroups && p.propertyGroups.length > 0) return true;
    return false;
  }

  private isNarrowServicePerm(p: ScopedPerm): boolean {
    if (p.scope === 'services' && p.services && p.services.length > 0) return true;
    if (p.scope === 'service_groups' && p.serviceGroups && p.serviceGroups.length > 0) return true;
    return false;
  }

  async resolvePropertyIds(
    scopedPerms: ScopedPerm[],
    permissionKey: string,
    role?: string,
    userId?: number,
  ): Promise<string[] | null> {
    let relevant = scopedPerms.filter(
      p => p.backendPermissionKey === permissionKey && p.isGranted,
    );
    // Fallback: if no perm targets this exact endpoint, fall back to ALL
    // granted scoped perms that touch property scope. A manager/guest who
    // can manage/view properties X,Y,Z must see those in any property list,
    // even when the listing endpoint key wasn't explicitly seeded.
    if (relevant.length === 0) {
      relevant = scopedPerms.filter(p => p.isGranted && this.permTouchesProperties(p));
      if (relevant.length === 0) return [];
      logScopeFallback({
        source: 'ScopeFilterService.resolvePropertyIds',
        role,
        userId,
        permissionKey,
        inviterIds: [],
        resolvedCount: relevant.length,
        resourceKind: 'property',
        reason: 'No perm matched the requested key — falling back to union of all granted property-scoped perms.',
      });
    }

    // For hyper_manager, scope='all' truly means platform-wide.
    // For manager/guest, scope='all' means "all resources owned by the inviter admin".
    const isHyperManager = role === 'hyper_manager';
    if (isHyperManager && relevant.some(p => p.scope === 'all')) return null;

    // RESTRICTIVE precedence: when any narrow-scope perm (specific properties
    // or property groups) is present for a manager/guest, it overrides broader
    // 'all' / 'admins' / empty-target perms which would otherwise inherit the
    // inviter admin's full inventory. Without this, granting both a narrow
    // "scope=properties" assignment AND any "scope=all" permission would leak
    // every admin-owned property to the manager.
    if (!isHyperManager) {
      const narrow = relevant.filter(p => this.isNarrowPropertyPerm(p));
      if (narrow.length > 0) relevant = narrow;
    }

    const ids = new Set<string>();
    // Inviters whose full inventory should be inherited (no explicit target on the perm).
    const inheritFromInviters = new Set<number>();

    for (const perm of relevant) {
      switch (perm.scope) {
        case 'properties':
          if (perm.properties && perm.properties.length > 0) {
            perm.properties.forEach(id => ids.add(id));
          } else if (perm.assignedById) {
            inheritFromInviters.add(perm.assignedById);
          }
          break;
        case 'property_groups':
          if (perm.propertyGroups && perm.propertyGroups.length > 0) {
            const groups = await this.propGroupRepo.find({
              where: { id: In(perm.propertyGroups) },
              relations: ['properties'],
            });
            for (const g of groups) {
              if (g.properties) g.properties.forEach(p => ids.add(p.id));
            }
          } else if (perm.assignedById) {
            inheritFromInviters.add(perm.assignedById);
          }
          break;
        case 'admins':
          if (perm.admins && perm.admins.length > 0) {
            const props = await this.propertyRepo.find({
              where: { hostId: In(perm.admins) },
              select: ['id'],
            });
            props.forEach(p => ids.add(p.id));
          } else if (perm.assignedById) {
            inheritFromInviters.add(perm.assignedById);
          }
          break;
        case 'all':
          // For manager/guest (or unknown role): inherit inviter's full inventory.
          if (perm.assignedById) inheritFromInviters.add(perm.assignedById);
          break;
        default:
          if (perm.assignedById) inheritFromInviters.add(perm.assignedById);
          break;
      }
    }

    if (inheritFromInviters.size > 0) {
      const inviterIds = Array.from(inheritFromInviters);
      const props = await this.propertyRepo.find({
        where: { hostId: In(inviterIds) },
        select: ['id'],
      });
      props.forEach(p => ids.add(p.id));
      logScopeFallback({
        source: 'ScopeFilterService.resolvePropertyIds',
        role,
        userId,
        permissionKey,
        inviterIds,
        resolvedCount: props.length,
        resourceKind: 'property',
        reason:
          'Permission granted with no explicit property/group/admin target — inheriting inviter admin\'s full property inventory.',
      });
    }

    return Array.from(ids);
  }

  async resolveServiceIds(
    scopedPerms: ScopedPerm[],
    permissionKey: string,
    role?: string,
    userId?: number,
  ): Promise<string[] | null> {
    let relevant = scopedPerms.filter(
      p => p.backendPermissionKey === permissionKey && p.isGranted,
    );
    if (relevant.length === 0) {
      relevant = scopedPerms.filter(p => p.isGranted && this.permTouchesServices(p));
      if (relevant.length === 0) return [];
      logScopeFallback({
        source: 'ScopeFilterService.resolveServiceIds',
        role,
        userId,
        permissionKey,
        inviterIds: [],
        resolvedCount: relevant.length,
        resourceKind: 'service',
        reason: 'No perm matched the requested key — falling back to union of all granted service-scoped perms.',
      });
    }

    const isHyperManager = role === 'hyper_manager';
    if (isHyperManager && relevant.some(p => p.scope === 'all')) return null;

    const ids = new Set<string>();
    const inheritFromInviters = new Set<number>();

    for (const perm of relevant) {
      switch (perm.scope) {
        case 'services':
          if (perm.services && perm.services.length > 0) {
            perm.services.forEach(id => ids.add(id));
          } else if (perm.assignedById) {
            inheritFromInviters.add(perm.assignedById);
          }
          break;
        case 'service_groups':
          if (perm.serviceGroups && perm.serviceGroups.length > 0) {
            const groups = await this.svcGroupRepo.find({
              where: { id: In(perm.serviceGroups) },
              relations: ['services'],
            });
            for (const g of groups) {
              if (g.services) g.services.forEach(s => ids.add(s.id));
            }
          } else if (perm.assignedById) {
            inheritFromInviters.add(perm.assignedById);
          }
          break;
        case 'admins':
          if (perm.admins && perm.admins.length > 0) {
            const svcs = await this.serviceRepo.find({
              where: { providerId: In(perm.admins) },
              select: ['id'],
            });
            svcs.forEach(s => ids.add(s.id));
          } else if (perm.assignedById) {
            inheritFromInviters.add(perm.assignedById);
          }
          break;
        case 'all':
          if (perm.assignedById) inheritFromInviters.add(perm.assignedById);
          break;
        default:
          if (perm.assignedById) inheritFromInviters.add(perm.assignedById);
          break;
      }
    }

    if (inheritFromInviters.size > 0) {
      const inviterIds = Array.from(inheritFromInviters);
      const svcs = await this.serviceRepo.find({
        where: { providerId: In(inviterIds) },
        select: ['id'],
      });
      svcs.forEach(s => ids.add(s.id));
      logScopeFallback({
        source: 'ScopeFilterService.resolveServiceIds',
        role,
        userId,
        permissionKey,
        inviterIds,
        resolvedCount: svcs.length,
        resourceKind: 'service',
        reason:
          'Permission granted with no explicit service/group/admin target — inheriting inviter admin\'s full service inventory.',
      });
    }

    return Array.from(ids);
  }

  async resolveScope(
    scopedPerms: ScopedPerm[],
    permissionKey: string,
    role?: string,
    userId?: number,
  ): Promise<ResolvedScope> {
    const [propertyIds, serviceIds] = await Promise.all([
      this.resolvePropertyIds(scopedPerms, permissionKey, role, userId),
      this.resolveServiceIds(scopedPerms, permissionKey, role, userId),
    ]);
    return { propertyIds, serviceIds };
  }

  mergePropertyIds(...lists: (string[] | null)[]): string[] | null {
    if (lists.some(l => l === null)) return null;
    const ids = new Set<string>();
    for (const list of lists) {
      if (list) list.forEach(id => ids.add(id));
    }
    return Array.from(ids);
  }

  mergeServiceIds(...lists: (string[] | null)[]): string[] | null {
    if (lists.some(l => l === null)) return null;
    const ids = new Set<string>();
    for (const list of lists) {
      if (list) list.forEach(id => ids.add(id));
    }
    return Array.from(ids);
  }

  isAllowed(resolvedIds: string[] | null, resourceId: string): boolean {
    if (resolvedIds === null) return true;
    return resolvedIds.includes(resourceId);
  }

  // ─── EFFECTIVE SCOPE RESOLUTION ────────────────────────────────────────
  // Returns the IDs the caller may access:
  //   null  → no filter (full access: hyper_admin, anonymous, plain user)
  //   []    → no access (role expects scoped perms but none granted)
  //   [...] → restricted to these IDs
  //
  // hyper_admin   → full access (null).
  // hyper_manager → all resources but bounded by hyper_manager_permissions
  //                 assigned by hyper_admin (scope can target admins, groups,
  //                 specific properties/services, or 'all').
  // admin         → own resources only (hostId / providerId).
  // manager       → assigned scoped permissions from manager_permissions.
  // guest         → assigned scoped permissions from guest_permissions.
  // Anonymous (no scopeCtx) → no filter; controllers still apply public
  //                 visibility rules (e.g. status='published').

  async effectivePropertyIds(
    scopeCtx: ScopeContext | undefined,
    permissionKey: string,
  ): Promise<string[] | null> {
    if (!scopeCtx) return null;
    const { userRole, userId } = scopeCtx;

    if (userRole === 'hyper_admin') return null;

    if (userRole === 'admin') {
      const rows = await this.propertyRepo.find({
        where: { hostId: userId },
        select: ['id'],
      });
      return rows.map(r => r.id);
    }

    if (userRole === 'hyper_manager') {
      const scopedPerms = getScopedPerms(scopeCtx);
      if (scopedPerms.length === 0) return null; // inherits hyper_admin scope
      return this.resolvePropertyIds(scopedPerms, permissionKey, userRole, userId);
    }

    if (userRole === 'manager' || userRole === 'guest') {
      const scopedPerms = getScopedPerms(scopeCtx);
      const inviterIds = scopeCtx.inviterAdminIds ?? [];

      if (scopedPerms.length === 0) {
        if (inviterIds.length === 0) return [];
        logScopeFallback({
          source: 'ScopeFilterService.effectivePropertyIds',
          role: userRole, userId, permissionKey,
          inviterIds, resolvedCount: 0, resourceKind: 'property',
          reason: 'No scoped perms seeded — inheriting inviter admin(s) full property inventory.',
        });
        return this.expandInviterPropertyInventory(inviterIds);
      }

      const ids = await this.resolvePropertyIds(scopedPerms, permissionKey, userRole, userId);
      if (ids !== null && ids.length === 0 && inviterIds.length > 0) {
        logScopeFallback({
          source: 'ScopeFilterService.effectivePropertyIds',
          role: userRole, userId, permissionKey,
          inviterIds, resolvedCount: 0, resourceKind: 'property',
          reason: 'Resolved scope was empty for this key — inheriting inviter admin(s) full property inventory.',
        });
        return this.expandInviterPropertyInventory(inviterIds);
      }
      return ids;
    }

    return null;
  }

  async effectiveServiceIds(
    scopeCtx: ScopeContext | undefined,
    permissionKey: string,
  ): Promise<string[] | null> {
    if (!scopeCtx) return null;
    const { userRole, userId } = scopeCtx;

    if (userRole === 'hyper_admin') return null;

    if (userRole === 'admin') {
      const rows = await this.serviceRepo.find({
        where: { providerId: userId },
        select: ['id'],
      });
      return rows.map(r => r.id);
    }

    if (userRole === 'hyper_manager') {
      const scopedPerms = getScopedPerms(scopeCtx);
      if (scopedPerms.length === 0) return null;
      return this.resolveServiceIds(scopedPerms, permissionKey, userRole, userId);
    }

    if (userRole === 'manager' || userRole === 'guest') {
      const scopedPerms = getScopedPerms(scopeCtx);
      const inviterIds = scopeCtx.inviterAdminIds ?? [];

      if (scopedPerms.length === 0) {
        if (inviterIds.length === 0) return [];
        logScopeFallback({
          source: 'ScopeFilterService.effectiveServiceIds',
          role: userRole, userId, permissionKey,
          inviterIds, resolvedCount: 0, resourceKind: 'service',
          reason: 'No scoped perms seeded — inheriting inviter admin(s) full service inventory.',
        });
        return this.expandInviterServiceInventory(inviterIds);
      }

      const ids = await this.resolveServiceIds(scopedPerms, permissionKey, userRole, userId);
      if (ids !== null && ids.length === 0 && inviterIds.length > 0) {
        logScopeFallback({
          source: 'ScopeFilterService.effectiveServiceIds',
          role: userRole, userId, permissionKey,
          inviterIds, resolvedCount: 0, resourceKind: 'service',
          reason: 'Resolved scope was empty for this key — inheriting inviter admin(s) full service inventory.',
        });
        return this.expandInviterServiceInventory(inviterIds);
      }
      return ids;
    }

    return null;
  }

  private async expandInviterPropertyInventory(inviterIds: number[]): Promise<string[]> {
    if (inviterIds.length === 0) return [];
    const rows = await this.propertyRepo.find({
      where: { hostId: In(inviterIds) },
      select: ['id'],
    });
    return rows.map(r => r.id);
  }

  private async expandInviterServiceInventory(inviterIds: number[]): Promise<string[]> {
    if (inviterIds.length === 0) return [];
    const rows = await this.serviceRepo.find({
      where: { providerId: In(inviterIds) },
      select: ['id'],
    });
    return rows.map(r => r.id);
  }

  /**
   * Whether the caller should bypass the public-only status filter
   * (i.e. see drafts/archived/suspended for resources they manage).
   */
  canSeeAllStatuses(scopeCtx: ScopeContext | undefined): boolean {
    if (!scopeCtx) return false;
    return ['hyper_admin', 'hyper_manager', 'admin', 'manager'].includes(
      scopeCtx.userRole,
    );
  }
}
