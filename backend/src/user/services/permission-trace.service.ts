import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { RbacConfigService } from './rbac-config.service';
import { RolesService } from './roles.service';
import { ScopeFilterService, ScopedPerm } from '../../rbac/services/scope-filter.service';
import { Property } from '../../properties/entity/property.entity';
import { TourismService } from '../../services/entity/tourism-service.entity';
import { PropertyGroup } from '../../properties/entity/property-group.entity';
import { ServiceGroup } from '../../services/entity/service-group.entity';
import { User, AppRole } from '../entity/user.entity';

export type TraceResourceKind = 'property' | 'service';

export interface PermissionTraceStep {
  step: number;
  label: string;
  detail: string;
  data?: Record<string, any>;
}

export interface PermissionBranchEvaluation {
  scope: string;
  permissionKey: string;
  assignedById: number | null;
  branch: 'explicit-properties' | 'explicit-services' | 'explicit-property-groups'
    | 'explicit-service-groups' | 'explicit-admins' | 'fallback-inherit-inviter'
    | 'all-platform-wide' | 'no-match';
  reason: string;
  contributesIds: string[];
  inviterIds?: number[];
}

export interface PermissionTraceResult {
  userId: number;
  role: AppRole;
  permissionKey: string;
  resourceKind: TraceResourceKind;
  resourceId: string | null;
  /** null  → unrestricted; []  → no access; [...] → restricted set */
  effectiveIds: string[] | null;
  allowed: boolean;
  /** True when at least one branch took the inviter-fallback path. */
  fellBackToInviter: boolean;
  steps: PermissionTraceStep[];
  branches: PermissionBranchEvaluation[];
  /** Summary one-liner safe to render in a UI badge / tooltip. */
  summary: string;
}

@Injectable()
export class PermissionTraceService {
  private readonly logger = new Logger(PermissionTraceService.name);

  constructor(
    private readonly rbacConfig: RbacConfigService,
    private readonly rolesService: RolesService,
    private readonly scopeFilter: ScopeFilterService,
    @InjectRepository(Property)
    private readonly propertyRepo: Repository<Property>,
    @InjectRepository(TourismService)
    private readonly serviceRepo: Repository<TourismService>,
    @InjectRepository(PropertyGroup)
    private readonly propGroupRepo: Repository<PropertyGroup>,
    @InjectRepository(ServiceGroup)
    private readonly svcGroupRepo: Repository<ServiceGroup>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async trace(input: {
    userId: number;
    permissionKey: string;
    resourceKind: TraceResourceKind;
    resourceId?: string | null;
  }): Promise<PermissionTraceResult> {
    const { userId, permissionKey, resourceKind } = input;
    const resourceId = input.resourceId ?? null;

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User ${userId} not found`);
    const role = user.getRole();

    const steps: PermissionTraceStep[] = [];
    const branches: PermissionBranchEvaluation[] = [];

    steps.push({
      step: 1,
      label: 'Resolve role',
      detail: `User #${userId} resolved as role '${role}'.`,
      data: { role },
    });

    // ─── 1. hyper_admin → unrestricted
    if (role === 'hyper_admin') {
      steps.push({
        step: 2,
        label: 'hyper_admin bypass',
        detail: 'Role hyper_admin grants unrestricted access; no scope evaluation.',
      });
      return this.finalize({
        userId, role, permissionKey, resourceKind, resourceId,
        effectiveIds: null, fellBackToInviter: false, steps, branches,
        summary: 'Unrestricted (hyper_admin).',
      });
    }

    // ─── 2. admin → owns its inventory
    if (role === 'admin') {
      const ids = resourceKind === 'property'
        ? (await this.propertyRepo.find({ where: { hostId: userId }, select: ['id'] })).map(r => r.id)
        : (await this.serviceRepo.find({ where: { providerId: userId }, select: ['id'] })).map(r => r.id);
      steps.push({
        step: 2,
        label: 'admin ownership',
        detail: `Admin owns ${ids.length} ${resourceKind}(s); access limited to those.`,
        data: { count: ids.length },
      });
      return this.finalize({
        userId, role, permissionKey, resourceKind, resourceId,
        effectiveIds: ids, fellBackToInviter: false, steps, branches,
        summary: `Explicit ownership: ${ids.length} ${resourceKind}(s).`,
      });
    }

