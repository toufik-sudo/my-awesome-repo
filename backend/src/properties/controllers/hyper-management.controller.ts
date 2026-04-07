import { Controller, Put, Delete, Param, Body, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { HyperManagementService } from '../services/hyper-management.service';
import { PermissionGuard } from '../../auth/guards/permission.guard';
import { JwtAuthGuard } from '../../auth/jwtAuth.guard';
import { CustomCsrfInterceptor } from '../../services/interceptors/custom.csrf.interceptor';
import { CsrfGenAuth, CsrfCheck } from '@tekuconcept/nestjs-csrf';
import { extractScopeContext } from '../../rbac/scope-context';

@ApiTags('Hyper Management')
@ApiBearerAuth('JWT-auth')
@Controller('hyper')
@UseGuards(JwtAuthGuard)
@UseInterceptors(CustomCsrfInterceptor)
export class HyperManagementController {
  constructor(private readonly hyperService: HyperManagementService) {}

  // ─── Properties ────────────────────────────────────────────────

  @Put('properties/:id/pause')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Pause a property' })
  @ApiParam({ name: 'id', format: 'uuid' })
  pauseProperty(@Param('id') id: string, @Request() req: any) {
    const scopeCtx = extractScopeContext(req);
    return this.hyperService.pauseProperty(id, req.user.id);
  }

  @Put('properties/:id/resume')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Resume a paused property' })
  @ApiParam({ name: 'id', format: 'uuid' })
  resumeProperty(@Param('id') id: string, @Request() req: any) {
    const scopeCtx = extractScopeContext(req);
    return this.hyperService.resumeProperty(id, req.user.id);
  }

  @Delete('properties/:id/archive')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Archive a property' })
  @ApiParam({ name: 'id', format: 'uuid' })
  archiveProperty(@Param('id') id: string, @Request() req: any, @Body('reason') reason?: string) {
    const scopeCtx = extractScopeContext(req);
    return this.hyperService.archiveProperty(id, req.user.id, reason);
  }

  @Delete('properties/:id')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Permanently delete property' })
  @ApiParam({ name: 'id', format: 'uuid' })
  deleteProperty(@Param('id') id: string, @Request() req: any) {
    const scopeCtx = extractScopeContext(req);
    return this.hyperService.deleteProperty(id, req.user.id);
  }

  // ─── Services ─────────────────────────────────────────────────

  @Put('services/:id/pause')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Pause a service' })
  @ApiParam({ name: 'id', format: 'uuid' })
  pauseService(@Param('id') id: string, @Request() req: any) {
    const scopeCtx = extractScopeContext(req);
    return this.hyperService.pauseService(id, req.user.id);
  }

  @Put('services/:id/resume')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Resume a paused service' })
  @ApiParam({ name: 'id', format: 'uuid' })
  resumeService(@Param('id') id: string, @Request() req: any) {
    const scopeCtx = extractScopeContext(req);
    return this.hyperService.resumeService(id, req.user.id);
  }

  @Delete('services/:id/archive')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Archive a service' })
  @ApiParam({ name: 'id', format: 'uuid' })
  archiveService(@Param('id') id: string, @Request() req: any, @Body('reason') reason?: string) {
    const scopeCtx = extractScopeContext(req);
    return this.hyperService.archiveService(id, req.user.id, reason);
  }

  @Delete('services/:id')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Permanently delete service' })
  @ApiParam({ name: 'id', format: 'uuid' })
  deleteService(@Param('id') id: string, @Request() req: any) {
    const scopeCtx = extractScopeContext(req);
    return this.hyperService.deleteService(id, req.user.id);
  }

  // ─── Users ───────────────────────────────────────────────────

  @Put('users/:id/pause')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Pause a user (host)' })
  @ApiParam({ name: 'id', type: 'string' })
  pauseUser(@Param('id') id: string, @Request() req: any) {
    const scopeCtx = extractScopeContext(req);
    return this.hyperService.pauseUser(parseInt(id, 10), req.user.id);
  }

  @Put('users/:id/resume')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Resume a paused user' })
  @ApiParam({ name: 'id', type: 'string' })
  resumeUser(@Param('id') id: string, @Request() req: any) {
    const scopeCtx = extractScopeContext(req);
    return this.hyperService.resumeUser(parseInt(id, 10), req.user.id);
  }

  @Delete('users/:id/archive')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Archive a user' })
  @ApiParam({ name: 'id', type: 'string' })
  archiveUser(@Param('id') id: string, @Request() req: any, @Body('reason') reason?: string) {
    const scopeCtx = extractScopeContext(req);
    return this.hyperService.archiveUser(parseInt(id, 10), req.user.id, reason);
  }

  @Put('users/:id/reactivate')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Reactivate archived user' })
  @ApiParam({ name: 'id', type: 'string' })
  reactivateUser(@Param('id') id: string, @Request() req: any) {
    const scopeCtx = extractScopeContext(req);
    return this.hyperService.reactivateUser(parseInt(id, 10), req.user.id);
  }
}
