import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RbacPermissionBinding } from '../entity/rbac-permission-binding.entity';
import { RbacBackendPermission } from '../entity/rbac-backend-permission.entity';
import { BackendRouteMapperService } from '../../rbac/services/backend-route-mapper.service';

export interface CreateBindingDto {
  backendPermissionId: string;
  frontendPermissionApi: string;
  endpoint_url?: string;
  module?: string;
}

export interface BindingWithKeys {
  id: string;
  backendPermissionId: string;
  backendPermissionKey: string;
  backendUserRoles: string[];
  frontendPermissionApi: string;
  endpoint_url: string | null;
  module: string;
  created_at: Date;
}

@Injectable()
export class PermissionBindingService {
  private readonly logger = new Logger(PermissionBindingService.name);

  constructor(
    @InjectRepository(RbacPermissionBinding)
    private readonly bindingRepo: Repository<RbacPermissionBinding>,
    @InjectRepository(RbacBackendPermission)
    private readonly backendRepo: Repository<RbacBackendPermission>,
    private readonly routeMapper: BackendRouteMapperService,
  ) {}

  async findAll(module?: string): Promise<BindingWithKeys[]> {
    const qb = this.bindingRepo.createQueryBuilder('b')
      .leftJoinAndSelect('b.backendPermission', 'bp')
      .orderBy('b.module', 'ASC')
      .addOrderBy('b.created_at', 'ASC');

    if (module) {
      qb.andWhere('b.module = :module', { module });
    }

    const bindings = await qb.getMany();
    return bindings.map(b => ({
      id: b.id,
      backendPermissionId: b.backendPermissionId,
      backendPermissionKey: b.backendPermission?.permission_key || '',
      backendUserRoles: b.backendPermission?.user_roles || [],
      frontendPermissionApi: b.frontendPermissionApi,
      endpoint_url: b.endpoint_url,
      module: b.module,
      created_at: b.created_at,
    }));
  }

  async findByFrontendApi(frontendApi: string): Promise<BindingWithKeys[]> {
    const bindings = await this.bindingRepo.find({
      where: { frontendPermissionApi: frontendApi },
      relations: ['backendPermission'],
    });
    return bindings.map(b => ({
      id: b.id,
      backendPermissionId: b.backendPermissionId,
      backendPermissionKey: b.backendPermission?.permission_key || '',
      backendUserRoles: b.backendPermission?.user_roles || [],
      frontendPermissionApi: b.frontendPermissionApi,
      endpoint_url: b.endpoint_url,
      module: b.module,
      created_at: b.created_at,
    }));
  }

  async findByBackendKey(backendPermissionKey: string): Promise<BindingWithKeys[]> {
    const bp = await this.backendRepo.findOneBy({ permission_key: backendPermissionKey });
    if (!bp) return [];
    const bindings = await this.bindingRepo.find({
      where: { backendPermissionId: bp.permission_key },
      relations: ['backendPermission'],
    });
    return bindings.map(b => ({
      id: b.id,
      backendPermissionId: b.backendPermissionId,
      backendPermissionKey: b.backendPermission?.permission_key || '',
      backendUserRoles: b.backendPermission?.user_roles || [],
      frontendPermissionApi: b.frontendPermissionApi,
      endpoint_url: b.endpoint_url,
      module: b.module,
      created_at: b.created_at,
    }));
  }

  async create(dto: CreateBindingDto): Promise<RbacPermissionBinding> {
    // backendPermissionId references permission_key (not UUID id) via FK
    // Try lookup by permission_key first, then by UUID id
    let bp = await this.backendRepo.findOneBy({ permission_key: dto.backendPermissionId });
    if (!bp) {
      bp = await this.backendRepo.findOneBy({ id: dto.backendPermissionId });
    }
    if (!bp) throw new NotFoundException(`Backend permission ${dto.backendPermissionId} not found`);

    // FK column references permission_key, so always store permission_key
    const fkValue = bp.permission_key;

    const existing = await this.bindingRepo.findOne({
      where: { backendPermissionId: fkValue, frontendPermissionApi: dto.frontendPermissionApi },
    });
    if (existing) throw new ForbiddenException('This binding already exists');

    const binding = this.bindingRepo.create({
      backendPermissionId: fkValue,
      backendPermission: bp,
      frontendPermissionApi: dto.frontendPermissionApi,
      endpoint_url: dto.endpoint_url || bp.endpoint_url || null,
      module: dto.module || bp.module || 'general',
    });
    return this.bindingRepo.save(binding);
  }

