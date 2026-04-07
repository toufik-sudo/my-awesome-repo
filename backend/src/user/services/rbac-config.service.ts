import { Injectable, OnModuleInit, Logger, ForbiddenException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Redis from 'ioredis';
import { RbacBackendPermission, RbacScope } from '../entity/rbac-backend-permission.entity';
import { RbacFrontendPermission } from '../entity/rbac-frontend-permission.entity';
import { ManagerPermission } from '../entity/manager-permission.entity';
import { HyperManagerPermission } from '../entity/hyper-manager-permission.entity';
import { GuestPermission } from '../entity/guest-permission.entity';
import { AppRole } from '../entity/user.entity';
import { REDIS_CLIENT } from '../../infrastructure/redis/redis.constant';
import { EventsGateway } from '../../infrastructure/websocket/events.gateway';
import { generateBackendPermissionKey, type HttpMethod } from '../../rbac/utils/generate-backend-permission-key';
import { generateUiPermissionKey } from '../../rbac/utils/generate-ui-permission-key';

// ─── Redis keys ───────────────────────────────────────────────────────────────
const REDIS_KEY_BACKEND = 'rbac:backend:permissions';
const REDIS_KEY_FRONTEND = 'rbac:frontend:permissions';
const REDIS_KEY_MANAGER_PERMS = 'rbac:scoped:manager_permissions';
const REDIS_KEY_HYPER_PERMS = 'rbac:scoped:hyper_manager_permissions';
const REDIS_KEY_GUEST_PERMS = 'rbac:scoped:guest_permissions';
const REDIS_CHANNEL = 'rbac:updated';

// ─── Cache types ──────────────────────────────────────────────────────────────
interface CachedBackendPerm {
  user_roles: string[];
  scope: RbacScope;
  allowed: boolean;
  conditions: Record<string, any> | null;
  controller: string;
  endpoint: string;
  method: string;
  module: string;
  description: string | null;
}

interface CachedFrontendPerm {
  user_roles: string[];
  allowed: boolean;
  conditions: Record<string, any> | null;
  component: string;
  sub_view: string | null;
  element_type: string | null;
  action_name: string | null;
  module: string;
  description: string | null;
}

interface CachedScopedPerm {
  userId: number;
  backendPermissionKey: string;
  frontendPermissionKey: string | null;
  scope: string;
  properties: string[] | null;
  services: string[] | null;
  propertyGroups: string[] | null;
  serviceGroups: string[] | null;
  admins: number[] | null; // only for hyper_manager
  isGranted: boolean;
  assignedById: number;
}

const PROTECTED_PERMISSIONS: string[] = [];

@Injectable()
export class RbacConfigService implements OnModuleInit {
  private readonly logger = new Logger(RbacConfigService.name);

  /** permission_key → CachedBackendPerm */
  private backendCache = new Map<string, CachedBackendPerm>();
  /** permission_key → CachedFrontendPerm */
  private frontendCache = new Map<string, CachedFrontendPerm>();

  /** userId → CachedScopedPerm[] */
  private managerPermCache = new Map<number, CachedScopedPerm[]>();
  private hyperManagerPermCache = new Map<number, CachedScopedPerm[]>();
  private guestPermCache = new Map<number, CachedScopedPerm[]>();

  private loaded = false;
  private loadedFromRedis = false;
  private subscriber: Redis | null = null;

  constructor(
    @InjectRepository(RbacBackendPermission)
    private readonly backendRepo: Repository<RbacBackendPermission>,
    @InjectRepository(RbacFrontendPermission)
    private readonly frontendRepo: Repository<RbacFrontendPermission>,
    @InjectRepository(ManagerPermission)
    private readonly managerPermRepo: Repository<ManagerPermission>,
    @InjectRepository(HyperManagerPermission)
    private readonly hyperPermRepo: Repository<HyperManagerPermission>,
    @InjectRepository(GuestPermission)
    private readonly guestPermRepo: Repository<GuestPermission>,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
    private readonly eventsGateway: EventsGateway,
  ) {}

  async onModuleInit() {
    await this.loadAll();
    await this.subscribeToUpdates();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PUBLIC API — Permission Checks
  // ═══════════════════════════════════════════════════════════════════════════

  can(role: AppRole, permissionKey: string): boolean {
    const entry = this.backendCache.get(permissionKey);
    if (!entry) return false;
    if (!entry.allowed) return false;
    return entry.user_roles.includes(role);
  }

  canUI(role: AppRole, permissionKey: string): boolean {
    const entry = this.frontendCache.get(permissionKey);
    if (!entry) return true;
    if (!entry.allowed) return false;
    return entry.user_roles.includes(role);
  }

  getScope(permissionKey: string): RbacScope | null {
    return this.backendCache.get(permissionKey)?.scope ?? null;
  }

  getBackendPermissionKey(controller: string, endpoint: string, method: HttpMethod): string {
    return generateBackendPermissionKey(controller, endpoint, method);
  }

  getFrontendPermissions(role: AppRole): Record<string, boolean> {
    const result: Record<string, boolean> = {};
    for (const [key, val] of this.frontendCache.entries()) {
      result[key] = val.allowed && val.user_roles.includes(role);
    }
    return result;
  }

  getBackendPermissions(role: AppRole): Record<string, { allowed: boolean; scope: RbacScope }> {
    const result: Record<string, { allowed: boolean; scope: RbacScope }> = {};
    for (const [key, val] of this.backendCache.entries()) {
      if (val.user_roles.includes(role)) {
        result[key] = { allowed: val.allowed, scope: val.scope };
      }
    }
    return result;
  }

  getAllBackendPermissions(): CachedBackendPerm[] {
    return Array.from(this.backendCache.values());
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SCOPED PERMISSION CHECKS — manager / hyper_manager / guest
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Check if a manager has a scoped permission for a specific resource.
   */
  getManagerScopedPerms(userId: number): CachedScopedPerm[] {
    return this.managerPermCache.get(userId) || [];
  }

  getHyperManagerScopedPerms(userId: number): CachedScopedPerm[] {
    return this.hyperManagerPermCache.get(userId) || [];
  }

  getGuestScopedPerms(userId: number): CachedScopedPerm[] {
    return this.guestPermCache.get(userId) || [];
  }

  /**
   * Check if a user (by role) has a specific scoped permission for a resource.
   */
  hasScopedPermission(
    userId: number,
    role: AppRole,
    permissionKey: string,
    resourceType?: 'property' | 'service' | 'property_group' | 'service_group' | 'admin',
    resourceId?: string | number,
  ): boolean {
    let perms: CachedScopedPerm[] = [];

    if (role === 'manager') perms = this.managerPermCache.get(userId) || [];
    else if (role === 'hyper_manager') perms = this.hyperManagerPermCache.get(userId) || [];
    else if (role === 'guest') perms = this.guestPermCache.get(userId) || [];
    else return true; // Other roles don't use scoped perms

    const matching = perms.filter(p => p.backendPermissionKey === permissionKey && p.isGranted);
    if (matching.length === 0) return false;

    for (const perm of matching) {
      if (perm.scope === 'all') return true;

      if (!resourceType || !resourceId) return true; // No resource check needed

      const rid = String(resourceId);
      if (resourceType === 'property' && perm.scope === 'properties' && perm.properties?.includes(rid)) return true;
      if (resourceType === 'service' && perm.scope === 'services' && perm.services?.includes(rid)) return true;
      if (resourceType === 'property_group' && perm.scope === 'property_groups' && perm.propertyGroups?.includes(rid)) return true;
      if (resourceType === 'service_group' && perm.scope === 'service_groups' && perm.serviceGroups?.includes(rid)) return true;
      if (resourceType === 'admin' && perm.scope === 'admins' && perm.admins?.includes(Number(resourceId))) return true;
    }

    return false;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CRUD — Admin Panel
  // ═══════════════════════════════════════════════════════════════════════════

  async findAllBackend(): Promise<RbacBackendPermission[]> {
    return this.backendRepo.find({ order: { module: 'ASC', controller: 'ASC', endpoint: 'ASC' } });
  }

  async findAllFrontend(): Promise<RbacFrontendPermission[]> {
    return this.frontendRepo.find({ order: { module: 'ASC', component: 'ASC' } });
  }

  async updateBackendPermission(
    id: string,
    updates: Partial<Pick<RbacBackendPermission, 'allowed' | 'scope' | 'conditions' | 'user_roles'>>,
  ): Promise<RbacBackendPermission> {
    const perm = await this.backendRepo.findOneByOrFail({ id });
    if (updates.allowed === false && PROTECTED_PERMISSIONS.includes(perm.permission_key)) {
      throw new ForbiddenException(`Cannot disable protected permission: ${perm.permission_key}`);
    }
    await this.backendRepo.update(id, updates);
    await this.syncAndBroadcast();
    return this.backendRepo.findOneByOrFail({ id });
  }

  async updateFrontendPermission(
    id: string,
    updates: Partial<Pick<RbacFrontendPermission, 'allowed' | 'conditions' | 'user_roles'>>,
  ): Promise<RbacFrontendPermission> {
    await this.frontendRepo.update(id, updates);
    await this.syncAndBroadcast();
    return this.frontendRepo.findOneByOrFail({ id });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // BULK UPDATE
  // ═══════════════════════════════════════════════════════════════════════════

  async bulkUpdateBackend(
    updates: Array<{ permission_key: string; allowed?: boolean; scope?: RbacScope; user_roles?: string[] }>,
  ): Promise<{ updated: number; errors: string[] }> {
    const errors: string[] = [];
    let updated = 0;
    for (const u of updates) {
      try {
        const perm = await this.backendRepo.findOneBy({ permission_key: u.permission_key });
        if (!perm) { errors.push(`Not found: ${u.permission_key}`); continue; }
        const updateData: any = {};
        if (u.allowed !== undefined) updateData.allowed = u.allowed;
        if (u.scope) updateData.scope = u.scope;
        if (u.user_roles) updateData.user_roles = u.user_roles;
        await this.backendRepo.update(perm.id, updateData);
        updated++;
      } catch (e: any) { errors.push(`${u.permission_key} → ${e.message}`); }
    }
    if (updated > 0) await this.syncAndBroadcast();
    return { updated, errors };
  }

  async bulkUpdateFrontend(
    updates: Array<{ permission_key: string; allowed?: boolean; user_roles?: string[] }>,
  ): Promise<{ updated: number; errors: string[] }> {
    const errors: string[] = [];
    let updated = 0;
    for (const u of updates) {
      try {
        const perm = await this.frontendRepo.findOneBy({ permission_key: u.permission_key });
        if (!perm) { errors.push(`Not found: ${u.permission_key}`); continue; }
        const updateData: any = {};
        if (u.allowed !== undefined) updateData.allowed = u.allowed;
        if (u.user_roles) updateData.user_roles = u.user_roles;
        await this.frontendRepo.update(perm.id, updateData);
        updated++;
      } catch (e: any) { errors.push(`${u.permission_key} → ${e.message}`); }
    }
    if (updated > 0) await this.syncAndBroadcast();
    return { updated, errors };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CREATE
  // ═══════════════════════════════════════════════════════════════════════════

  async createBackendPermission(data: {
    controller: string; endpoint: string; method: string; user_roles: string[];
    scope?: RbacScope; allowed?: boolean; conditions?: Record<string, any>;
    module?: string; description?: string; created_by?: string;
  }): Promise<RbacBackendPermission> {
    const permissionKey = generateBackendPermissionKey(data.controller, data.endpoint, data.method as HttpMethod);
    const existing = await this.backendRepo.findOneBy({ permission_key: permissionKey });
    if (existing) throw new ForbiddenException(`Permission '${permissionKey}' already exists.`);
    const perm = this.backendRepo.create({
      permission_key: permissionKey,
      controller: data.controller, endpoint: data.endpoint, method: data.method,
      user_roles: data.user_roles, scope: data.scope || 'global',
      allowed: data.allowed !== undefined ? data.allowed : true,
      conditions: data.conditions || null, module: data.module || 'general',
      description: data.description || null, created_by: data.created_by || null,
    });
    const saved = await this.backendRepo.save(perm);
    await this.syncAndBroadcast();
    return saved;
  }

  async createFrontendPermission(data: {
    component: string; sub_view?: string; element_type?: string; action_name?: string;
    user_roles: string[]; allowed?: boolean; conditions?: Record<string, any>;
    module?: string; description?: string; created_by?: string;
  }): Promise<RbacFrontendPermission> {
    const permissionKey = generateUiPermissionKey(data.component, data.sub_view, data.element_type, data.action_name);
    const existing = await this.frontendRepo.findOneBy({ permission_key: permissionKey });
    if (existing) throw new ForbiddenException(`Frontend permission '${permissionKey}' already exists.`);
    const perm = this.frontendRepo.create({
      permission_key: permissionKey,
      component: data.component, sub_view: data.sub_view || null,
      element_type: data.element_type || null, action_name: data.action_name || null,
      user_roles: data.user_roles, allowed: data.allowed !== undefined ? data.allowed : true,
      conditions: data.conditions || null, module: data.module || 'general',
      description: data.description || null, created_by: data.created_by || null,
    });
    const saved = await this.frontendRepo.save(perm);
    await this.syncAndBroadcast();
    return saved;
  }

  getRoles(): AppRole[] {
    return ['hyper_admin', 'hyper_manager', 'admin', 'manager', 'user', 'guest'];
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CACHE MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════════

  async reload(): Promise<void> {
    await this.loadAll();
    this.logger.log('RBAC cache reloaded (including scoped permissions)');
  }

  isLoaded(): boolean { return this.loaded; }
  isRedisLoaded(): boolean { return this.loadedFromRedis; }

  // ═══════════════════════════════════════════════════════════════════════════
  // PRIVATE — Loading, Sync
  // ═══════════════════════════════════════════════════════════════════════════

  private async loadAll(): Promise<void> {
    this.loadedFromRedis = false;

    try {
      const [rawBackend, rawFrontend, rawManager, rawHyper, rawGuest] = await Promise.all([
        this.redis.get(REDIS_KEY_BACKEND),
        this.redis.get(REDIS_KEY_FRONTEND),
        this.redis.get(REDIS_KEY_MANAGER_PERMS),
        this.redis.get(REDIS_KEY_HYPER_PERMS),
        this.redis.get(REDIS_KEY_GUEST_PERMS),
      ]);

      if (rawBackend && rawFrontend) {
        this.rebuildFromJson(
          JSON.parse(rawBackend),
          JSON.parse(rawFrontend),
          rawManager ? JSON.parse(rawManager) : [],
          rawHyper ? JSON.parse(rawHyper) : [],
          rawGuest ? JSON.parse(rawGuest) : [],
        );
        this.loadedFromRedis = true;
        this.logger.log('RBAC loaded from Redis cache (all 5 tables)');
      }
    } catch (err: any) {
      this.logger.warn(`Redis read failed, falling back to DB: ${err.message}`);
    }

    if (!this.loadedFromRedis) {
      await this.loadFromDb();
    }
  }

  private async loadFromDb(): Promise<void> {
    const [backendPerms, frontendPerms, managerPerms, hyperPerms, guestPerms] = await Promise.all([
      this.backendRepo.find(),
      this.frontendRepo.find(),
      this.managerPermRepo.find({ where: { isGranted: true } }),
      this.hyperPermRepo.find({ where: { isGranted: true } }),
      this.guestPermRepo.find({ where: { isGranted: true } }),
    ]);

    // Build backend cache
    const newBackend = new Map<string, CachedBackendPerm>();
    for (const p of backendPerms) {
      newBackend.set(p.permission_key, {
        user_roles: p.user_roles, scope: p.scope, allowed: p.allowed,
        conditions: p.conditions, controller: p.controller, endpoint: p.endpoint,
        method: p.method, module: p.module, description: p.description,
      });
    }

    // Build frontend cache
    const newFrontend = new Map<string, CachedFrontendPerm>();
    for (const p of frontendPerms) {
      newFrontend.set(p.permission_key, {
        user_roles: p.user_roles, allowed: p.allowed, conditions: p.conditions,
        component: p.component, sub_view: p.sub_view, element_type: p.element_type,
        action_name: p.action_name, module: p.module, description: p.description,
      });
    }

    // Build scoped permission caches
    this.managerPermCache = this.buildScopedCache(managerPerms.map(p => ({
      userId: p.managerId, ...this.toScopedPerm(p),
    })));

    this.hyperManagerPermCache = this.buildScopedCache(hyperPerms.map(p => ({
      userId: p.hyperManagerId,
      backendPermissionKey: p.backendPermissionKey,
      frontendPermissionKey: p.frontendPermissionKey,
      scope: p.scope,
      properties: p.properties,
      services: p.services,
      propertyGroups: p.propertyGroups,
      serviceGroups: p.serviceGroups,
      admins: p.admins,
      isGranted: p.isGranted,
      assignedById: p.assignedById,
    })));

    this.guestPermCache = this.buildScopedCache(guestPerms.map(p => ({
      userId: p.guestId, ...this.toScopedPerm(p),
    })));

    this.backendCache = newBackend;
    this.frontendCache = newFrontend;
    this.loaded = true;

    await this.persistToRedis(backendPerms, frontendPerms, managerPerms, hyperPerms, guestPerms);
    this.logger.log(
      `RBAC loaded from DB: ${backendPerms.length} backend + ${frontendPerms.length} frontend + ` +
      `${managerPerms.length} manager + ${hyperPerms.length} hyper + ${guestPerms.length} guest scoped perms`,
    );
  }

  private toScopedPerm(p: ManagerPermission | GuestPermission): Omit<CachedScopedPerm, 'userId'> {
    return {
      backendPermissionKey: p.backendPermissionKey,
      frontendPermissionKey: p.frontendPermissionKey,
      scope: p.scope,
      properties: p.properties,
      services: p.services,
      propertyGroups: p.propertyGroups,
      serviceGroups: p.serviceGroups,
      admins: null,
      isGranted: p.isGranted,
      assignedById: p.assignedById,
    };
  }

  private buildScopedCache(entries: (CachedScopedPerm & { userId: number })[]): Map<number, CachedScopedPerm[]> {
    const cache = new Map<number, CachedScopedPerm[]>();
    for (const entry of entries) {
      const { userId, ...rest } = entry;
      const existing = cache.get(userId) || [];
      existing.push({ userId, ...rest });
      cache.set(userId, existing);
    }
    return cache;
  }

  private rebuildFromJson(
    backendPerms: any[], frontendPerms: any[],
    managerPerms: any[], hyperPerms: any[], guestPerms: any[],
  ): void {
    const newBackend = new Map<string, CachedBackendPerm>();
    for (const p of backendPerms) {
      newBackend.set(p.permission_key, {
        user_roles: p.user_roles, scope: p.scope as RbacScope, allowed: p.allowed,
        conditions: p.conditions, controller: p.controller, endpoint: p.endpoint,
        method: p.method, module: p.module, description: p.description,
      });
    }
    const newFrontend = new Map<string, CachedFrontendPerm>();
    for (const p of frontendPerms) {
      newFrontend.set(p.permission_key, {
        user_roles: p.user_roles, allowed: p.allowed, conditions: p.conditions,
        component: p.component, sub_view: p.sub_view, element_type: p.element_type,
        action_name: p.action_name, module: p.module, description: p.description,
      });
    }
    this.backendCache = newBackend;
    this.frontendCache = newFrontend;

    this.managerPermCache = this.buildScopedCache(managerPerms);
    this.hyperManagerPermCache = this.buildScopedCache(hyperPerms);
    this.guestPermCache = this.buildScopedCache(guestPerms);
    this.loaded = true;
  }

  private async persistToRedis(
    backendPerms: RbacBackendPermission[], frontendPerms: RbacFrontendPermission[],
    managerPerms: ManagerPermission[], hyperPerms: HyperManagerPermission[], guestPerms: GuestPermission[],
  ): Promise<void> {
    try {
      const backendJson = backendPerms.map(p => ({
        permission_key: p.permission_key, user_roles: p.user_roles, scope: p.scope,
        allowed: p.allowed, conditions: p.conditions, controller: p.controller,
        endpoint: p.endpoint, method: p.method, module: p.module, description: p.description,
      }));
      const frontendJson = frontendPerms.map(p => ({
        permission_key: p.permission_key, user_roles: p.user_roles, allowed: p.allowed,
        conditions: p.conditions, component: p.component, sub_view: p.sub_view,
        element_type: p.element_type, action_name: p.action_name, module: p.module, description: p.description,
      }));
      const managerJson = managerPerms.map(p => ({
        userId: p.managerId, backendPermissionKey: p.backendPermissionKey,
        frontendPermissionKey: p.frontendPermissionKey, scope: p.scope,
        properties: p.properties, services: p.services, propertyGroups: p.propertyGroups,
        serviceGroups: p.serviceGroups, admins: null, isGranted: p.isGranted, assignedById: p.assignedById,
      }));
      const hyperJson = hyperPerms.map(p => ({
        userId: p.hyperManagerId, backendPermissionKey: p.backendPermissionKey,
        frontendPermissionKey: p.frontendPermissionKey, scope: p.scope,
        properties: p.properties, services: p.services, propertyGroups: p.propertyGroups,
        serviceGroups: p.serviceGroups, admins: p.admins, isGranted: p.isGranted, assignedById: p.assignedById,
      }));
      const guestJson = guestPerms.map(p => ({
        userId: p.guestId, backendPermissionKey: p.backendPermissionKey,
        frontendPermissionKey: p.frontendPermissionKey, scope: p.scope,
        properties: p.properties, services: p.services, propertyGroups: p.propertyGroups,
        serviceGroups: p.serviceGroups, admins: null, isGranted: p.isGranted, assignedById: p.assignedById,
      }));

      await Promise.all([
        this.redis.set(REDIS_KEY_BACKEND, JSON.stringify(backendJson), 'EX', 3600),
        this.redis.set(REDIS_KEY_FRONTEND, JSON.stringify(frontendJson), 'EX', 3600),
        this.redis.set(REDIS_KEY_MANAGER_PERMS, JSON.stringify(managerJson), 'EX', 3600),
        this.redis.set(REDIS_KEY_HYPER_PERMS, JSON.stringify(hyperJson), 'EX', 3600),
        this.redis.set(REDIS_KEY_GUEST_PERMS, JSON.stringify(guestJson), 'EX', 3600),
      ]);
    } catch (err: any) {
      this.logger.warn(`Redis persist failed: ${err.message}`);
    }
  }

  private async syncAndBroadcast(): Promise<void> {
    await this.loadFromDb();
    try {
      await this.redis.publish(REDIS_CHANNEL, JSON.stringify({ ts: Date.now() }));
    } catch (err: any) {
      this.logger.warn(`Redis publish failed: ${err.message}`);
    }
    this.eventsGateway.broadcast('rbac:updated', { timestamp: Date.now() });
    this.logger.log('RBAC synced and broadcasted');
  }

  private async subscribeToUpdates(): Promise<void> {
    try {
      this.subscriber = this.redis.duplicate();
      await this.subscriber.subscribe(REDIS_CHANNEL);
      this.subscriber.on('message', async (channel: string) => {
        if (channel === REDIS_CHANNEL) {
          this.logger.log('RBAC update received via Redis pub/sub — reloading');
          await this.loadFromDb();
        }
      });
      this.logger.log('RBAC Redis subscriber connected');
    } catch (err: any) {
      this.logger.warn(`Redis subscribe failed: ${err.message}. Using DB-only mode.`);
    }
  }
}
