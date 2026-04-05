import {
  Controller, Get, Post, Put, Delete, Body, Param, Request, UseGuards, Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { RolesService } from '../services/roles.service';
import { AppRole } from '../entity/user.entity';
import { AssignmentScope } from '../entity/manager-assignment.entity';
import { PermissionType } from '../entity/manager-permission.entity';
import { RequireRole } from '../../auth/decorators';
import { PermissionGuard } from '../../auth/guards/permission.guard';

@ApiTags('Roles & Permissions')
@ApiBearerAuth()
@Controller('roles')
@UseGuards(PermissionGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get('stats')
  @RequireRole('hyper_admin', 'hyper_manager', 'admin')
  @ApiOperation({
    summary: 'Dashboard statistics',
    description: `Returns user counts, group counts, and assignment stats.
    - **hyper_admin / hyper_manager**: global stats
    - **admin**: scoped stats (own properties, own managers/guests only)`,
  })
  @ApiResponse({ status: 200, description: 'Dashboard stats object' })
  async getStats(@Request() req) {
    return this.rolesService.getDashboardStats(req.user.id);
  }

  @Get('user/:userId')
  @RequireRole('hyper_admin', 'hyper_manager', 'admin', 'manager')
  @ApiOperation({ summary: 'Get user role', description: 'Returns the role(s) for a given user.' })
  @ApiParam({ name: 'userId', description: 'Numeric user ID', example: '3' })
  @ApiResponse({ status: 200, description: 'Array containing the single user role', schema: { example: ['admin'] } })
  async getUserRoles(@Param('userId') userId: string) {
    return this.rolesService.getUserRoles(parseInt(userId, 10));
  }

  @Post('assign')
  @RequireRole('hyper_admin', 'hyper_manager', 'admin')
  @ApiOperation({
    summary: 'Assign a role to a user',
    description: `Assign a new role. Hierarchy enforced:
    - hyper_admin → can assign any role
    - hyper_manager → can assign admin, manager, user, guest
    - admin → can assign manager, guest ONLY`,
  })
  @ApiBody({ schema: { example: { userId: 5, role: 'manager' } } })
  @ApiResponse({ status: 200, description: 'Role assigned', schema: { example: { userId: 5, role: 'manager' } } })
  @ApiResponse({ status: 403, description: 'Insufficient hierarchy level' })
  async assignRole(
    @Request() req,
    @Body() body: { userId: number; role: AppRole },
  ) {
    return this.rolesService.assignRole(req.user.id, body.userId, body.role);
  }

  @Delete('user/:userId/:role')
  @RequireRole('hyper_admin', 'hyper_manager', 'admin')
  @ApiOperation({ summary: 'Remove role (demote to user)', description: 'Removes a user\'s current role. Admin can only demote own managers/guests.' })
  @ApiParam({ name: 'userId', example: '5' })
  @ApiParam({ name: 'role', example: 'manager' })
  @ApiResponse({ status: 200, description: 'Role removed' })
  async removeRole(
    @Request() req,
    @Param('userId') userId: string,
    @Param('role') role: AppRole,
  ) {
    await this.rolesService.removeRole(req.user.id, parseInt(userId, 10), role);
    return { success: true };
  }

  @Post('manager/assign')
  @RequireRole('hyper_admin', 'hyper_manager', 'admin')
  @ApiOperation({
    summary: 'Assign manager to properties',
    description: `Create a manager assignment with scope:
    - **all**: all properties (admin = all own properties)
    - **property**: single property by ID
    - **property_group**: a property group by ID
    Admin can only assign managers they invited. Hyper assigns hyper_managers.`,
  })
  @ApiBody({ schema: { example: { managerId: 5, scope: 'property', propertyId: 'uuid-here' } } })
  @ApiResponse({ status: 201, description: 'Assignment created' })
  async assignManager(
    @Request() req,
    @Body() body: {
      managerId: number;
      scope: AssignmentScope;
      propertyId?: string;
      propertyGroupId?: string;
    },
  ) {
    return this.rolesService.assignManager(
      req.user.id, body.managerId, body.scope, body.propertyId, body.propertyGroupId,
    );
  }

  @Post('manager/permissions')
  @RequireRole('hyper_admin', 'hyper_manager', 'admin')
  @ApiOperation({
    summary: 'Set manager permissions',
    description: 'Replace all permissions for a specific assignment. Admin can only manage their own assignments.',
  })
  @ApiBody({ schema: { example: { assignmentId: 'uuid', permissions: [{ permission: 'view_bookings', isGranted: true }] } } })
  @ApiResponse({ status: 200, description: 'Permissions updated' })
  async setPermissions(
    @Request() req,
    @Body() body: {
      assignmentId: string;
      permissions: { permission: PermissionType; isGranted: boolean }[];
    },
  ) {
    return this.rolesService.setPermissions(req.user.id, body.assignmentId, body.permissions);
  }

  @Get('manager/:managerId/permissions')
  @RequireRole('hyper_admin', 'hyper_manager', 'admin', 'manager')
  @ApiOperation({ summary: 'Get manager permissions', description: 'List all assignments and their permissions for a given manager. Admin only sees own assignments.' })
  @ApiParam({ name: 'managerId', example: '5' })
  async getManagerPermissions(@Request() req, @Param('managerId') managerId: string) {
    return this.rolesService.getManagerPermissions(parseInt(managerId, 10), req.user.id);
  }

  @Get('manager/:managerId/properties')
  @RequireRole('hyper_admin', 'hyper_manager', 'admin', 'manager')
  @ApiOperation({ summary: 'Get manager accessible properties', description: 'Returns property IDs the manager can access, or null for "all".' })
  @ApiParam({ name: 'managerId', example: '5' })
  async getManagerProperties(@Param('managerId') managerId: string) {
    return this.rolesService.getManagerProperties(parseInt(managerId, 10));
  }

  // ─── User management ────────────────────────────────────────────────

  @Get('users')
  @RequireRole('hyper_admin', 'hyper_manager', 'admin', 'manager')
  @ApiOperation({
    summary: 'List users with roles',
    description: `Returns users based on caller's role:
    - **hyper_admin / hyper_manager**: all active users
    - **admin**: only guests and managers invited by this admin
    - **manager**: only guests invited by this manager`,
  })
  @ApiResponse({ status: 200, description: 'Array of user objects with role' })
  async getAllUsers(@Request() req) {
    return this.rolesService.getAllUsersWithRoles(req.user.id);
  }

  @Put('users/:userId/status')
  @RequireRole('hyper_admin', 'hyper_manager', 'admin')
  @ApiOperation({
    summary: 'Update user status',
    description: 'Set user active/inactive. Admin can only manage their own managers and guests.',
  })
  @ApiParam({ name: 'userId', example: '5' })
  @ApiBody({ schema: { example: { status: 'active' } } })
  async updateUserStatus(
    @Request() req,
    @Param('userId') userId: string,
    @Body() body: { status: string },
  ) {
    return this.rolesService.updateUserStatus(req.user.id, parseInt(userId, 10), body.status);
  }

  @Delete('users/:userId')
  @RequireRole('hyper_admin', 'hyper_manager')
  @ApiOperation({ summary: 'Delete user', description: 'Permanently delete a user. Only hyper_admin and hyper_manager.' })
  @ApiParam({ name: 'userId', example: '5' })
  async deleteUser(@Request() req, @Param('userId') userId: string) {
    await this.rolesService.deleteUser(req.user.id, parseInt(userId, 10));
    return { success: true };
  }

  @Get('assignments')
  @RequireRole('hyper_admin', 'hyper_manager', 'admin', 'manager')
  @ApiOperation({
    summary: 'List assignments',
    description: `Returns assignments based on caller's role:
    - **hyper**: all active assignments
    - **admin**: only assignments created by this admin
    - **manager**: only this manager's own assignments`,
  })
  async getAllAssignments(@Request() req) {
    return this.rolesService.getAllAssignments(req.user.id);
  }

  @Delete('assignments/:assignmentId')
  @RequireRole('hyper_admin', 'hyper_manager', 'admin')
  @ApiOperation({ summary: 'Remove assignment', description: 'Deactivate a manager assignment. Admin can only remove their own.' })
  @ApiParam({ name: 'assignmentId', description: 'Assignment UUID' })
  async removeAssignment(@Request() req, @Param('assignmentId') assignmentId: string) {
    await this.rolesService.removeAssignment(req.user.id, assignmentId);
    return { success: true };
  }

  @Get('check/:userId/property/:propertyId/:permission')
  @RequireRole('hyper_admin', 'hyper_manager', 'admin', 'manager')
  @ApiOperation({ summary: 'Check permission', description: 'Check if a user has a specific permission for a property.' })
  @ApiParam({ name: 'userId', example: '5' })
  @ApiParam({ name: 'propertyId', description: 'Property UUID' })
  @ApiParam({ name: 'permission', example: 'view_bookings' })
  async checkPermission(
    @Param('userId') userId: string,
    @Param('propertyId') propertyId: string,
    @Param('permission') permission: PermissionType,
  ) {
    const hasPermission = await this.rolesService.hasPermissionForProperty(
      parseInt(userId, 10), propertyId, permission,
    );
    return { hasPermission };
  }
}
