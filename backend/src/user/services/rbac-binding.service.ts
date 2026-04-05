import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RbacPermissionBinding } from '../entity/rbac-permission-binding.entity';
import {
  PERMISSION_BINDINGS,
  API_TO_UI_MAP,
  UI_TO_API_MAP,
} from '../../rbac/permission-registry';

/**
 * Service to manage and query the binding between backend API permission keys
 * and frontend UI permission keys.
 *
 * At runtime, queries are served from the in-memory registry maps.
 * The DB table is the persistent source of truth (synced by permissions:sync).
 */
@Injectable()
export class RbacBindingService {
  private readonly logger = new Logger(RbacBindingService.name);

  constructor(
    @InjectRepository(RbacPermissionBinding)
    private readonly repo: Repository<RbacPermissionBinding>,
  ) {}

  // ─── In-memory lookups (from registry) ──────────────────────────────────

  /** Get the UI key bound to an API key */
  getUiKeyForApi(apiKey: string): string | undefined {
    return API_TO_UI_MAP.get(apiKey);
  }

  /** Get the API key bound to a UI key */
  getApiKeyForUi(uiKey: string): string | undefined {
    return UI_TO_API_MAP.get(uiKey);
  }

  /** Get all bindings for a module */
  getBindingsForModule(module: string) {
    return PERMISSION_BINDINGS.filter(b => b.module === module);
  }

  /** Get all bindings */
  getAllBindings() {
    return PERMISSION_BINDINGS;
  }

  // ─── DB operations (admin panel / sync) ─────────────────────────────────

  async findAllFromDb(): Promise<RbacPermissionBinding[]> {
    return this.repo.find({ order: { module: 'ASC', api_permission_key: 'ASC' } });
  }

  async createBinding(
    apiKey: string,
    uiKey: string,
    module: string,
  ): Promise<RbacPermissionBinding> {
    const exists = await this.repo.findOneBy({ api_permission_key: apiKey, ui_permission_key: uiKey });
    if (exists) return exists;
    return this.repo.save(this.repo.create({ api_permission_key: apiKey, ui_permission_key: uiKey, module }));
  }

  async deleteBinding(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
