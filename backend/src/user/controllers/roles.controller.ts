import {
  Controller, Get, Post, Put, Delete, Body, Param, Request, UseGuards, UseInterceptors, Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { RolesService } from '../services/roles.service';
import { AppRole } from '../entity/user.entity';
import { AssignmentScope } from '../entity/manager-assignment.entity';
import { PermissionType } from '../entity/manager-permission.entity';
import { PermissionGuard } from '../../auth/guards/permission.guard';
import { JwtAuthGuard } from '../../auth/jwtAuth.guard';
import { CustomCsrfInterceptor } from '../../services/interceptors/custom.csrf.interceptor';
import { CsrfGenAuth, CsrfCheck } from '@tekuconcept/nestjs-csrf';

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
  @ApiResponse({ status: 200, description: 'Dashboard stats object' })
  async getStats(@Request() req) {
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
    return this.rolesService.assignRole(req.user.id, body.userId, body.role);
  }

  @Delete('user/:userId/:role')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Remove role (demote to user)' })
  @ApiParam({ name: 'userId', example: '5' })
  @ApiParam({ name: 'role', example: 'manager' })
  async removeRole(@Request() req, @Param('userId') userId: string, @Param('role') role: AppRole) {
    await this.rolesService.removeRole(req.user.id, parseInt(userId, 10), role);
    return { success: true };
  }

  @Post('manager/assign')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Assign manager to properties' })
  @ApiBody({ schema: { example: { managerId: 5, scope: 'property', propertyId: 'uuid-here' } } })
  async assignManager(
    @Request() req,
    @Body() body: { managerId: number; scope: AssignmentScope; propertyId?: string; propertyGroupId?: string },
  ) {
    return this.rolesService.assignManager(req.user.id, body.managerId, body.scope, body.propertyId, body.propertyGroupId);
  }

  @Post('manager/permissions')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Set manager permissions' })
  async setPermissions(
    @Request() req,
    @Body() body: { assignmentId: string; permissions: { permission: PermissionType; isGranted: boolean }[] },
  ) {
    return this.rolesService.setPermissions(req.user.id, body.assignmentId, body.permissions);
  }

  @Get('manager/:managerId/permissions')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Get manager permissions' })
  @ApiParam({ name: 'managerId', example: '5' })
  async getManagerPermissions(@Request() req, @Param('managerId') managerId: string) {
    return this.rolesService.getManagerPermissions(parseInt(managerId, 10), req.user.id);
  }

  @Get('manager/:managerId/properties')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Get manager accessible properties' })
  @ApiParam({ name: 'managerId', example: '5' })
  async getManagerProperties(@Param('managerId') managerId: string) {
    return this.rolesService.getManagerProperties(parseInt(managerId, 10));
  }

  @Get('users')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'List users with roles' })
  async getAllUsers(@Request() req) {
    return this.rolesService.getAllUsersWithRoles(req.user.id);
  }

  @Put('users/:userId/status')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Update user status' })
  @ApiParam({ name: 'userId', example: '5' })
  async updateUserStatus(@Request() req, @Param('userId') userId: string, @Body() body: { status: string }) {
    return this.rolesService.updateUserStatus(req.user.id, parseInt(userId, 10), body.status);
  }

  @Delete('users/:userId')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Delete user' })
  @ApiParam({ name: 'userId', example: '5' })
  async deleteUser(@Request() req, @Param('userId') userId: string) {
    await this.rolesService.deleteUser(req.user.id, parseInt(userId, 10));
    return { success: true };
  }

  @Get('assignments')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'List assignments' })
  async getAllAssignments(@Request() req) {
    return this.rolesService.getAllAssignments(req.user.id);
  }

  @Delete('assignments/:assignmentId')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Remove assignment' })
  @ApiParam({ name: 'assignmentId' })
  async removeAssignment(@Request() req, @Param('assignmentId') assignmentId: string) {
    await this.rolesService.removeAssignment(req.user.id, assignmentId);
    return { success: true };
  }

  @Get('check/:userId/property/:propertyId/:permission')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Check permission' })
  async checkPermission(
    @Param('userId') userId: string,
    @Param('propertyId') propertyId: string,
    @Param('permission') permission: PermissionType,
  ) {
    const hasPermission = await this.rolesService.hasPermissionForProperty(parseInt(userId, 10), propertyId, permission);
    return { hasPermission };
  }
}
