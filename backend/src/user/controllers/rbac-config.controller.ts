import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  Post,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';
import { RbacConfigService } from '../services/rbac-config.service';
import { JwtAuthGuard } from '../../auth/jwtAuth.guard';
import { CustomCsrfInterceptor } from '../../services/interceptors/custom.csrf.interceptor';
import { CsrfGenAuth, CsrfCheck } from '@tekuconcept/nestjs-csrf';
import { extractScopeContext } from '../../rbac/scope-context';
import { PermissionGuard } from '../../auth/guards/permission.guard';
import { AppRole } from '../entity/user.entity';
import { RbacScope } from '../entity/rbac-backend-permission.entity';

@ApiTags('RBAC Configuration')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(CustomCsrfInterceptor)
@Controller('rbac-config')
export class RbacConfigController {
  constructor(private readonly rbacService: RbacConfigService) {}

  // ─── Backend permissions ──────────────────────────────────────────────

  @Get('backend')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'List all backend RBAC permissions (supports ?page&pageSize&module&search)' })
  async listBackend(
    @Request() req: any,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('module') module?: string,
    @Query('search') search?: string,
    @Query('modulesOnly') modulesOnly?: string,
  ) {
    const scopeCtx = extractScopeContext(req);
    if (modulesOnly === 'true') return this.rbacService.findAllBackend({ modulesOnly: true });
    const pagination = page ? { page: parseInt(page, 10), pageSize: pageSize ? parseInt(pageSize, 10) : undefined, module, search } : undefined;
    return this.rbacService.findAllBackend(pagination);
  }

  @Get('backend/role/:role')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Get backend permissions for a specific role' })
  async getBackendByRole(@Param('role') role: AppRole, @Request() req: any) {
    const scopeCtx = extractScopeContext(req);
    return this.rbacService.getBackendPermissions(role);
  }

  @Get('backend/catalog')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Get backend controllers and endpoints catalog (live route map vs DB)' })
  async getBackendCatalog(@Request() req: any) {
    const scopeCtx = extractScopeContext(req);
    return this.rbacService.getBackendApiCatalog();
  }

  @Get('backend/catalog/diff')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Diff between live backend route map and rbac_backend_permissions DB' })
  async getBackendCatalogDiff(@Request() req: any) {
    const scopeCtx = extractScopeContext(req);
    return this.rbacService.getBackendCatalogDiff();
  }

  @Post('frontend/catalog/diff')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Diff between frontend API catalog (runtime + on-disk) and rbac_frontend_permissions DB' })
  async getFrontendCatalogDiff(
    @Body() body: { runtimeCatalog?: Array<{ frontendApiKey: string; module: string; source: string | null }> },
    @Request() req: any,
  ) {
    const scopeCtx = extractScopeContext(req);
    return this.rbacService.getFrontendCatalogDiff(body?.runtimeCatalog);
  }

  @Post('frontend/catalog')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Get frontend API catalog merged with optional runtime catalog' })
  async getFrontendCatalog(
    @Body() body: { runtimeCatalog?: Array<{ frontendApiKey: string; module: string; source: string | null }> },
    @Request() req: any,
  ) {
    const scopeCtx = extractScopeContext(req);
    return this.rbacService.getFrontendApiCatalog(body?.runtimeCatalog);
  }

  @Put('backend/:id')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Update a backend permission' })
  async updateBackend(
    @Param('id') id: string,
    @Body() body: { allowed?: boolean; scope?: RbacScope; user_roles?: string[]; conditions?: Record<string, any> },
    @Request() req: any,
  ) {
    const scopeCtx = extractScopeContext(req);
    return this.rbacService.updateBackendPermission(id, body);
  }

  @Put('backend')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Bulk update backend permissions' })
  async bulkUpdateBackend(
    @Body() body: { updates: Array<{ permission_key: string; allowed?: boolean; scope?: RbacScope; user_roles?: string[] }> },
    @Request() req: any,
  ) {
    const scopeCtx = extractScopeContext(req);
    return this.rbacService.bulkUpdateBackend(body.updates);
  }

  @Post('backend')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Create a new backend permission (uses generateBackendPermissionKey)' })
  async createBackend(
    @Body() body: {
      controller: string;
      endpoint: string;
      method: string;
      endpoint_url?: string;
      user_roles: string[];
      scope?: RbacScope;
      allowed?: boolean;
      module?: string;
      description?: string;
      conditions?: Record<string, any>;
    },
    @Request() req: any,
  ) {
    const scopeCtx = extractScopeContext(req);
    return this.rbacService.createBackendPermission(body);
  }

  // ─── Frontend permissions ─────────────────────────────────────────────

  @Get('frontend')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'List all frontend RBAC permissions (supports ?page&pageSize&module&search)' })
  async listFrontend(
    @Request() req: any,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('module') module?: string,
    @Query('search') search?: string,
    @Query('modulesOnly') modulesOnly?: string,
  ) {
    const scopeCtx = extractScopeContext(req);
    if (modulesOnly === 'true') return this.rbacService.findAllFrontend({ modulesOnly: true });
    const pagination = page ? { page: parseInt(page, 10), pageSize: pageSize ? parseInt(pageSize, 10) : undefined, module, search } : undefined;
    return this.rbacService.findAllFrontend(pagination);
  }

  @Get('frontend/role/:role')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Get frontend UI permissions for a role' })
  async getFrontendByRole(@Param('role') role: AppRole, @Request() req: any) {
    const scopeCtx = extractScopeContext(req);
    return this.rbacService.getFrontendPermissions(role);
  }

  @Put('frontend/:id')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Update a frontend permission' })
  async updateFrontend(
    @Param('id') id: string,
    @Body() body: { allowed?: boolean; user_roles?: string[]; conditions?: Record<string, any> },
    @Request() req: any,
  ) {
    const scopeCtx = extractScopeContext(req);
    return this.rbacService.updateFrontendPermission(id, body);
  }

  @Post('frontend')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Create a new frontend permission (uses generateUiPermissionKey)' })
  async createFrontend(
    @Body() body: {
      component: string;
      sub_view?: string;
      element_type?: string;
      action_name?: string;
      user_roles: string[];
      allowed?: boolean;
      module?: string;
      description?: string;
      conditions?: Record<string, any>;
    },
    @Request() req: any,
  ) {
    const scopeCtx = extractScopeContext(req);
    return this.rbacService.createFrontendPermission(body);
  }

  @Put('frontend')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Bulk update frontend permissions' })
  async bulkUpdateFrontend(
    @Body() body: { updates: Array<{ permission_key: string; allowed?: boolean; user_roles?: string[] }> },
    @Request() req: any,
  ) {
    const scopeCtx = extractScopeContext(req);
    return this.rbacService.bulkUpdateFrontend(body.updates);
  }

  // ─── Roles list ───────────────────────────────────────────────────────

  @Get('roles')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Get list of all available roles' })
  async getRoles(@Request() req: any) {
    const scopeCtx = extractScopeContext(req);
    return this.rbacService.getRoles();
  }

  // ─── Cache management ─────────────────────────────────────────────────

  @Post('reload')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Force reload RBAC cache' })
  async reloadCache(@Request() req: any) {
    const scopeCtx = extractScopeContext(req);
    await this.rbacService.reload();
    return { success: true, message: 'RBAC cache reloaded and synced' };
  }

  @Post('catalog/refresh')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({
    summary:
      'Re-introspect controllers, regenerate the frontend API catalog, and reload RBAC caches',
  })
  async refreshCatalogs(@Request() req: any) {
    const scopeCtx = extractScopeContext(req);
    const result = await this.rbacService.refreshCatalogs();
    return { success: true, ...result };
  }

  @Get('status')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Check RBAC cache status' })
  async status(@Request() req: any) {
    const scopeCtx = extractScopeContext(req);
    return { loaded: this.rbacService.isLoaded() };
  }

  // ─── Permission check endpoint (debugging) ───────────────────────────

  @Get('check')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Check if a role has a permission (debug)' })
  async check(
    @Query('role') role: AppRole,
    @Query('permission') permission: string,
    @Request() req: any,
  ) {
    const scopeCtx = extractScopeContext(req);
    return {
      role,
      permission,
      allowed: this.rbacService.can(role, permission),
    };
  }
}
