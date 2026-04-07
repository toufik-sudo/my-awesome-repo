import {
  Controller, Get, Post, Put, Delete, Body, Param, Request, UseGuards, UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { PropertyGroupsService } from '../services/property-groups.service';
import { PermissionGuard } from '../../auth/guards/permission.guard';
import { JwtAuthGuard } from '../../auth/jwtAuth.guard';
import { CustomCsrfInterceptor } from '../../services/interceptors/custom.csrf.interceptor';
import { CsrfGenAuth, CsrfCheck } from '@tekuconcept/nestjs-csrf';
import { extractScopeContext } from '../../rbac/scope-context';

@ApiTags('Property Groups')
@ApiBearerAuth()
@Controller('property-groups')
@UseGuards(JwtAuthGuard)
@UseInterceptors(CustomCsrfInterceptor)
export class PropertyGroupsController {
  constructor(private readonly groupsService: PropertyGroupsService) {}

  @Get()
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'List property groups' })
  async findAll(@Request() req) {
    const scopeCtx = extractScopeContext(req);
    return this.groupsService.findAll(req.user.id, scopeCtx);
  }

  @Get(':id')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Get property group by ID' })
  @ApiParam({ name: 'id' })
  async findOne(@Param('id') id: string) {
    return this.groupsService.findOne(id);
  }

  @Post()
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Create property group' })
  async create(@Request() req, @Body() body: { name: string; description?: string }) {
    const scopeCtx = extractScopeContext(req);
    return this.groupsService.create(req.user.id, body.name, body.description);
  }

  @Put(':id')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Update property group' })
  @ApiParam({ name: 'id' })
  async update(@Request() req, @Param('id') id: string, @Body() body: { name?: string; description?: string; isActive?: boolean }) {
    const scopeCtx = extractScopeContext(req);
    return this.groupsService.update(req.user.id, id, body);
  }

  @Delete(':id')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Delete property group' })
  @ApiParam({ name: 'id' })
  async remove(@Request() req, @Param('id') id: string) {
    const scopeCtx = extractScopeContext(req);
    await this.groupsService.remove(req.user.id, id);
    return { success: true };
  }

  @Post(':id/properties')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Add property to group' })
  @ApiParam({ name: 'id' })
  async addProperty(@Request() req, @Param('id') groupId: string, @Body() body: { propertyId: string }) {
    const scopeCtx = extractScopeContext(req);
    return this.groupsService.addPropertyToGroup(req.user.id, groupId, body.propertyId);
  }

  @Delete(':id/properties/:propertyId')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Remove property from group' })
  @ApiParam({ name: 'id' })
  @ApiParam({ name: 'propertyId' })
  async removeProperty(@Request() req, @Param('id') groupId: string, @Param('propertyId') propertyId: string) {
    const scopeCtx = extractScopeContext(req);
    await this.groupsService.removePropertyFromGroup(req.user.id, groupId, propertyId);
    return { success: true };
  }

  @Get(':id/properties')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'List properties in group' })
  @ApiParam({ name: 'id' })
  async getGroupProperties(@Param('id') groupId: string, @Request() req: any) {
    const scopeCtx = extractScopeContext(req);
    return this.groupsService.getGroupProperties(groupId);
  }
}
