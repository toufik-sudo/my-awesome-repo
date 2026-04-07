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
  @ApiOperation({ summary: 'List all backend RBAC permissions' })
  async listBackend(@Request() req: any) {
    const scopeCtx = extractScopeContext(req);
    return this.rbacService.findAllBackend();
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
  @ApiOperation({ summary: 'List all frontend RBAC permissions' })
  async listFrontend(@Request() req: any) {
    const scopeCtx = extractScopeContext(req);
    return this.rbacService.findAllFrontend();
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