    // ─── 3. plain user / guest with no perms / etc.
    if (role !== 'manager' && role !== 'hyper_manager' && role !== 'guest') {
      steps.push({
        step: 2,
        label: 'role bypass',
        detail: `Role '${role}' is not scope-restricted by RBAC; access depends on controller-level public rules.`,
      });
      return this.finalize({
        userId, role, permissionKey, resourceKind, resourceId,
        effectiveIds: null, fellBackToInviter: false, steps, branches,
        summary: `Role '${role}' is not scope-restricted.`,
      });
    }

    // ─── 4. scoped roles (manager / hyper_manager / guest)
    const scopedPerms: ScopedPerm[] = role === 'manager'
      ? this.rbacConfig.getManagerScopedPerms(userId) as any
      : role === 'hyper_manager'
      ? this.rbacConfig.getHyperManagerScopedPerms(userId) as any
      : this.rbacConfig.getGuestScopedPerms(userId) as any;

    steps.push({
      step: 2,
      label: 'load scoped permissions',
      detail: `Loaded ${scopedPerms.length} scoped permission(s) for ${role}.`,
      data: { totalScopedPerms: scopedPerms.length },
    });

    const relevant = scopedPerms.filter(
      p => p.backendPermissionKey === permissionKey && p.isGranted,
    );
    steps.push({
      step: 3,
      label: 'filter relevant',
      detail: `${relevant.length} scoped permission(s) match key='${permissionKey}' and isGranted=true.`,
    });

    if (relevant.length === 0) {
      return this.finalize({
        userId, role, permissionKey, resourceKind, resourceId,
        effectiveIds: [], fellBackToInviter: false, steps, branches,
        summary: `No granted scoped permission for '${permissionKey}'.`,
      });
    }

    // hyper_manager + scope='all' → platform-wide.
    if (role === 'hyper_manager' && relevant.some(p => p.scope === 'all')) {
      branches.push({
        scope: 'all',
        permissionKey,
        assignedById: relevant.find(p => p.scope === 'all')?.assignedById ?? null,
        branch: 'all-platform-wide',
        reason: 'hyper_manager with scope=all → unrestricted.',
        contributesIds: [],
      });
      return this.finalize({
        userId, role, permissionKey, resourceKind, resourceId,
        effectiveIds: null, fellBackToInviter: false, steps, branches,
        summary: 'hyper_manager scope=all → unrestricted.',
      });
    }

    // ─── 5. evaluate each granted permission branch
    const collectedIds = new Set<string>();
    let fellBack = false;
    const inheritFromInviters = new Set<number>();
    const inviterMapByPerm = new Map<number, number>(); // assignedById per fallback

    for (const perm of relevant) {
      const branch = await this.evaluateBranch(perm, resourceKind);
      branches.push(branch);
      branch.contributesIds.forEach(id => collectedIds.add(id));
      if (branch.branch === 'fallback-inherit-inviter' && perm.assignedById) {
        fellBack = true;
        inheritFromInviters.add(perm.assignedById);
        inviterMapByPerm.set(perm.assignedById, perm.assignedById);
      }
    }

    // Resolve inviter inheritance once for all collected inviters
    if (inheritFromInviters.size > 0) {
      const inviterIds = Array.from(inheritFromInviters);
      const ids = resourceKind === 'property'
        ? (await this.propertyRepo.find({ where: { hostId: In(inviterIds) }, select: ['id'] })).map(r => r.id)
        : (await this.serviceRepo.find({ where: { providerId: In(inviterIds) }, select: ['id'] })).map(r => r.id);
      ids.forEach(id => collectedIds.add(id));
      steps.push({
        step: 4,
        label: 'inviter fallback',
        detail: `Inheriting full ${resourceKind} inventory from inviter admin(s) [${inviterIds.join(', ')}] → +${ids.length} id(s).`,
        data: { inviterIds, inheritedCount: ids.length },
      });
      // Annotate the fallback branches with the resolved counts.
      branches.forEach(b => {
        if (b.branch === 'fallback-inherit-inviter') {
          b.inviterIds = inviterIds;
        }
      });
    }

