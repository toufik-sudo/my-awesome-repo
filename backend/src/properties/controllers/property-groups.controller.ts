import {
  Controller, Get, Post, Put, Delete, Body, Param, Request, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { PropertyGroupsService } from '../services/property-groups.service';
import { RequireRole } from '../../auth/decorators';
import { PermissionGuard } from '../../auth/guards/permission.guard';

@ApiTags('Property Groups')
@ApiBearerAuth('JWT-auth')
@Controller('property-groups')
@UseGuards(PermissionGuard)
@RequireRole('hyper_admin', 'hyper_manager', 'admin')
export class PropertyGroupsController {
  constructor(private readonly groupsService: PropertyGroupsService) {}

  @Get()
  @ApiOperation({ summary: 'List property groups', description: '**Roles**: hyper_admin, hyper_manager, admin' })
  async findAll(@Request() req) {
    return this.groupsService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get property group details' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async findOne(@Param('id') id: string) {
    return this.groupsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a property group' })
  @ApiBody({ schema: { type: 'object', required: ['name'], properties: { name: { type: 'string' }, description: { type: 'string' } } } })
  async create(@Request() req, @Body() body: { name: string; description?: string }) {
    return this.groupsService.create(req.user.id, body.name, body.description);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a property group' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async update(@Request() req, @Param('id') id: string, @Body() body: { name?: string; description?: string; isActive?: boolean }) {
    return this.groupsService.update(req.user.id, id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a property group' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async remove(@Request() req, @Param('id') id: string) {
    await this.groupsService.remove(req.user.id, id);
    return { success: true };
  }

  @Post(':id/properties')
  @ApiOperation({ summary: 'Add property to group' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBody({ schema: { type: 'object', required: ['propertyId'], properties: { propertyId: { type: 'string', format: 'uuid' } } } })
  async addProperty(@Request() req, @Param('id') groupId: string, @Body() body: { propertyId: string }) {
    return this.groupsService.addPropertyToGroup(req.user.id, groupId, body.propertyId);
  }

  @Delete(':id/properties/:propertyId')
  @ApiOperation({ summary: 'Remove property from group' })
  async removeProperty(@Request() req, @Param('id') groupId: string, @Param('propertyId') propertyId: string) {
    await this.groupsService.removePropertyFromGroup(req.user.id, groupId, propertyId);
    return { success: true };
  }

  @Get(':id/properties')
  @ApiOperation({ summary: 'List properties in group' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async getGroupProperties(@Param('id') groupId: string) {
    return this.groupsService.getGroupProperties(groupId);
  }
}
