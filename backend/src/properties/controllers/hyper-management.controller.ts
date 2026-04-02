import { Controller, Put, Delete, Param, Body, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { HyperManagementService } from '../services/hyper-management.service';
import { RequireRole } from '../../auth/decorators';
import { PermissionGuard } from '../../auth/guards/permission.guard';

@ApiTags('Hyper Management')
@ApiBearerAuth('JWT-auth')
@Controller('hyper')
@UseGuards(PermissionGuard)
export class HyperManagementController {
  constructor(private readonly hyperService: HyperManagementService) {}

  // ─── Properties ────────────────────────────────────────────────

  @Put('properties/:id/pause')
  @RequireRole('hyper_admin', 'hyper_manager')
  @ApiOperation({ summary: 'Pause a property', description: 'Makes invisible to guests. **Roles**: hyper_admin, hyper_manager' })
  @ApiParam({ name: 'id', format: 'uuid' })
  pauseProperty(@Param('id') id: string, @Request() req: any) {
    return this.hyperService.pauseProperty(id, req.user.id);
  }

  @Put('properties/:id/resume')
  @RequireRole('hyper_admin', 'hyper_manager')
  @ApiOperation({ summary: 'Resume a paused property', description: '**Roles**: hyper_admin, hyper_manager' })
  @ApiParam({ name: 'id', format: 'uuid' })
  resumeProperty(@Param('id') id: string, @Request() req: any) {
    return this.hyperService.resumeProperty(id, req.user.id);
  }

  @Delete('properties/:id/archive')
  @RequireRole('hyper_admin', 'hyper_manager')
  @ApiOperation({ summary: 'Archive a property', description: 'Soft-delete. **Roles**: hyper_admin, hyper_manager' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBody({ schema: { type: 'object', properties: { reason: { type: 'string' } } }, required: false })
  archiveProperty(@Param('id') id: string, @Request() req: any, @Body('reason') reason?: string) {
    return this.hyperService.archiveProperty(id, req.user.id, reason);
  }

  @Delete('properties/:id')
  @RequireRole('hyper_admin')
  @ApiOperation({ summary: 'Permanently delete property', description: '**Roles**: hyper_admin only' })
  @ApiParam({ name: 'id', format: 'uuid' })
  deleteProperty(@Param('id') id: string, @Request() req: any) {
    return this.hyperService.deleteProperty(id, req.user.id);
  }

  // ─── Services ─────────────────────────────────────────────────

  @Put('services/:id/pause')
  @RequireRole('hyper_admin', 'hyper_manager')
  @ApiOperation({ summary: 'Pause a service', description: '**Roles**: hyper_admin, hyper_manager' })
  @ApiParam({ name: 'id', format: 'uuid' })
  pauseService(@Param('id') id: string, @Request() req: any) {
    return this.hyperService.pauseService(id, req.user.id);
  }

  @Put('services/:id/resume')
  @RequireRole('hyper_admin', 'hyper_manager')
  @ApiOperation({ summary: 'Resume a paused service', description: '**Roles**: hyper_admin, hyper_manager' })
  @ApiParam({ name: 'id', format: 'uuid' })
  resumeService(@Param('id') id: string, @Request() req: any) {
    return this.hyperService.resumeService(id, req.user.id);
  }

  @Delete('services/:id/archive')
  @RequireRole('hyper_admin', 'hyper_manager')
  @ApiOperation({ summary: 'Archive a service', description: '**Roles**: hyper_admin, hyper_manager' })
  @ApiParam({ name: 'id', format: 'uuid' })
  archiveService(@Param('id') id: string, @Request() req: any, @Body('reason') reason?: string) {
    return this.hyperService.archiveService(id, req.user.id, reason);
  }

  @Delete('services/:id')
  @RequireRole('hyper_admin')
  @ApiOperation({ summary: 'Permanently delete service', description: '**Roles**: hyper_admin only' })
  @ApiParam({ name: 'id', format: 'uuid' })
  deleteService(@Param('id') id: string, @Request() req: any) {
    return this.hyperService.deleteService(id, req.user.id);
  }

  // ─── Users ───────────────────────────────────────────────────

  @Put('users/:id/pause')
  @RequireRole('hyper_admin', 'hyper_manager')
  @ApiOperation({ summary: 'Pause a user (host)', description: 'Cascades to managers, properties, services. **Roles**: hyper_admin, hyper_manager' })
  @ApiParam({ name: 'id', type: 'string' })
  pauseUser(@Param('id') id: string, @Request() req: any) {
    return this.hyperService.pauseUser(parseInt(id, 10), req.user.id);
  }

  @Put('users/:id/resume')
  @RequireRole('hyper_admin', 'hyper_manager')
  @ApiOperation({ summary: 'Resume a paused user', description: '**Roles**: hyper_admin, hyper_manager' })
  @ApiParam({ name: 'id', type: 'string' })
  resumeUser(@Param('id') id: string, @Request() req: any) {
    return this.hyperService.resumeUser(parseInt(id, 10), req.user.id);
  }

  @Delete('users/:id/archive')
  @RequireRole('hyper_admin', 'hyper_manager')
  @ApiOperation({ summary: 'Archive a user', description: 'Cascading deactivation. **Roles**: hyper_admin, hyper_manager' })
  @ApiParam({ name: 'id', type: 'string' })
  archiveUser(@Param('id') id: string, @Request() req: any, @Body('reason') reason?: string) {
    return this.hyperService.archiveUser(parseInt(id, 10), req.user.id, reason);
  }

  @Put('users/:id/reactivate')
  @RequireRole('hyper_admin', 'hyper_manager')
  @ApiOperation({ summary: 'Reactivate archived user', description: '**Roles**: hyper_admin, hyper_manager' })
  @ApiParam({ name: 'id', type: 'string' })
  reactivateUser(@Param('id') id: string, @Request() req: any) {
    return this.hyperService.reactivateUser(parseInt(id, 10), req.user.id);
  }
}
