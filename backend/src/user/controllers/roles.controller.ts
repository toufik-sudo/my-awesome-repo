import {
  Controller, Get, Post, Put, Delete, Body, Param, Request, UseGuards, UseInterceptors, Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';
import { RolesService } from '../services/roles.service';
import { AppRole } from '../entity/user.entity';
import { PermissionScope } from '../entity/manager-permission.entity';
import { HyperManagerPermissionScope } from '../entity/hyper-manager-permission.entity';
import { GuestPermissionScope } from '../entity/guest-permission.entity';
import { PermissionGuard } from '../../auth/guards/permission.guard';
import { JwtAuthGuard } from '../../auth/jwtAuth.guard';
import { CustomCsrfInterceptor } from '../../services/interceptors/custom.csrf.interceptor';
import { CsrfGenAuth, CsrfCheck } from '@tekuconcept/nestjs-csrf';
import { extractScopeContext } from '../../rbac/scope-context';

@ApiTags('Roles & Permissions')
@ApiBearerAuth()
@Controller('roles')
@UseGuards(JwtAuthGuard)
@UseInterceptors(CustomCsrfInterceptor)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get('stats')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Dashboard statistics' })
  async getStats(@Request() req) {
    const scopeCtx = extractScopeContext(req);
    return this.rolesService.getDashboardStats(req.user.id);
  }

  @Get('user/:userId')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Get user role' })
  @ApiParam({ name: 'userId', example: '3' })
  async getUserRoles(@Param('userId') userId: string) {
    return this.rolesService.getUserRoles(parseInt(userId, 10));
  }

  @Post('assign')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Assign a role to a user' })
  @ApiBody({ schema: { example: { userId: 5, role: 'manager' } } })
  async assignRole(@Request() req, @Body() body: { userId: number; role: AppRole }) {
    const scopeCtx = extractScopeContext(req);
    return this.rolesService.assignRole(req.user.id, body.userId, body.role);
  }

  @Delete('user/:userId/:role')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Remove role (demote to user)' })
  async removeRole(@Request() req, @Param('userId') userId: string, @Param('role') role: AppRole) {
    const scopeCtx = extractScopeContext(req);
    await this.rolesService.removeRole(req.user.id, parseInt(userId, 10), role);
    return { success: true };
  }

  // ─── Manager Permissions ─────────────────────────────────────────

  @Post('manager/permissions')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Set manager permissions' })
  async setManagerPermissions(
    @Request() req,
    @Body() body: {
      managerId: number;
      permissions: {
        backendPermissionKey: string;
        frontendPermissionKey?: string;
        scope: PermissionScope;
        isGranted: boolean;
        properties?: string[];
        services?: string[];
        propertyGroups?: string[];
        serviceGroups?: string[];
      }[];
    },
  ) {
    const scopeCtx = extractScopeContext(req);
    return this.rolesService.setManagerPermissions(req.user.id, body.managerId, body.permissions);
  }

  @Get('manager/:managerId/permissions')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Get manager permissions' })
  async getManagerPermissions(@Request() req, @Param('managerId') managerId: string) {
    const scopeCtx = extractScopeContext(req);
    return this.rolesService.getManagerPermissions(parseInt(managerId, 10), req.user.id);
  }

  @Get('manager/:managerId/properties')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Get manager accessible properties' })
  async getManagerProperties(@Param('managerId') managerId: string, @Request() req: any) {
    const scopeCtx = extractScopeContext(req);
    return this.rolesService.getManagerProperties(parseInt(managerId, 10));
  }

  // ─── Hyper Manager Permissions ───────────────────────────────────

  @Post('hyper-manager/permissions')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Set hyper_manager permissions (hyper_admin only)' })
  async setHyperManagerPermissions(
    @Request() req,
    @Body() body: {
      hyperManagerId: number;
      permissions: {
        backendPermissionKey: string;
        frontendPermissionKey?: string;
        scope: HyperManagerPermissionScope;
        isGranted: boolean;
        properties?: string[];
        services?: string[];
        propertyGroups?: string[];
        serviceGroups?: string[];
        admins?: number[];
      }[];
    },
  ) {
    const scopeCtx = extractScopeContext(req);
    return this.rolesService.setHyperManagerPermissions(req.user.id, body.hyperManagerId, body.permissions);
  }

  @Get('hyper-manager/:hyperManagerId/permissions')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Get hyper_manager permissions' })
  async getHyperManagerPermissions(@Param('hyperManagerId') hyperManagerId: string, @Request() req: any) {
    const scopeCtx = extractScopeContext(req);
    return this.rolesService.getHyperManagerPermissions(parseInt(hyperManagerId, 10));
  }

  // ─── Guest Permissions ───────────────────────────────────────────

  @Post('guest/permissions')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Set guest permissions' })
  async setGuestPermissions(
    @Request() req,
    @Body() body: {
      guestId: number;
      permissions: {
        backendPermissionKey: string;
        frontendPermissionKey?: string;
        scope: GuestPermissionScope;
        isGranted: boolean;
        properties?: string[];
        services?: string[];
        propertyGroups?: string[];
        serviceGroups?: string[];
      }[];
    },
  ) {
    const scopeCtx = extractScopeContext(req);
    return this.rolesService.setGuestPermissions(req.user.id, body.guestId, body.permissions);
  }

  @Get('guest/:guestId/permissions')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Get guest permissions' })
  async getGuestPermissions(@Request() req, @Param('guestId') guestId: string) {
    const scopeCtx = extractScopeContext(req);
    return this.rolesService.getGuestPermissions(parseInt(guestId, 10), req.user.id);
  }

  // ─── Users ───────────────────────────────────────────────────────

  @Get('users')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'List users with roles' })
  async getAllUsers(@Request() req) {
    const scopeCtx = extractScopeContext(req);
    return this.rolesService.getAllUsersWithRoles(req.user.id);
  }

  @Put('users/:userId/status')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Update user status' })
  async updateUserStatus(@Request() req, @Param('userId') userId: string, @Body() body: { status: string }) {
    const scopeCtx = extractScopeContext(req);
    return this.rolesService.updateUserStatus(req.user.id, parseInt(userId, 10), body.status);
  }

  @Delete('users/:userId')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Delete user' })
  async deleteUser(@Request() req, @Param('userId') userId: string) {
    const scopeCtx = extractScopeContext(req);
    await this.rolesService.deleteUser(req.user.id, parseInt(userId, 10));
    return { success: true };
  }

  // ─── Assignments (all permission types) ──────────────────────────

  @Get('assignments')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'List all permissions/assignments' })
  async getAllAssignments(@Request() req) {
    const scopeCtx = extractScopeContext(req);
    return this.rolesService.getAllAssignments(req.user.id);
  }

  @Delete('assignments/:permissionId/:type')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Remove a permission' })
  @ApiParam({ name: 'type', enum: ['manager', 'hyper_manager', 'guest'] })
  async removePermission(
    @Request() req,
    @Param('permissionId') permissionId: string,
    @Param('type') type: 'manager' | 'hyper_manager' | 'guest',
  ) {
    const scopeCtx = extractScopeContext(req);
    await this.rolesService.removePermission(req.user.id, permissionId, type);
    return { success: true };
  }

  // ─── Permission Check ────────────────────────────────────────────

  @Get('check/:userId/property/:propertyId/:permission')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Check permission for property' })
  async checkPermission(
    @Param('userId') userId: string,
    @Param('propertyId') propertyId: string,
    @Param('permission') permission: string,
    @Request() req: any,
  ) {
    const scopeCtx = extractScopeContext(req);
    const hasPermission = await this.rolesService.hasPermissionForProperty(parseInt(userId, 10), propertyId, permission);
    return { hasPermission };
  }
}
