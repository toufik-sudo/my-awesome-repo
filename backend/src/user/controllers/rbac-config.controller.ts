import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';
import { RbacConfigService } from '../services/rbac-config.service';
import { RbacBindingService } from '../services/rbac-binding.service';
import { RequireRole } from '../../auth/decorators/require-role.decorator';
import { AppRole } from '../entity/user.entity';
import { RbacScope } from '../entity/rbac-backend-permission.entity';

@ApiTags('RBAC Configuration')
@ApiBearerAuth()
@Controller('rbac-config')
export class RbacConfigController {
  constructor(
    private readonly rbacService: RbacConfigService,
    private readonly bindingService: RbacBindingService,
  ) {}

  // ─── Backend permissions ──────────────────────────────────────────────

  @Get('backend')
  @RequireRole('hyper_admin', 'hyper_manager', 'admin')
  @ApiOperation({ summary: 'List all backend RBAC permissions (admin sees only manager/guest)' })
  @ApiResponse({ status: 200, description: 'Array of all backend permissions with role, resource, action, scope, allowed' })
  async listBackend() {
    return this.rbacService.findAllBackend();
  }

  @Get('backend/role/:role')
  @RequireRole('hyper_admin', 'hyper_manager')
  @ApiOperation({ summary: 'Get backend permissions for a specific role' })
  @ApiResponse({ status: 200, description: 'Map of permission_key → { allowed, scope }' })
  async getBackendByRole(@Param('role') role: AppRole) {
    return this.rbacService.getBackendPermissions(role);
  }

