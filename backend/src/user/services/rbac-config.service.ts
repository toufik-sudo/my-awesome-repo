import { Injectable, OnModuleInit, Logger, ForbiddenException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Redis from 'ioredis';
import { RbacBackendPermission, RbacScope } from '../entity/rbac-backend-permission.entity';
import { RbacFrontendPermission } from '../entity/rbac-frontend-permission.entity';
import { AppRole } from '../entity/user.entity';
import { REDIS_CLIENT } from '../../infrastructure/redis/redis.constant';
import { EventsGateway } from '../../infrastructure/websocket/events.gateway';

// ─── Redis keys ───────────────────────────────────────────────────────────────
const REDIS_KEY_BACKEND = 'rbac:backend:permissions';
const REDIS_KEY_FRONTEND = 'rbac:frontend:permissions';
const REDIS_CHANNEL = 'rbac:updated';

// ─── Cache types ──────────────────────────────────────────────────────────────
interface CachedBackendPerm {
  allowed: boolean;
  scope: RbacScope;
  conditions: Record<string, any> | null;
}

interface CachedFrontendPerm {
  allowed: boolean;
  conditions: Record<string, any> | null;
}

// ─── Protected permissions (cannot be disabled by hyper_admin) ────────────────
const PROTECTED_PERMISSIONS: string[] = [
  'hyper_admin:manage_users',
  'hyper_admin:manage_admins',
  'hyper_admin:view_analytics',
  'hyper_admin:validate_payments',
  'hyper_admin:verify_documents',
];

@Injectable()
export class RbacConfigService implements OnModuleInit {
  private readonly logger = new Logger(RbacConfigService.name);

  /** role:permission_key → CachedBackendPerm */
  private backendCache = new Map<string, CachedBackendPerm>();
  /** role:ui_key → CachedFrontendPerm */
  private frontendCache = new Map<string, CachedFrontendPerm>();
  /** role:resource:action → CachedBackendPerm (secondary index) */
  private actionCache = new Map<string, CachedBackendPerm>();

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

  can(role: AppRole, permissionKey: string): boolean {
    const entry = this.backendCache.get(`${role}:${permissionKey}`);
    if (!entry) return false;
    return entry.allowed;
  }

  canAction(role: AppRole, resource: string, action: string): boolean {
    const entry = this.actionCache.get(`${role}:${resource}:${action}`);
    if (!entry) return false;
    return entry.allowed;
  }

  getScope(role: AppRole, resource: string): RbacScope | null {
    for (const [key, val] of this.backendCache.entries()) {
      if (key.startsWith(`${role}:`) && val.scope) {
        const permKey = key.split(':')[1];
        if (permKey?.startsWith(resource.replace(/-/g, '_')) || permKey?.includes(resource)) {
          return val.scope;
        }
      }
    }
    return null;
  }

  canUI(role: AppRole, uiKey: string): boolean {
    const entry = this.frontendCache.get(`${role}:${uiKey}`);
    if (!entry) return true;
    return entry.allowed;
  }

  getFrontendPermissions(role: AppRole): Record<string, boolean> {
    const result: Record<string, boolean> = {};
    for (const [key, val] of this.frontendCache.entries()) {
      if (key.startsWith(`${role}:`)) {
        result[key.substring(role.length + 1)] = val.allowed;
      }
    }
    return result;
  }

  getBackendPermissions(role: AppRole): Record<string, { allowed: boolean; scope: RbacScope }> {
    const result: Record<string, { allowed: boolean; scope: RbacScope }> = {};
    for (const [key, val] of this.backendCache.entries()) {
      if (key.startsWith(`${role}:`)) {
        result[key.substring(role.length + 1)] = { allowed: val.allowed, scope: val.scope };
      }
    }
    return result;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CRUD — Admin Panel
  // ═══════════════════════════════════════════════════════════════════════════

  async findAllBackend(): Promise<RbacBackendPermission[]> {
    return this.backendRepo.find({ order: { role: 'ASC', resource: 'ASC', action: 'ASC' } });
  }

  async findAllFrontend(): Promise<RbacFrontendPermission[]> {
    return this.frontendRepo.find({ order: { role: 'ASC', ui_key: 'ASC' } });
  }

  async updateBackendPermission(
    id: string,
    updates: Partial<Pick<RbacBackendPermission, 'allowed' | 'scope' | 'conditions'>>,
  ): Promise<RbacBackendPermission> {
    const perm = await this.backendRepo.findOneByOrFail({ id });
    this.validateSafetyCheck(perm.role, perm.permission_key, updates);
    await this.backendRepo.update(id, updates);
    await this.syncAndBroadcast();
    return this.backendRepo.findOneByOrFail({ id });
  }

  async updateFrontendPermission(
    id: string,
    updates: Partial<Pick<RbacFrontendPermission, 'allowed' | 'conditions'>>,
  ): Promise<RbacFrontendPermission> {
    await this.frontendRepo.update(id, updates);
    await this.syncAndBroadcast();
    return this.frontendRepo.findOneByOrFail({ id });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // BULK UPDATE — Dynamic RBAC Config
  // ═══════════════════════════════════════════════════════════════════════════

  async bulkUpdateBackend(
    updates: Array<{ role: AppRole; permission_key: string; allowed: boolean; scope?: RbacScope }>,
  ): Promise<{ updated: number; errors: string[] }> {
    const errors: string[] = [];
    let updated = 0;

    for (const u of updates) {
      try {
        this.validateSafetyCheck(u.role, u.permission_key, { allowed: u.allowed });
        const perm = await this.backendRepo.findOneBy({ role: u.role, permission_key: u.permission_key });
        if (!perm) {
          errors.push(`Not found: ${u.role}:${u.permission_key}`);
          continue;
        }
        const updateData: any = { allowed: u.allowed };
        if (u.scope) updateData.scope = u.scope;
        await this.backendRepo.update(perm.id, updateData);
        updated++;
      } catch (e:any) {
        errors.push(`${u.role}:${u.permission_key} → ${e.message}`);
      }
    }

    if (updated > 0) await this.syncAndBroadcast();
    return { updated, errors };
  }

  async bulkUpdateFrontend(
    updates: Array<{ role: AppRole; permission_key: string; allowed: boolean }>,
  ): Promise<{ updated: number; errors: string[] }> {
    const errors: string[] = [];
    let updated = 0;

    for (const u of updates) {
      try {
        const perm = await this.frontendRepo.findOneBy({ role: u.role, permission_key: u.permission_key });
        if (!perm) {
          errors.push(`Not found: ${u.role}:${u.permission_key}`);
          continue;
        }
        await this.frontendRepo.update(perm.id, { allowed: u.allowed });
        updated++;
      } catch (e:any) {
        errors.push(`${u.role}:${u.permission_key} → ${e.message}`);
      }
    }

    if (updated > 0) await this.syncAndBroadcast();
    return { updated, errors };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CREATE — New Permissions
  // ═══════════════════════════════════════════════════════════════════════════

  async createBackendPermission(data: {
    role: AppRole;
    resource: string;
    action: string;
    permission_key: string;
    scope?: RbacScope;
    allowed?: boolean;
    conditions?: Record<string, any>;
  }): Promise<RbacBackendPermission> {
    const existing = await this.backendRepo.findOneBy({
      role: data.role,
      permission_key: data.permission_key,
    });
    if (existing) {
      throw new ForbiddenException(
        `Permission '${data.permission_key}' already exists for role '${data.role}'.`,
      );
    }
    const perm = this.backendRepo.create({
      role: data.role,
      resource: data.resource,
      action: data.action,
      permission_key: data.permission_key,
      scope: data.scope || 'global',
      allowed: data.allowed !== undefined ? data.allowed : true,
      conditions: data.conditions || null,
    });
    const saved = await this.backendRepo.save(perm);
    await this.syncAndBroadcast();
    return saved;
  }

  async createFrontendPermission(data: {
    role: AppRole;
    ui_key: string;
    permission_key: string;
    allowed?: boolean;
    conditions?: Record<string, any>;
  }): Promise<RbacFrontendPermission> {
    const existing = await this.frontendRepo.findOneBy({
      role: data.role,
      ui_key: data.ui_key,
    });
    if (existing) {
      throw new ForbiddenException(
        `Frontend permission for UI key '${data.ui_key}' already exists for role '${data.role}'.`,
      );
    }
    const perm = this.frontendRepo.create({
      role: data.role,
      ui_key: data.ui_key,
      permission_key: data.permission_key,
      allowed: data.allowed !== undefined ? data.allowed : true,
      conditions: data.conditions || null,
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
  // PRIVATE — Loading, Sync, Safety
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Load from Redis first (shared cache), fallback to DB.
   */
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
    } catch (err:any) {
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

    // Rebuild memory caches
    const newBackend = new Map<string, CachedBackendPerm>();
    const newAction = new Map<string, CachedBackendPerm>();
    for (const p of backendPerms) {
      const cached: CachedBackendPerm = { allowed: p.allowed, scope: p.scope, conditions: p.conditions };
      newBackend.set(`${p.role}:${p.permission_key}`, cached);
      newAction.set(`${p.role}:${p.resource}:${p.action}`, cached);
    }

    const newFrontend = new Map<string, CachedFrontendPerm>();
    for (const p of frontendPerms) {
      newFrontend.set(`${p.role}:${p.ui_key}`, { allowed: p.allowed, conditions: p.conditions });
    }

    this.backendCache = newBackend;
    this.actionCache = newAction;
    this.frontendCache = newFrontend;
    this.loaded = true;

    // Persist to Redis
    await this.persistToRedis(backendPerms, frontendPerms);

    this.logger.log(`RBAC loaded from DB: ${backendPerms.length} backend + ${frontendPerms.length} frontend`);
  }

  private rebuildFromJson(
    backendPerms: Array<{ role: string; permission_key: string; resource: string; action: string; allowed: boolean; scope: string; conditions: any }>,
    frontendPerms: Array<{ role: string; ui_key: string; allowed: boolean; conditions: any }>,
  ): void {
    const newBackend = new Map<string, CachedBackendPerm>();
    const newAction = new Map<string, CachedBackendPerm>();
    for (const p of backendPerms) {
      const cached: CachedBackendPerm = { allowed: p.allowed, scope: p.scope as RbacScope, conditions: p.conditions };
      newBackend.set(`${p.role}:${p.permission_key}`, cached);
      newAction.set(`${p.role}:${p.resource}:${p.action}`, cached);
    }
    const newFrontend = new Map<string, CachedFrontendPerm>();
    for (const p of frontendPerms) {
      newFrontend.set(`${p.role}:${p.ui_key}`, { allowed: p.allowed, conditions: p.conditions });
    }
    this.backendCache = newBackend;
    this.actionCache = newAction;
    this.frontendCache = newFrontend;
    this.loaded = true;
  }

  private async persistToRedis(
    backendPerms: RbacBackendPermission[],
    frontendPerms: RbacFrontendPermission[],
  ): Promise<void> {
    try {
      const backendJson = backendPerms.map(p => ({
        role: p.role, permission_key: p.permission_key, resource: p.resource,
        action: p.action, allowed: p.allowed, scope: p.scope, conditions: p.conditions,
      }));
      const frontendJson = frontendPerms.map(p => ({
        role: p.role, ui_key: p.ui_key, permission_key: p.permission_key,
        allowed: p.allowed, conditions: p.conditions,
      }));
      await Promise.all([
        this.redis.set(REDIS_KEY_BACKEND, JSON.stringify(backendJson), 'EX', 3600),
        this.redis.set(REDIS_KEY_FRONTEND, JSON.stringify(frontendJson), 'EX', 3600),
      ]);
    } catch (err:any) {
      this.logger.warn(`Redis persist failed: ${err.message}`);
    }
  }

  /**
   * After DB update: reload from DB, persist to Redis, broadcast via pub/sub + WebSocket.
   */
  private async syncAndBroadcast(): Promise<void> {
    await this.loadFromDb();
    // Notify other instances via Redis pub/sub
    try {
      await this.redis.publish(REDIS_CHANNEL, JSON.stringify({ ts: Date.now() }));
    } catch (err:any) {
      this.logger.warn(`Redis publish failed: ${err.message}`);
    }
    // Notify connected frontends via WebSocket
    this.eventsGateway.broadcast('rbac:updated', { timestamp: Date.now() });
    this.logger.log('RBAC synced and broadcasted');
  }

  /**
   * Subscribe to Redis pub/sub for cross-instance sync.
   */
  private async subscribeToUpdates(): Promise<void> {
    try {
      // Create a duplicate connection for subscribe (Redis requires separate connections for sub)
      this.subscriber = this.redis.duplicate();
      await this.subscriber.subscribe(REDIS_CHANNEL);
      this.subscriber.on('message', async (channel: string) => {
        if (channel === REDIS_CHANNEL) {
          this.logger.log('RBAC update received via Redis pub/sub — reloading');
          await this.loadFromDb();
        }
      });
      this.logger.log('RBAC Redis subscriber connected');
    } catch (err:any) {
      this.logger.warn(`Redis subscribe failed: ${err.message}. Using DB-only mode.`);
    }
  }

  /**
   * Safety check: prevent hyper_admin from self-locking critical permissions.
   */
  private validateSafetyCheck(
    role: string,
    permissionKey: string,
    updates: { allowed?: boolean },
  ): void {
    if (updates.allowed === false) {
      const key = `${role}:${permissionKey}`;
      if (PROTECTED_PERMISSIONS.includes(key)) {
        throw new ForbiddenException(
          `Cannot disable protected permission '${permissionKey}' for '${role}'. ` +
          `This would break critical system functionality.`,
        );
      }
    }
  }
}
