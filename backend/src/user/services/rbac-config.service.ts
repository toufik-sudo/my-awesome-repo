import { Injectable, OnModuleInit, Logger, ForbiddenException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Redis from 'ioredis';
import { RbacBackendPermission, RbacScope } from '../entity/rbac-backend-permission.entity';
import { RbacFrontendPermission } from '../entity/rbac-frontend-permission.entity';
import { AppRole } from '../entity/user.entity';
import { REDIS_CLIENT } from '../../infrastructure/redis/redis.constant';
import { EventsGateway } from '../../infrastructure/websocket/events.gateway';
import { generateBackendPermissionKey, type HttpMethod } from '../../rbac/utils/generate-backend-permission-key';
import { generateUiPermissionKey } from '../../rbac/utils/generate-ui-permission-key';

// ─── Redis keys ───────────────────────────────────────────────────────────────
const REDIS_KEY_BACKEND = 'rbac:backend:permissions';
const REDIS_KEY_FRONTEND = 'rbac:frontend:permissions';
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

// ─── Protected permissions (cannot be disabled) ──────────────────────────────
const PROTECTED_PERMISSIONS: string[] = [];

@Injectable()
export class RbacConfigService implements OnModuleInit {
  private readonly logger = new Logger(RbacConfigService.name);

  /** permission_key → CachedBackendPerm */
  private backendCache = new Map<string, CachedBackendPerm>();
  /** permission_key → CachedFrontendPerm */
  private frontendCache = new Map<string, CachedFrontendPerm>();

  private loaded = false;
  private subscriber: Redis | null = null;

  constructor(
    @InjectRepository(RbacBackendPermission)
    private readonly backendRepo: Repository<RbacBackendPermission>,
    @InjectRepository(RbacFrontendPermission)
    private readonly frontendRepo: Repository<RbacFrontendPermission>,
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

  /**
   * Check if a role is allowed for a backend permission key.
   * The permission_key is generated via generateBackendPermissionKey(controller, endpoint, method).
   */
  can(role: AppRole, permissionKey: string): boolean {
    const entry = this.backendCache.get(permissionKey);
    if (!entry) return false;
    if (!entry.allowed) return false;
    return entry.user_roles.includes(role);
  }

  /**
   * Check if a role can see/use a frontend UI element.
   * The permission_key is generated via generateUiPermissionKey(component, subView, element, action).
   */
  canUI(role: AppRole, permissionKey: string): boolean {
    const entry = this.frontendCache.get(permissionKey);
    if (!entry) return true; // Default allow if not configured
    if (!entry.allowed) return false;
    return entry.user_roles.includes(role);
  }

  /**
   * Get scope for a backend permission.
   */
  getScope(permissionKey: string): RbacScope | null {
    const entry = this.backendCache.get(permissionKey);
    return entry?.scope ?? null;
  }

  /**
   * Get backend permission key from controller/endpoint/method.
   * Uses cache first, falls back to generation.
   */
  getBackendPermissionKey(controller: string, endpoint: string, method: HttpMethod): string {
    return generateBackendPermissionKey(controller, endpoint, method);
  }

  /**
   * Get all frontend permissions for a role (used by frontend at login).
   * Returns map of permission_key → boolean
   */
  getFrontendPermissions(role: AppRole): Record<string, boolean> {
    const result: Record<string, boolean> = {};
    for (const [key, val] of this.frontendCache.entries()) {
      result[key] = val.allowed && val.user_roles.includes(role);
    }
    return result;
  }

  /**
   * Get all backend permissions for a role.
   * Returns map of permission_key → { allowed, scope }
   */
  getBackendPermissions(role: AppRole): Record<string, { allowed: boolean; scope: RbacScope }> {
    const result: Record<string, { allowed: boolean; scope: RbacScope }> = {};
    for (const [key, val] of this.backendCache.entries()) {
      if (val.user_roles.includes(role)) {
        result[key] = { allowed: val.allowed, scope: val.scope };
      }
    }
    return result;
  }

  /**
   * Get all backend permissions as flat list (for admin panel).
   */
  getAllBackendPermissions(): CachedBackendPerm[] {
    return Array.from(this.backendCache.values());
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
        if (!perm) {
          errors.push(`Not found: ${u.permission_key}`);
          continue;
        }
        const updateData: any = {};
        if (u.allowed !== undefined) updateData.allowed = u.allowed;
        if (u.scope) updateData.scope = u.scope;
        if (u.user_roles) updateData.user_roles = u.user_roles;
        await this.backendRepo.update(perm.id, updateData);
        updated++;
      } catch (e: any) {
        errors.push(`${u.permission_key} → ${e.message}`);
      }
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
        if (!perm) {
          errors.push(`Not found: ${u.permission_key}`);
          continue;
        }
        const updateData: any = {};
        if (u.allowed !== undefined) updateData.allowed = u.allowed;
        if (u.user_roles) updateData.user_roles = u.user_roles;
        await this.frontendRepo.update(perm.id, updateData);
        updated++;
      } catch (e: any) {
        errors.push(`${u.permission_key} → ${e.message}`);
      }
    }

    if (updated > 0) await this.syncAndBroadcast();
    return { updated, errors };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CREATE — New Permissions
  // ═══════════════════════════════════════════════════════════════════════════

  async createBackendPermission(data: {
    controller: string;
    endpoint: string;
    method: string;
    user_roles: string[];
    scope?: RbacScope;
    allowed?: boolean;
    conditions?: Record<string, any>;
    module?: string;
    description?: string;
    created_by?: string;
  }): Promise<RbacBackendPermission> {
    const permissionKey = generateBackendPermissionKey(data.controller, data.endpoint, data.method as HttpMethod);
    const existing = await this.backendRepo.findOneBy({ permission_key: permissionKey });
    if (existing) {
      throw new ForbiddenException(`Permission '${permissionKey}' already exists.`);
    }
    const perm = this.backendRepo.create({
      permission_key: permissionKey,
      controller: data.controller,
      endpoint: data.endpoint,
      method: data.method,
      user_roles: data.user_roles,
      scope: data.scope || 'global',
      allowed: data.allowed !== undefined ? data.allowed : true,
      conditions: data.conditions || null,
      module: data.module || 'general',
      description: data.description || null,
      created_by: data.created_by || null,
    });
    const saved = await this.backendRepo.save(perm);
    await this.syncAndBroadcast();
    return saved;
  }

  async createFrontendPermission(data: {
    component: string;
    sub_view?: string;
    element_type?: string;
    action_name?: string;
    user_roles: string[];
    allowed?: boolean;
    conditions?: Record<string, any>;
    module?: string;
    description?: string;
    created_by?: string;
  }): Promise<RbacFrontendPermission> {
    const permissionKey = generateUiPermissionKey(data.component, data.sub_view, data.element_type, data.action_name);
    const existing = await this.frontendRepo.findOneBy({ permission_key: permissionKey });
    if (existing) {
      throw new ForbiddenException(`Frontend permission '${permissionKey}' already exists.`);
    }
    const perm = this.frontendRepo.create({
      permission_key: permissionKey,
      component: data.component,
      sub_view: data.sub_view || null,
      element_type: data.element_type || null,
      action_name: data.action_name || null,
      user_roles: data.user_roles,
      allowed: data.allowed !== undefined ? data.allowed : true,
      conditions: data.conditions || null,
      module: data.module || 'general',
      description: data.description || null,
      created_by: data.created_by || null,
    });
    const saved = await this.frontendRepo.save(perm);
    await this.syncAndBroadcast();
    return saved;
  }

  /** Get all available roles */
  getRoles(): AppRole[] {
    return ['hyper_admin', 'hyper_manager', 'admin', 'manager', 'user', 'guest'];
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CACHE MANAGEMENT — Redis + Memory
  // ═══════════════════════════════════════════════════════════════════════════

  async reload(): Promise<void> {
    await this.loadAll();
    this.logger.log('RBAC cache reloaded');
  }

  isLoaded(): boolean {
    return this.loaded;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PRIVATE — Loading, Sync
  // ═══════════════════════════════════════════════════════════════════════════

  private async loadAll(): Promise<void> {
    let loadedFromRedis = false;

    try {
      const [rawBackend, rawFrontend] = await Promise.all([
        this.redis.get(REDIS_KEY_BACKEND),
        this.redis.get(REDIS_KEY_FRONTEND),
      ]);

      if (rawBackend && rawFrontend) {
        this.rebuildFromJson(JSON.parse(rawBackend), JSON.parse(rawFrontend));
        loadedFromRedis = true;
        this.logger.log('RBAC loaded from Redis cache');
      }
    } catch (err: any) {
      this.logger.warn(`Redis read failed, falling back to DB: ${err.message}`);
    }

    if (!loadedFromRedis) {
      await this.loadFromDb();
    }
  }

  private async loadFromDb(): Promise<void> {
    const [backendPerms, frontendPerms] = await Promise.all([
      this.backendRepo.find(),
      this.frontendRepo.find(),
    ]);

    const newBackend = new Map<string, CachedBackendPerm>();
    for (const p of backendPerms) {
      newBackend.set(p.permission_key, {
        user_roles: p.user_roles,
        scope: p.scope,
        allowed: p.allowed,
        conditions: p.conditions,
        controller: p.controller,
        endpoint: p.endpoint,
        method: p.method,
        module: p.module,
        description: p.description,
      });
    }

    const newFrontend = new Map<string, CachedFrontendPerm>();
    for (const p of frontendPerms) {
      newFrontend.set(p.permission_key, {
        user_roles: p.user_roles,
        allowed: p.allowed,
        conditions: p.conditions,
        component: p.component,
        sub_view: p.sub_view,
        element_type: p.element_type,
        action_name: p.action_name,
        module: p.module,
        description: p.description,
      });
    }

    this.backendCache = newBackend;
    this.frontendCache = newFrontend;
    this.loaded = true;

    await this.persistToRedis(backendPerms, frontendPerms);
    this.logger.log(`RBAC loaded from DB: ${backendPerms.length} backend + ${frontendPerms.length} frontend`);
  }

  private rebuildFromJson(backendPerms: any[], frontendPerms: any[]): void {
    const newBackend = new Map<string, CachedBackendPerm>();
    for (const p of backendPerms) {
      newBackend.set(p.permission_key, {
        user_roles: p.user_roles,
        scope: p.scope as RbacScope,
        allowed: p.allowed,
        conditions: p.conditions,
        controller: p.controller,
        endpoint: p.endpoint,
        method: p.method,
        module: p.module,
        description: p.description,
      });
    }
    const newFrontend = new Map<string, CachedFrontendPerm>();
    for (const p of frontendPerms) {
      newFrontend.set(p.permission_key, {
        user_roles: p.user_roles,
        allowed: p.allowed,
        conditions: p.conditions,
        component: p.component,
        sub_view: p.sub_view,
        element_type: p.element_type,
        action_name: p.action_name,
        module: p.module,
        description: p.description,
      });
    }
    this.backendCache = newBackend;
    this.frontendCache = newFrontend;
    this.loaded = true;
  }

  private async persistToRedis(
    backendPerms: RbacBackendPermission[],
    frontendPerms: RbacFrontendPermission[],
  ): Promise<void> {
    try {
      const backendJson = backendPerms.map(p => ({
        permission_key: p.permission_key,
        user_roles: p.user_roles,
        scope: p.scope,
        allowed: p.allowed,
        conditions: p.conditions,
        controller: p.controller,
        endpoint: p.endpoint,
        method: p.method,
        module: p.module,
        description: p.description,
      }));
      const frontendJson = frontendPerms.map(p => ({
        permission_key: p.permission_key,
        user_roles: p.user_roles,
        allowed: p.allowed,
        conditions: p.conditions,
        component: p.component,
        sub_view: p.sub_view,
        element_type: p.element_type,
        action_name: p.action_name,
        module: p.module,
        description: p.description,
      }));
      await Promise.all([
        this.redis.set(REDIS_KEY_BACKEND, JSON.stringify(backendJson), 'EX', 3600),
        this.redis.set(REDIS_KEY_FRONTEND, JSON.stringify(frontendJson), 'EX', 3600),
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