  @Put('backend/:id')
  @RequireRole('hyper_admin')
  @ApiOperation({ summary: 'Update a single backend permission (allowed, scope, conditions)' })
  @ApiBody({
    schema: {
      properties: {
        allowed: { type: 'boolean', example: true },
        scope: { type: 'string', enum: ['global', 'admin', 'assigned', 'own', 'inherited'], example: 'admin' },
        conditions: { type: 'object', nullable: true },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Updated permission object' })
  @ApiResponse({ status: 403, description: 'Cannot disable protected permission' })
  async updateBackend(
    @Param('id') id: string,
    @Body() body: { allowed?: boolean; scope?: RbacScope; conditions?: Record<string, any> },
  ) {
    return this.rbacService.updateBackendPermission(id, body);
  }

  @Put('backend')
  @RequireRole('hyper_admin')
  @ApiOperation({ summary: 'Bulk update backend permissions' })
  @ApiBody({
    schema: {
      properties: {
        updates: {
          type: 'array',
          items: {
            properties: {
              role: { type: 'string', example: 'manager' },
              permission_key: { type: 'string', example: 'create_property' },
              allowed: { type: 'boolean', example: false },
              scope: { type: 'string', example: 'assigned' },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: '{ updated: number, errors: string[] }' })
  async bulkUpdateBackend(
    @Body() body: { updates: Array<{ role: AppRole; permission_key: string; allowed: boolean; scope?: RbacScope }> },
  ) {
    return this.rbacService.bulkUpdateBackend(body.updates);
  }

  @Post('backend')
  @RequireRole('hyper_admin')
  @ApiOperation({ summary: 'Create a new backend permission' })
  @ApiBody({
    schema: {
      properties: {
        role: { type: 'string', example: 'manager' },
        resource: { type: 'string', example: 'properties' },
        action: { type: 'string', example: 'read' },
        permission_key: { type: 'string', example: 'read_properties' },
        scope: { type: 'string', enum: ['global', 'admin', 'assigned', 'own', 'inherited'], example: 'assigned' },
        allowed: { type: 'boolean', example: true },
        conditions: { type: 'object', nullable: true },
      },
      required: ['role', 'resource', 'action', 'permission_key'],
    },
  })
  @ApiResponse({ status: 201, description: 'Created backend permission' })
  @ApiResponse({ status: 403, description: 'Permission already exists' })
  async createBackend(
    @Body() body: { role: AppRole; resource: string; action: string; permission_key: string; scope?: RbacScope; allowed?: boolean; conditions?: Record<string, any> },
  ) {
    return this.rbacService.createBackendPermission(body);
  }

  // ─── Frontend permissions ─────────────────────────────────────────────

  @Get('frontend')
  @RequireRole('hyper_admin', 'hyper_manager', 'admin')
  @ApiOperation({ summary: 'List all frontend RBAC permissions (admin sees only manager/guest)' })
  async listFrontend() {
    return this.rbacService.findAllFrontend();
  }

  @Get('frontend/role/:role')
  @ApiOperation({ summary: 'Get frontend UI permissions for a role (used by frontend at login)' })
  @ApiResponse({ status: 200, description: 'Map of ui_key → boolean' })
  async getFrontendByRole(@Param('role') role: AppRole) {
    return this.rbacService.getFrontendPermissions(role);
  }

  @Put('frontend/:id')
  @RequireRole('hyper_admin')
  @ApiOperation({ summary: 'Update a single frontend permission (allowed, conditions)' })
  async updateFrontend(
    @Param('id') id: string,
    @Body() body: { allowed?: boolean; conditions?: Record<string, any> },
  ) {
    return this.rbacService.updateFrontendPermission(id, body);
  }
  @Post('frontend')
  @RequireRole('hyper_admin')
  @ApiOperation({ summary: 'Create a new frontend permission' })
  @ApiBody({
    schema: {
      properties: {
        role: { type: 'string', example: 'manager' },
        ui_key: { type: 'string', example: 'show_analytics_tab' },
        permission_key: { type: 'string', example: 'show_analytics_tab' },
        allowed: { type: 'boolean', example: true },
        conditions: { type: 'object', nullable: true },
      },
      required: ['role', 'ui_key', 'permission_key'],
    },
  })
  @ApiResponse({ status: 201, description: 'Created frontend permission' })
  @ApiResponse({ status: 403, description: 'Permission already exists for this role + UI key' })
  async createFrontend(
    @Body() body: { role: AppRole; ui_key: string; permission_key: string; allowed?: boolean; conditions?: Record<string, any> },
  ) {
    return this.rbacService.createFrontendPermission(body);
  }

  @Put('frontend')
  @RequireRole('hyper_admin')
  @ApiOperation({ summary: 'Bulk update frontend permissions' })
  @ApiBody({
    schema: {
      properties: {
        updates: {
          type: 'array',
          items: {
            properties: {
              role: { type: 'string', example: 'manager' },
              permission_key: { type: 'string', example: 'show_analytics_tab' },
              allowed: { type: 'boolean', example: true },
            },
          },
        },
      },
    },
  })
  async bulkUpdateFrontend(
    @Body() body: { updates: Array<{ role: AppRole; permission_key: string; allowed: boolean }> },
  ) {
    return this.rbacService.bulkUpdateFrontend(body.updates);
  }

  // ─── Roles list ───────────────────────────────────────────────────────

  @Get('roles')
  @RequireRole('hyper_admin', 'hyper_manager', 'admin')
  @ApiOperation({ summary: 'Get list of all available roles' })
  async getRoles() {
    return this.rbacService.getRoles();
  }

  // ─── Bindings ─────────────────────────────────────────────────────────

  @Get('bindings')
  @ApiOperation({
    summary: 'Get API ↔ UI permission bindings',
    description: 'Returns all bindings or filtered by module query param.',
  })
  @ApiResponse({ status: 200, description: 'Array of { apiPermissionKey, uiPermissionKey, module }' })
  async getBindings(@Query('module') module?: string) {
    if (module) {
      return this.bindingService.getBindingsForModule(module);
    }
    return this.bindingService.getAllBindings();
  }

  // ─── Cache management ─────────────────────────────────────────────────

  @Post('reload')
  @RequireRole('hyper_admin')
  @ApiOperation({ summary: 'Force reload RBAC cache from database and sync Redis' })
  async reloadCache() {
    await this.rbacService.reload();
    return { success: true, message: 'RBAC cache reloaded and synced' };
  }

  @Get('status')
  @RequireRole('hyper_admin')
  @ApiOperation({ summary: 'Check RBAC cache status' })
  async status() {
    return { loaded: this.rbacService.isLoaded() };
  }

  // ─── Permission check endpoint (debugging) ───────────────────────────

  @Get('check')
  @RequireRole('hyper_admin')
  @ApiOperation({ summary: 'Check if a role has a permission (debug)' })
  @ApiResponse({ status: 200, description: '{ role, permission, allowed }' })
  async check(
    @Query('role') role: AppRole,
    @Query('permission') permission: string,
  ) {
    return {
      role,
      permission,
      allowed: this.rbacService.can(role, permission),
    };
  }
}
