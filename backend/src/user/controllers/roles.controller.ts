import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from '../services/roles.service';
import { AppRole } from '../entity/user-role.entity';
import { AssignmentScope } from '../entity/manager-assignment.entity';
import { PermissionType } from '../entity/manager-permission.entity';
import { RequireRole } from '../../auth/decorators';
import { PermissionGuard } from '../../auth/guards/permission.guard';

@Controller('roles')
@UseGuards(PermissionGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get('stats')
  @RequireRole('admin')
  async getStats() {
    return this.rolesService.getDashboardStats();
  }

  @Get('user/:userId')
  @RequireRole('admin', 'manager')
  async getUserRoles(@Param('userId') userId: string) {
    return this.rolesService.getUserRoles(parseInt(userId, 10));
  }

  @Post('assign')
  @RequireRole('admin')
  async assignRole(
    @Request() req,
    @Body() body: { userId: number; role: AppRole },
  ) {
    return this.rolesService.assignRole(req.user.id, body.userId, body.role);
  }

  @Delete('user/:userId/:role')
  @RequireRole('admin')
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
      req.user.id,
      body.managerId,
      body.scope,
      body.propertyId,
      body.propertyGroupId,
    );
  }

  @Post('manager/permissions')
  @RequireRole('admin')
  async setPermissions(
    @Request() req,
    @Body() body: {
      assignmentId: string;
      permissions: { permission: PermissionType; isGranted: boolean }[];
    },
  ) {
    return this.rolesService.setPermissions(
      req.user.id,
      body.assignmentId,
      body.permissions,
    );
  }

  @Get('manager/:managerId/permissions')
  @RequireRole('admin', 'manager')
  async getManagerPermissions(@Param('managerId') managerId: string) {
    return this.rolesService.getManagerPermissions(parseInt(managerId, 10));
  }

  @Get('manager/:managerId/properties')
  @RequireRole('admin', 'manager')
  async getManagerProperties(@Param('managerId') managerId: string) {
    return this.rolesService.getManagerProperties(parseInt(managerId, 10));
  }

  @Get('check/:userId/property/:propertyId/:permission')
  @RequireRole('admin')
  async checkPermission(
    @Param('userId') userId: string,
    @Param('propertyId') propertyId: string,
    @Param('permission') permission: PermissionType,
  ) {
    const hasPermission = await this.rolesService.hasPermissionForProperty(
      parseInt(userId, 10),
      propertyId,
      permission,
    );
    return { hasPermission };
  }
}