    const effectiveIds = Array.from(collectedIds);
    const summary = fellBack
      ? `Inherited from inviter (fallback) — ${effectiveIds.length} ${resourceKind}(s).`
      : `Explicit scope grants — ${effectiveIds.length} ${resourceKind}(s).`;

    return this.finalize({
      userId, role, permissionKey, resourceKind, resourceId,
      effectiveIds, fellBackToInviter: fellBack, steps, branches, summary,
    });
  }

  // ─── helpers ───────────────────────────────────────────────────────────

  private async evaluateBranch(
    perm: ScopedPerm,
    resourceKind: TraceResourceKind,
  ): Promise<PermissionBranchEvaluation> {
    const base = {
      scope: perm.scope,
      permissionKey: perm.backendPermissionKey,
      assignedById: perm.assignedById ?? null,
    };

    if (resourceKind === 'property') {
      switch (perm.scope) {
        case 'properties':
          if (perm.properties && perm.properties.length > 0) {
            return { ...base, branch: 'explicit-properties',
              reason: `Explicit property IDs (${perm.properties.length}).`,
              contributesIds: [...perm.properties] };
          }
          break;
        case 'property_groups':
          if (perm.propertyGroups && perm.propertyGroups.length > 0) {
            const groups = await this.propGroupRepo.find({
              where: { id: In(perm.propertyGroups) }, relations: ['properties'],
            });
            const ids: string[] = [];
            groups.forEach(g => g.properties?.forEach(p => ids.push(p.id)));
            return { ...base, branch: 'explicit-property-groups',
              reason: `Explicit property groups → ${ids.length} property(ies).`,
              contributesIds: ids };
          }
          break;
        case 'admins':
          if (perm.admins && perm.admins.length > 0) {
            const props = await this.propertyRepo.find({
              where: { hostId: In(perm.admins) }, select: ['id'],
            });
            return { ...base, branch: 'explicit-admins',
              reason: `Targeted admin(s) [${perm.admins.join(', ')}] → ${props.length} property(ies).`,
              contributesIds: props.map(p => p.id) };
          }
          break;
      }
    } else {
      switch (perm.scope) {
        case 'services':
          if (perm.services && perm.services.length > 0) {
            return { ...base, branch: 'explicit-services',
              reason: `Explicit service IDs (${perm.services.length}).`,
              contributesIds: [...perm.services] };
          }
          break;
        case 'service_groups':
          if (perm.serviceGroups && perm.serviceGroups.length > 0) {
            const groups = await this.svcGroupRepo.find({
              where: { id: In(perm.serviceGroups) }, relations: ['services'],
            });
            const ids: string[] = [];
            groups.forEach(g => g.services?.forEach(s => ids.push(s.id)));
            return { ...base, branch: 'explicit-service-groups',
              reason: `Explicit service groups → ${ids.length} service(s).`,
              contributesIds: ids };
          }
          break;
        case 'admins':
          if (perm.admins && perm.admins.length > 0) {
            const svcs = await this.serviceRepo.find({
              where: { providerId: In(perm.admins) }, select: ['id'],
            });
            return { ...base, branch: 'explicit-admins',
              reason: `Targeted admin(s) [${perm.admins.join(', ')}] → ${svcs.length} service(s).`,
              contributesIds: svcs.map(s => s.id) };
          }
          break;
      }
    }

    if (perm.assignedById) {
      return {
        ...base, branch: 'fallback-inherit-inviter',
        reason: `Permission scope='${perm.scope}' has no explicit ${resourceKind} target — inheriting inviter admin #${perm.assignedById}'s full inventory.`,
        contributesIds: [],
      };
    }

    return {
      ...base, branch: 'no-match',
      reason: `Permission scope='${perm.scope}' has no explicit target and no inviter to inherit from.`,
      contributesIds: [],
    };
  }

  private finalize(args: Omit<PermissionTraceResult, 'allowed'>): PermissionTraceResult {
    const allowed = args.effectiveIds === null
      ? true
      : args.resourceId
      ? args.effectiveIds.includes(args.resourceId)
      : args.effectiveIds.length > 0;
    return { ...args, allowed };
  }
}
