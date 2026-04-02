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
  @ApiOperation({
    summary: 'Dashboard role statistics',
    description: `Returns counts of users per role for the admin dashboard.

**Roles**: \`admin\`, \`hyper_admin\`, \`hyper_manager\`

**Example response**:
\`\`\`json
{
  "totalUsers": 42,
  "totalAdmins": 3,
  "totalManagers": 5,
  "totalRegularUsers": 34,
  "activeManagers": 4,
  "totalAssignments": 8,
  "pendingVerifications": 2
}
\`\`\``,
  })
  @ApiResponse({ status: 200, description: 'Role statistics object with counts per role, assignments, and verifications' })
  @ApiResponse({ status: 403, description: 'Forbidden — caller does not have admin+ role' })
  async getStats() {
    return this.rolesService.getDashboardStats();
  }

  @Get('user/:userId')
  @RequireRole('admin', 'manager')
  @ApiOperation({
    summary: 'Get user roles',
    description: `Returns all roles assigned to a specific user by their ID.

**Roles**: \`admin\`, \`manager\`, \`hyper_admin\`, \`hyper_manager\`

**Example response**: \`["admin", "user"]\``,
  })
  @ApiParam({ name: 'userId', type: 'string', description: 'Numeric user ID', example: '5' })
  @ApiResponse({ status: 200, description: 'Array of role strings', schema: { type: 'array', items: { type: 'string', enum: ['hyper_admin', 'hyper_manager', 'admin', 'manager', 'user'] } } })
  @ApiResponse({ status: 403, description: 'Forbidden — insufficient role' })
  async getUserRoles(@Param('userId') userId: string) {
    return this.rolesService.getUserRoles(parseInt(userId, 10));
  }

  @Post('assign')
  @RequireRole('admin')
  @ApiOperation({
    summary: 'Assign a role to a user',
    description: `Assigns a new role to a user. Enforces incompatibility rules (e.g., hyper_admin cannot hold admin or manager).

**Roles**: \`admin\`, \`hyper_admin\`, \`hyper_manager\`

**Incompatibility rules**:
- \`hyper_admin\` ↔ \`hyper_manager\`, \`admin\`, \`manager\`
- \`admin\` / \`manager\` ↔ \`hyper_admin\`, \`hyper_manager\`
- \`user\` is always compatible

**Example request**:
\`\`\`json
{ "userId": 5, "role": "manager" }
\`\`\``,
  })
  @ApiBody({ schema: { type: 'object', required: ['userId', 'role'], properties: {
    userId: { type: 'number', example: 5, description: 'Target user ID' },
    role: { type: 'string', enum: ['hyper_admin', 'hyper_manager', 'admin', 'manager', 'user'], example: 'manager', description: 'Role to assign' },
  }}})
  @ApiResponse({ status: 201, description: 'Role assigned successfully — returns the UserRole record' })
  @ApiResponse({ status: 409, description: 'Conflict — role is incompatible with existing roles' })
  @ApiResponse({ status: 403, description: 'Forbidden — insufficient role' })
  async assignRole(
    @Request() req,
    @Body() body: { userId: number; role: AppRole },
  ) {
    return this.rolesService.assignRole(req.user.id, body.userId, body.role);
  }

  @Delete('user/:userId/:role')
  @RequireRole('admin')
  @ApiOperation({
    summary: 'Remove a role from a user',
    description: `Removes a specific role from a user. Cannot remove the base 'user' role if it's the only one.

**Roles**: \`admin\`, \`hyper_admin\`, \`hyper_manager\`

**Example**: \`DELETE /api/roles/user/5/manager\``,
  })
  @ApiParam({ name: 'userId', type: 'string', example: '5', description: 'Numeric user ID' })
  @ApiParam({ name: 'role', type: 'string', enum: ['hyper_admin', 'hyper_manager', 'admin', 'manager', 'user'], example: 'manager' })
  @ApiResponse({ status: 200, description: 'Role removed — returns { success: true }' })
  @ApiResponse({ status: 403, description: 'Forbidden — insufficient role' })
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
  @ApiOperation({
    summary: 'Assign manager to property/group',
    description: `Delegates management scope to a manager user. Scope determines what the manager can access:
- \`all\`: All properties of the admin
- \`property\`: A single property (requires propertyId)
- \`property_group\`: A property group (requires propertyGroupId)

**Roles**: \`admin\`, \`hyper_admin\`, \`hyper_manager\`

**Example request**:
\`\`\`json
{
  "managerId": 10,
  "scope": "property",
  "propertyId": "550e8400-e29b-41d4-a716-446655440000"
}
\`\`\``,
  })
  @ApiBody({ schema: { type: 'object', required: ['managerId', 'scope'], properties: {
    managerId: { type: 'number', example: 10, description: 'User ID of the manager to assign' },
    scope: { type: 'string', enum: ['property', 'property_group', 'all'], example: 'property', description: 'Scope of the assignment' },
    propertyId: { type: 'string', format: 'uuid', description: 'Required when scope=property' },
    propertyGroupId: { type: 'string', format: 'uuid', description: 'Required when scope=property_group' },
  }}})
  @ApiResponse({ status: 201, description: 'Assignment created — returns the ManagerAssignment record' })
  @ApiResponse({ status: 400, description: 'Bad request — missing propertyId/propertyGroupId for the given scope' })
  @ApiResponse({ status: 403, description: 'Forbidden — insufficient role' })
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
  @ApiOperation({
    summary: 'Set manager permissions',
    description: `Grant or revoke specific permissions for a manager assignment. Each permission controls a specific action the manager can perform.

**Roles**: \`admin\`, \`hyper_admin\`, \`hyper_manager\`

**Available permissions**: \`create_property\`, \`modify_property\`, \`delete_property\`, \`modify_prices\`, \`modify_photos\`, \`view_bookings\`, \`accept_bookings\`, \`reject_bookings\`, \`reply_chat\`, \`reply_reviews\`, \`reply_comments\`, \`manage_availability\`, etc.

**Example request**:
\`\`\`json
{
  "assignmentId": "550e8400-e29b-41d4-a716-446655440000",
  "permissions": [
    { "permission": "modify_prices", "isGranted": true },
    { "permission": "delete_property", "isGranted": false }
  ]
}
\`\`\``,
  })
  @ApiBody({ schema: { type: 'object', required: ['assignmentId', 'permissions'], properties: {
    assignmentId: { type: 'string', format: 'uuid' },
    permissions: { type: 'array', items: { type: 'object', properties: {
      permission: { type: 'string', example: 'modify_prices', description: 'Permission identifier' },
      isGranted: { type: 'boolean', example: true, description: 'Whether to grant (true) or revoke (false)' },
    }}},
  }}})
  @ApiResponse({ status: 201, description: 'Permissions updated — returns array of ManagerPermission records' })
  @ApiResponse({ status: 403, description: 'Forbidden — insufficient role' })
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
  @ApiOperation({
    summary: 'Get manager permissions',
    description: `Returns all permission records for a specific manager across all their assignments.

**Roles**: \`admin\`, \`manager\` (own permissions), \`hyper_admin\`, \`hyper_manager\``,
  })
  @ApiParam({ name: 'managerId', type: 'string', example: '10', description: 'User ID of the manager' })
  @ApiResponse({ status: 200, description: 'Array of ManagerPermission records with assignment context' })
  async getManagerPermissions(@Param('managerId') managerId: string) {
    return this.rolesService.getManagerPermissions(parseInt(managerId, 10));
  }

  @Get('manager/:managerId/properties')
  @RequireRole('admin', 'manager')
  @ApiOperation({
    summary: 'Get manager assigned properties',
    description: `Lists all properties a manager has been assigned to manage, with scope info.

**Roles**: \`admin\`, \`manager\` (own assignments), \`hyper_admin\`, \`hyper_manager\``,
  })
  @ApiParam({ name: 'managerId', type: 'string', example: '10' })
  @ApiResponse({ status: 200, description: 'Array of ManagerAssignment records with property details' })
  async getManagerProperties(@Param('managerId') managerId: string) {
    return this.rolesService.getManagerProperties(parseInt(managerId, 10));
  }

  @Get('users')
  @RequireRole('hyper_admin', 'hyper_manager', 'admin')
  @ApiOperation({
    summary: 'List all users with roles',
    description: `Returns all users in the system with their assigned roles. Used for user management dashboards.

**Roles**: \`hyper_admin\`, \`hyper_manager\`, \`admin\`

**Example response**:
\`\`\`json
[
  { "id": 1, "email": "admin@example.com", "firstName": "Sofiane", "lastName": "H.", "roles": ["hyper_admin", "user"], "isActive": true }
]
\`\`\``,
  })
  @ApiResponse({ status: 200, description: 'Array of UserWithRoles objects' })
  async getAllUsers() {
    return this.rolesService.getAllUsersWithRoles();
  }

  @Put('users/:userId/status')
  @RequireRole('hyper_admin', 'hyper_manager', 'admin')
  @ApiOperation({
    summary: 'Update user status',
    description: `Activate, pause, or disable a user account. Paused users cannot login. Disabled accounts are deactivated.

**Roles**: \`hyper_admin\`, \`hyper_manager\`, \`admin\`

**Status values**: \`active\`, \`paused\`, \`disabled\`

**Example request**: \`{ "status": "paused" }\``,
  })
  @ApiParam({ name: 'userId', type: 'string', example: '5' })
  @ApiBody({ schema: { type: 'object', required: ['status'], properties: { status: { type: 'string', enum: ['active', 'paused', 'disabled'], example: 'paused', description: 'New user status' } } } })
  @ApiResponse({ status: 200, description: 'Status updated — returns updated user record' })
  @ApiResponse({ status: 403, description: 'Forbidden — cannot modify a higher-ranked user' })
  async updateUserStatus(
    @Request() req,
    @Param('userId') userId: string,
    @Body() body: { status: string },
  ) {
    return this.rolesService.updateUserStatus(req.user.id, parseInt(userId, 10), body.status);
  }

  @Delete('users/:userId')
  @RequireRole('hyper_admin', 'hyper_manager')
  @ApiOperation({
    summary: 'Permanently delete a user',
    description: `Permanently removes a user and all associated data. This is irreversible.

**Roles**: \`hyper_admin\`, \`hyper_manager\` only

**Warning**: This cascades to bookings, reviews, roles, points, etc.`,
  })
  @ApiParam({ name: 'userId', type: 'string', example: '5' })
  @ApiResponse({ status: 200, description: 'User deleted — returns { success: true }' })
  @ApiResponse({ status: 403, description: 'Forbidden — only hyper roles can delete users' })
  async deleteUser(
    @Request() req,
    @Param('userId') userId: string,
  ) {
    await this.rolesService.deleteUser(req.user.id, parseInt(userId, 10));
    return { success: true };
  }

  @Get('assignments')
  @RequireRole('hyper_admin', 'hyper_manager', 'admin')
  @ApiOperation({
    summary: 'List all manager assignments',
    description: `Returns all manager-to-property/group assignments. Admins see their own assignments; hyper roles see all.

**Roles**: \`hyper_admin\`, \`hyper_manager\`, \`admin\``,
  })
  @ApiResponse({ status: 200, description: 'Array of ManagerAssignment records with property/group details' })
  async getAllAssignments() {
    return this.rolesService.getAllAssignments();
  }

  @Delete('assignments/:assignmentId')
  @RequireRole('hyper_admin', 'hyper_manager', 'admin')
  @ApiOperation({
    summary: 'Remove a manager assignment',
    description: `Deletes a manager assignment and all associated permissions. The manager loses access to the assigned properties.

**Roles**: \`hyper_admin\`, \`hyper_manager\`, \`admin\``,
  })
  @ApiParam({ name: 'assignmentId', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Assignment removed — returns { success: true }' })
  async removeAssignment(
    @Request() req,
    @Param('assignmentId') assignmentId: string,
  ) {
    await this.rolesService.removeAssignment(req.user.id, assignmentId);
    return { success: true };
  }

  @Get('check/:userId/property/:propertyId/:permission')
  @RequireRole('admin')
  @ApiOperation({
    summary: 'Check user permission on a property',
    description: `Verifies whether a user has a specific permission on a given property. Useful for UI permission checks.

**Roles**: \`admin\`, \`hyper_admin\`, \`hyper_manager\`

**Example**: \`GET /api/roles/check/10/property/550e.../modify_prices\`

**Response**: \`{ "hasPermission": true }\``,
  })
  @ApiParam({ name: 'userId', type: 'string', example: '10' })
  @ApiParam({ name: 'propertyId', type: 'string', format: 'uuid' })
  @ApiParam({ name: 'permission', type: 'string', example: 'modify_prices', description: 'Permission type to check' })
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