  async createByKeys(backendPermissionKey: string, frontendPermissionApi: string, module?: string, endpointUrl?: string): Promise<RbacPermissionBinding> {
    const bp = await this.backendRepo.findOneBy({ permission_key: backendPermissionKey });
    if (!bp) throw new NotFoundException(`Backend permission '${backendPermissionKey}' not found`);

    return this.create({
      backendPermissionId: bp.permission_key,
      frontendPermissionApi,
      endpoint_url: endpointUrl || bp.endpoint_url || null,
      module: module || bp.module,
    });
  }

  async update(id: string, data: { module?: string; endpoint_url?: string | null }): Promise<RbacPermissionBinding> {
    const binding = await this.bindingRepo.findOneBy({ id });
    if (!binding) throw new NotFoundException('Binding not found');
    if (data.module) binding.module = data.module;
    if (data.endpoint_url !== undefined) binding.endpoint_url = data.endpoint_url;
    return this.bindingRepo.save(binding);
  }

  async remove(id: string): Promise<void> {
    const result = await this.bindingRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Binding not found');
  }

  async bulkCreate(bindings: Array<{ backendPermissionKey: string; frontendPermissionApi: string; module?: string; endpoint_url?: string }>): Promise<{ created: number; errors: string[] }> {
    let created = 0;
    const errors: string[] = [];

    for (const b of bindings) {
      try {
        await this.createByKeys(b.backendPermissionKey, b.frontendPermissionApi, b.module, b.endpoint_url);
        created++;
      } catch (e: any) {
        if (e instanceof ForbiddenException) continue; // Duplicate
        errors.push(`${b.frontendPermissionApi} → ${b.backendPermissionKey}: ${e.message}`);
      }
    }

    this.logger.log(`Bulk binding: created ${created}, errors ${errors.length}`);
    return { created, errors };
  }

