import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { PropertyGroupMembership } from '../../properties/entity/property-group-membership.entity';
import { ServiceGroupMembership } from '../../services/entity/service-group-membership.entity';
import { Property } from '../../properties/entity/property.entity';
import { TourismService } from '../../services/entity/tourism-service.entity';

/**
 * Represents a single scoped permission entry (from manager_permissions,
 * hyper_manager_permissions, or guest_permissions).
 */
export interface ScopedPerm {
  userId: number;
  backendPermissionKey: string;
  frontendPermissionKey: string | null;
  scope: string; // 'all' | 'properties' | 'services' | 'property_groups' | 'service_groups' | 'admins'
  properties: string[] | null;
  services: string[] | null;
  propertyGroups: string[] | null;
  serviceGroups: string[] | null;
  admins: number[] | null;
  isGranted: boolean;
  assignedById: number;
}

/**
 * The resolved IDs after scope resolution.
 * null means "no restriction" (global access).
 * empty array means "no access".
 */
export interface ResolvedScope {
  propertyIds: string[] | null;
  serviceIds: string[] | null;
}

@Injectable()
export class ScopeFilterService {
  private readonly logger = new Logger(ScopeFilterService.name);

  constructor(
    @InjectRepository(PropertyGroupMembership)
    private readonly propGroupMemberRepo: Repository<PropertyGroupMembership>,
    @InjectRepository(ServiceGroupMembership)
    private readonly svcGroupMemberRepo: Repository<ServiceGroupMembership>,
    @InjectRepository(Property)
    private readonly propertyRepo: Repository<Property>,
    @InjectRepository(TourismService)
    private readonly serviceRepo: Repository<TourismService>,
  ) {}

  /**
   * Resolve property IDs from scoped permissions for a specific backend permission key.
   * Returns null if scope is 'all' (no filtering needed).
   * Returns a unique list of property IDs otherwise.
   */
  async resolvePropertyIds(
    scopedPerms: ScopedPerm[],
    permissionKey: string,
  ): Promise<string[] | null> {
    const relevant = scopedPerms.filter(
      p => p.backendPermissionKey === permissionKey && p.isGranted,
    );

    if (relevant.length === 0) return [];

    // If any perm has scope 'all', return null (no filtering)
    if (relevant.some(p => p.scope === 'all')) return null;

    const ids = new Set<string>();

    for (const perm of relevant) {
      switch (perm.scope) {
        case 'properties':
          if (perm.properties) perm.properties.forEach(id => ids.add(id));
          break;

        case 'property_groups':
          if (perm.propertyGroups && perm.propertyGroups.length > 0) {
            const memberships = await this.propGroupMemberRepo.find({
              where: { groupId: In(perm.propertyGroups) },
            });
            memberships.forEach(m => ids.add(m.propertyId));
          }
          break;

        case 'services':
          // For service-scoped perms, we might need to find properties
          // linked to those services' providers
          break;

        case 'service_groups':
          // Service groups don't directly map to properties
          break;

        case 'admins':
          if (perm.admins && perm.admins.length > 0) {
            const props = await this.propertyRepo.find({
              where: { hostId: In(perm.admins) },
              select: ['id'],
            });
            props.forEach(p => ids.add(p.id));
          }
          break;
      }
    }

    return Array.from(ids);
  }

  /**
   * Resolve service IDs from scoped permissions for a specific backend permission key.
   * Returns null if scope is 'all' (no filtering needed).
   */
  async resolveServiceIds(
    scopedPerms: ScopedPerm[],
    permissionKey: string,
  ): Promise<string[] | null> {
    const relevant = scopedPerms.filter(
      p => p.backendPermissionKey === permissionKey && p.isGranted,
    );

    if (relevant.length === 0) return [];

    if (relevant.some(p => p.scope === 'all')) return null;

    const ids = new Set<string>();

    for (const perm of relevant) {
      switch (perm.scope) {
        case 'services':
          if (perm.services) perm.services.forEach(id => ids.add(id));
          break;

        case 'service_groups':
          if (perm.serviceGroups && perm.serviceGroups.length > 0) {
            const memberships = await this.svcGroupMemberRepo.find({
              where: { groupId: In(perm.serviceGroups) },
            });
            memberships.forEach(m => ids.add(m.serviceId));
          }
          break;

        case 'properties':
          // Properties don't directly map to services
          break;

        case 'property_groups':
          // Property groups don't directly map to services
          break;

        case 'admins':
          if (perm.admins && perm.admins.length > 0) {
            const svcs = await this.serviceRepo.find({
              where: { providerId: In(perm.admins) },
              select: ['id'],
            });
            svcs.forEach(s => ids.add(s.id));
          }
          break;
      }
    }

    return Array.from(ids);
  }

  /**
   * Resolve both property and service IDs for a given permission key.
   */
  async resolveScope(
    scopedPerms: ScopedPerm[],
    permissionKey: string,
  ): Promise<ResolvedScope> {
    const [propertyIds, serviceIds] = await Promise.all([
      this.resolvePropertyIds(scopedPerms, permissionKey),
      this.resolveServiceIds(scopedPerms, permissionKey),
    ]);
    return { propertyIds, serviceIds };
  }

  /**
   * Merge multiple resolved property ID lists (union, deduplicated).
   * null in any list means "all" → result is null.
   */
  mergePropertyIds(...lists: (string[] | null)[]): string[] | null {
    if (lists.some(l => l === null)) return null;
    const ids = new Set<string>();
    for (const list of lists) {
      if (list) list.forEach(id => ids.add(id));
    }
    return Array.from(ids);
  }

  /**
   * Merge multiple resolved service ID lists (union, deduplicated).
   */
  mergeServiceIds(...lists: (string[] | null)[]): string[] | null {
    if (lists.some(l => l === null)) return null;
    const ids = new Set<string>();
    for (const list of lists) {
      if (list) list.forEach(id => ids.add(id));
    }
    return Array.from(ids);
  }

  /**
   * Check if a specific resource ID is allowed by the scoped permissions.
   * Returns true if no restriction (null = all), or if the ID is in the list.
   */
  isAllowed(resolvedIds: string[] | null, resourceId: string): boolean {
    if (resolvedIds === null) return true; // No restriction
    return resolvedIds.includes(resourceId);
  }
}
