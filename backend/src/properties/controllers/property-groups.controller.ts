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
import { PropertyGroupsService } from '../services/property-groups.service';
import { RequireRole } from '../../auth/decorators';
import { PermissionGuard } from '../../auth/guards/permission.guard';

@Controller('property-groups')
@UseGuards(PermissionGuard)
@RequireRole('admin')
export class PropertyGroupsController {
  constructor(private readonly groupsService: PropertyGroupsService) {}

  @Get()
  async findAll(@Request() req) {
    return this.groupsService.findAll(req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.groupsService.findOne(id);
  }

  @Post()
  async create(
    @Request() req,
    @Body() body: { name: string; description?: string },
  ) {
    return this.groupsService.create(req.user.id, body.name, body.description);
  }

  @Put(':id')
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() body: { name?: string; description?: string; isActive?: boolean },
  ) {
    return this.groupsService.update(req.user.id, id, body);
  }

  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    await this.groupsService.remove(req.user.id, id);
    return { success: true };
  }

  @Post(':id/properties')
  async addProperty(
    @Request() req,
    @Param('id') groupId: string,
    @Body() body: { propertyId: string },
  ) {
    return this.groupsService.addPropertyToGroup(req.user.id, groupId, body.propertyId);
  }

  @Delete(':id/properties/:propertyId')
  async removeProperty(
    @Request() req,
    @Param('id') groupId: string,
    @Param('propertyId') propertyId: string,
  ) {
    await this.groupsService.removePropertyFromGroup(req.user.id, groupId, propertyId);
    return { success: true };
  }

  @Get(':id/properties')
  async getGroupProperties(@Param('id') groupId: string) {
    return this.groupsService.getGroupProperties(groupId);
  }
}