  /**
   * Diff between rbac_backend_permissions and rbac_permission_bindings,
   * cross-checked against an optional runtime frontend catalog.
   *
   *  - backendWithoutBinding: backend permission_keys that have NO binding
   *    pointing at them (i.e. the backend perm exists but no frontend API
   *    is wired to it).
   *  - bindingWithoutBackend: bindings whose `backendPermissionId` no longer
   *    matches a row in rbac_backend_permissions (orphaned binding).
   *  - bindingWithoutFrontend: bindings whose `frontendPermissionApi` is
   *    NOT present in the runtime frontend catalog (stale frontend key).
   *    Only returned when a runtime catalog is supplied.
   *  - frontendWithoutBinding: runtime frontend keys that have NO binding
   *    row at all. Only returned when a runtime catalog is supplied.
   */
  async getBindingsDiff(runtimeFrontendKeys?: string[]): Promise<{
    backendWithoutBinding: Array<{ permission_key: string; controller: string; endpoint: string; method: string; endpoint_url: string | null; module: string }>;
    bindingWithoutBackend: Array<{ id: string; backendPermissionId: string; frontendPermissionApi: string; endpoint_url: string | null; module: string }>;
    bindingWithoutFrontend: Array<{ id: string; backendPermissionId: string; frontendPermissionApi: string; endpoint_url: string | null; module: string }>;
    frontendWithoutBinding: string[];
    /** Live route permission_keys not present in rbac_backend_permissions. */
    liveBackendMissingInDb: Array<{ permission_key: string; controller: string; endpoint: string; method: string; endpoint_url: string | null; module: string }>;
    /** Live route permission_keys not referenced by any binding row. */
    liveBackendMissingInBindings: Array<{ permission_key: string; controller: string; endpoint: string; method: string; endpoint_url: string | null; module: string }>;
    counts: { backendTotal: number; bindingsTotal: number; frontendRuntime: number; liveRoutes: number };
  }> {
    const [backendPerms, bindings] = await Promise.all([
      this.backendRepo.find(),
      this.bindingRepo.find(),
    ]);
    const liveControllers = this.routeMapper.list();
    const liveRoutes = liveControllers.flatMap(c =>
      c.endpoints.map(e => ({
        permission_key: e.permission_key,
        controller: e.controller,
        endpoint: e.endpoint,
        method: e.method,
        endpoint_url: e.endpoint_url,
        module: e.module,
      })),
    );

    const backendKeys = new Set(backendPerms.map(b => b.permission_key));
    const boundBackendKeys = new Set(bindings.map(b => b.backendPermissionId));
    const boundFrontendApis = new Set(bindings.map(b => b.frontendPermissionApi));

    const backendWithoutBinding = backendPerms
      .filter(p => !boundBackendKeys.has(p.permission_key))
      .map(p => ({
        permission_key: p.permission_key,
        controller: p.controller,
        endpoint: p.endpoint,
        method: p.method,
        endpoint_url: p.endpoint_url,
        module: p.module,
      }))
      .sort((a, b) => a.permission_key.localeCompare(b.permission_key));

    const bindingWithoutBackend = bindings
      .filter(b => !backendKeys.has(b.backendPermissionId))
      .map(b => ({
        id: b.id,
        backendPermissionId: b.backendPermissionId,
        frontendPermissionApi: b.frontendPermissionApi,
        endpoint_url: b.endpoint_url,
        module: b.module,
      }))
      .sort((a, b) => a.frontendPermissionApi.localeCompare(b.frontendPermissionApi));

    const liveBackendMissingInDb = liveRoutes
      .filter(r => !backendKeys.has(r.permission_key))
      .sort((a, b) => a.permission_key.localeCompare(b.permission_key));

    const liveBackendMissingInBindings = liveRoutes
      .filter(r => !boundBackendKeys.has(r.permission_key))
      .sort((a, b) => a.permission_key.localeCompare(b.permission_key));

    let bindingWithoutFrontend: typeof bindingWithoutBackend = [];
    let frontendWithoutBinding: string[] = [];
    if (runtimeFrontendKeys && runtimeFrontendKeys.length > 0) {
      const runtimeSet = new Set(runtimeFrontendKeys);
      bindingWithoutFrontend = bindings
        .filter(b => !runtimeSet.has(b.frontendPermissionApi))
        .map(b => ({
          id: b.id,
          backendPermissionId: b.backendPermissionId,
          frontendPermissionApi: b.frontendPermissionApi,
          endpoint_url: b.endpoint_url,
          module: b.module,
        }))
        .sort((a, b) => a.frontendPermissionApi.localeCompare(b.frontendPermissionApi));
      frontendWithoutBinding = runtimeFrontendKeys
        .filter(k => !boundFrontendApis.has(k))
        .sort();
    }

    return {
      backendWithoutBinding,
      bindingWithoutBackend,
      bindingWithoutFrontend,
      frontendWithoutBinding,
      liveBackendMissingInDb,
      liveBackendMissingInBindings,
      counts: {
        backendTotal: backendPerms.length,
        bindingsTotal: bindings.length,
        frontendRuntime: runtimeFrontendKeys?.length ?? 0,
        liveRoutes: liveRoutes.length,
      },
    };
  }

  /**
   * Get the full binding map: frontendApi → { backendKey, roles[] }
   * Used by the frontend to check role access before making API calls.
   */
  async getBindingMap(): Promise<Record<string, Array<{ backendKey: string; roles: string[] }>>> {
    const bindings = await this.findAll();
    const map: Record<string, Array<{ backendKey: string; roles: string[] }>> = {};
    for (const b of bindings) {
      if (!map[b.frontendPermissionApi]) map[b.frontendPermissionApi] = [];
      map[b.frontendPermissionApi].push({
        backendKey: b.backendPermissionKey,
        roles: b.backendUserRoles,
      });
    }
    return map;
  }
}
