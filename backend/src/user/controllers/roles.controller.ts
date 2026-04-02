import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { RolesService } from '../services/roles.service';
import { AppRole } from '../entity/user-role.entity';
import { AssignmentScope } from '../entity/manager-assignment.entity';
import { PermissionType } from '../entity/manager-permission.entity';
import { RequireRole } from '../../auth/decorators';
import { PermissionGuard } from '../../auth/guards/permission.guard';

@ApiTags('Roles')
@ApiBearerAuth('JWT-auth')
@Controller('roles')
@UseGuards(PermissionGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get('stats')
  @RequireRole('admin')
  @ApiOperation({ summary: 'Dashboard role statistics', description: 'Get counts of users per role. **Roles**: admin+' })
  @ApiResponse({ status: 200, description: 'Role statistics' })
  async getStats() {
    return this.rolesService.getDashboardStats();
  }

  @Get('user/:userId')
  @RequireRole('admin', 'manager')
  @ApiOperation({ summary: 'Get user roles', description: 'Get all roles assigned to a specific user. **Roles**: admin, manager' })
  @ApiParam({ name: 'userId', type: 'string', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Array of role strings', schema: { type: 'array', items: { type: 'string', enum: ['hyper_admin', 'hyper_manager', 'admin', 'manager', 'user'] } } })
  async getUserRoles(@Param('userId') userId: string) {
    return this.rolesService.getUserRoles(parseInt(userId, 10));
  }

  @Post('assign')
  @RequireRole('admin')
  @ApiOperation({ summary: 'Assign a role to user', description: 'Assign a role. Respects incompatibility rules. **Roles**: admin+' })
  @ApiBody({ schema: { type: 'object', required: ['userId', 'role'], properties: {
    userId: { type: 'number', example: 5 },
    role: { type: 'string', enum: ['hyper_admin', 'hyper_manager', 'admin', 'manager', 'user'], example: 'manager' },
  }}})
  @ApiResponse({ status: 201, description: 'Role assigned' })
  @ApiResponse({ status: 409, description: 'Incompatible role' })
  async assignRole(
    @Request() req,
    @Body() body: { userId: number; role: AppRole },
  ) {
    return this.rolesService.assignRole(req.user.id, body.userId, body.role);
  }

  @Delete('user/:userId/:role')
  @RequireRole('admin')
  @ApiOperation({ summary: 'Remove a role from user', description: '**Roles**: admin+' })
  @ApiParam({ name: 'userId', type: 'string' })
  @ApiParam({ name: 'role', type: 'string', enum: ['hyper_admin', 'hyper_manager', 'admin', 'manager', 'user'] })
  async removeRole(
    @Request() req,
    @Param('userId') userId: string,
    @Param('role') role: AppRole,
  ) {
    await this.rolesService.removeRole(req.user.id, parseInt(userId, 10), role);
    return { success: true };
  }

  @Post('manager/assign')
  @RequireRole('admin')
  @ApiOperation({ summary: 'Assign manager to property/group', description: 'Delegate management scope. **Roles**: admin+' })
  @ApiBody({ schema: { type: 'object', required: ['managerId', 'scope'], properties: {
    managerId: { type: 'number', example: 10 },
    scope: { type: 'string', enum: ['property', 'property_group', 'all'], example: 'property' },
    propertyId: { type: 'string', format: 'uuid', description: 'Required if scope=property' },
    propertyGroupId: { type: 'string', format: 'uuid', description: 'Required if scope=property_group' },
  }}})
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
  @RequireRole('admin')
  @ApiOperation({ summary: 'Set manager permissions', description: 'Grant/revoke specific permissions for an assignment. **Roles**: admin+' })
  @ApiBody({ schema: { type: 'object', required: ['assignmentId', 'permissions'], properties: {
    assignmentId: { type: 'string', format: 'uuid' },
    permissions: { type: 'array', items: { type: 'object', properties: {
      permission: { type: 'string', example: 'modify_prices' },
      isGranted: { type: 'boolean', example: true },
    }}},
  }}})
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
  @RequireRole('admin', 'manager')
  @ApiOperation({ summary: 'Get manager permissions', description: '**Roles**: admin, manager' })
  @ApiParam({ name: 'managerId', type: 'string' })
  async getManagerPermissions(@Param('managerId') managerId: string) {
    return this.rolesService.getManagerPermissions(parseInt(managerId, 10));
  }

  @Get('manager/:managerId/properties')
  @RequireRole('admin', 'manager')
  @ApiOperation({ summary: 'Get manager assigned properties', description: '**Roles**: admin, manager' })
  @ApiParam({ name: 'managerId', type: 'string' })
  async getManagerProperties(@Param('managerId') managerId: string) {
    return this.rolesService.getManagerProperties(parseInt(managerId, 10));
  }

  @Get('users')
  @RequireRole('hyper_admin', 'hyper_manager', 'admin')
  @ApiOperation({ summary: 'List all users with roles', description: '**Roles**: hyper_admin, hyper_manager, admin' })
  @ApiResponse({ status: 200, description: 'Array of users with their roles' })
  async getAllUsers() {
    return this.rolesService.getAllUsersWithRoles();
  }

  @Put('users/:userId/status')
  @RequireRole('hyper_admin', 'hyper_manager', 'admin')
  @ApiOperation({ summary: 'Update user status', description: 'Activate/deactivate a user. **Roles**: hyper_admin, hyper_manager, admin' })
  @ApiParam({ name: 'userId', type: 'string' })
  @ApiBody({ schema: { type: 'object', properties: { status: { type: 'string', enum: ['active', 'paused', 'disabled'] } } } })
  async updateUserStatus(
    @Request() req,
    @Param('userId') userId: string,
    @Body() body: { status: string },
  ) {
    return this.rolesService.updateUserStatus(req.user.id, parseInt(userId, 10), body.status);
  }

  @Delete('users/:userId')
  @RequireRole('hyper_admin', 'hyper_manager')
  @ApiOperation({ summary: 'Delete a user', description: '**Roles**: hyper_admin, hyper_manager only' })
  @ApiParam({ name: 'userId', type: 'string' })
  async deleteUser(
    @Request() req,
    @Param('userId') userId: string,
  ) {
    await this.rolesService.deleteUser(req.user.id, parseInt(userId, 10));
    return { success: true };
  }

  @Get('assignments')
  @RequireRole('hyper_admin', 'hyper_manager', 'admin')
  @ApiOperation({ summary: 'List all manager assignments', description: '**Roles**: hyper_admin, hyper_manager, admin' })
  async getAllAssignments() {
    return this.rolesService.getAllAssignments();
  }

  @Delete('assignments/:assignmentId')
  @RequireRole('hyper_admin', 'hyper_manager', 'admin')
  @ApiOperation({ summary: 'Remove a manager assignment', description: '**Roles**: hyper_admin, hyper_manager, admin' })
  @ApiParam({ name: 'assignmentId', type: 'string', format: 'uuid' })
  async removeAssignment(
    @Request() req,
    @Param('assignmentId') assignmentId: string,
  ) {
    await this.rolesService.removeAssignment(req.user.id, assignmentId);
    return { success: true };
  }

  @Get('check/:userId/property/:propertyId/:permission')
  @RequireRole('admin')
  @ApiOperation({ summary: 'Check user permission on property', description: 'Verify if a user has a specific permission. **Roles**: admin' })
  @ApiParam({ name: 'userId', type: 'string' })
  @ApiParam({ name: 'propertyId', type: 'string', format: 'uuid' })
  @ApiParam({ name: 'permission', type: 'string', description: 'Permission type to check' })
  @ApiResponse({ status: 200, schema: { type: 'object', properties: { hasPermission: { type: 'boolean' } } } })
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
