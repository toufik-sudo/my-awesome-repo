import {
  Controller, Get, Post, Put, Delete, Body, Param, Request, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';
import { PropertyGroupsService } from '../services/property-groups.service';
import { RequireRole } from '../../auth/decorators';
import { PermissionGuard } from '../../auth/guards/permission.guard';

@ApiTags('Property Groups')
@ApiBearerAuth()
@Controller('property-groups')
@UseGuards(PermissionGuard)
export class PropertyGroupsController {
  constructor(private readonly groupsService: PropertyGroupsService) {}

  @Get()
  @RequireRole('hyper_admin', 'hyper_manager', 'admin')
  @ApiOperation({ summary: 'List property groups', description: 'Hyper roles see all groups. Admin sees only their own groups.' })
  @ApiResponse({ status: 200, description: 'Array of PropertyGroup objects' })
  async findAll(@Request() req) {
    return this.groupsService.findAll(req.user.id);
  }

  @Get(':id')
  @RequireRole('hyper_admin', 'hyper_manager', 'admin')
  @ApiOperation({ summary: 'Get property group by ID' })
  @ApiParam({ name: 'id', description: 'Group UUID' })
  async findOne(@Param('id') id: string) {
    return this.groupsService.findOne(id);
  }

  // [BE-07] Only admin can create groups — hyper_admin removed
  @Post()
  @RequireRole('admin')
  @ApiOperation({ summary: 'Create property group', description: 'Only admin can create. Hyper roles cannot.' })
  @ApiBody({ schema: { example: { name: 'Coastal Properties', description: 'All seaside properties' } } })
  @ApiResponse({ status: 201, description: 'Group created' })
  async create(@Request() req, @Body() body: { name: string; description?: string }) {
    return this.groupsService.create(req.user.id, body.name, body.description);
  }

  @Put(':id')
  @RequireRole('admin')
  @ApiOperation({ summary: 'Update property group', description: 'Admin can only update their own groups.' })
  @ApiParam({ name: 'id', description: 'Group UUID' })
  async update(@Request() req, @Param('id') id: string, @Body() body: { name?: string; description?: string; isActive?: boolean }) {
    return this.groupsService.update(req.user.id, id, body);
  }

  @Delete(':id')
  @RequireRole('hyper_admin', 'hyper_manager', 'admin')
  @ApiOperation({ summary: 'Delete property group', description: 'Hyper roles and admin can delete.' })
  @ApiParam({ name: 'id', description: 'Group UUID' })
  async remove(@Request() req, @Param('id') id: string) {
    await this.groupsService.remove(req.user.id, id);
    return { success: true };
  }

  @Post(':id/properties')
  @RequireRole('admin')
  @ApiOperation({ summary: 'Add property to group' })
  @ApiParam({ name: 'id', description: 'Group UUID' })
  @ApiBody({ schema: { example: { propertyId: 'property-uuid' } } })
  async addProperty(@Request() req, @Param('id') groupId: string, @Body() body: { propertyId: string }) {
    return this.groupsService.addPropertyToGroup(req.user.id, groupId, body.propertyId);
  }

  @Delete(':id/properties/:propertyId')
  @RequireRole('hyper_admin', 'hyper_manager', 'admin')
  @ApiOperation({ summary: 'Remove property from group' })
  @ApiParam({ name: 'id', description: 'Group UUID' })
  @ApiParam({ name: 'propertyId', description: 'Property UUID' })
  async removeProperty(@Request() req, @Param('id') groupId: string, @Param('propertyId') propertyId: string) {
    await this.groupsService.removePropertyFromGroup(req.user.id, groupId, propertyId);
    return { success: true };
  }

  @Get(':id/properties')
  @RequireRole('hyper_admin', 'hyper_manager', 'admin')
  @ApiOperation({ summary: 'List properties in group' })
  @ApiParam({ name: 'id', description: 'Group UUID' })
  async getGroupProperties(@Param('id') groupId: string) {
    return this.groupsService.getGroupProperties(groupId);
  }
}
