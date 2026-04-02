import { Controller, Get, Post, Put, Delete, Param, Body, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceGroup } from '../entity/service-group.entity';
import { ServiceGroupMembership } from '../entity/service-group-membership.entity';
import { JwtAuthGuard } from '../../auth/jwtAuth.guard';
import { RequireRole } from '../../auth/decorators';

@ApiTags('Service Groups')
@ApiBearerAuth('JWT-auth')
@Controller('service-groups')
@UseGuards(JwtAuthGuard)
export class ServiceGroupsController {
  constructor(
    @InjectRepository(ServiceGroup)
    private readonly groupRepo: Repository<ServiceGroup>,
    @InjectRepository(ServiceGroupMembership)
    private readonly membershipRepo: Repository<ServiceGroupMembership>,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List all service groups' })
  findAll() {
    return this.groupRepo.find({ order: { createdAt: 'DESC' } });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get service group details' })
  @ApiParam({ name: 'id', format: 'uuid' })
  findOne(@Param('id') id: string) {
    return this.groupRepo.findOne({ where: { id } });
  }

  @Post()
  @RequireRole('hyper_admin', 'hyper_manager', 'admin')
  @ApiOperation({ summary: 'Create a service group', description: '**Roles**: hyper_admin, hyper_manager, admin' })
  @ApiBody({ schema: { type: 'object', required: ['name'], properties: { name: { type: 'string' }, description: { type: 'string' } } } })
  create(@Request() req: any, @Body() data: { name: string; description?: string }) {
    return this.groupRepo.save(this.groupRepo.create({ ...data, adminId: req.user.id }));
  }

  @Put(':id')
  @RequireRole('hyper_admin', 'hyper_manager', 'admin')
  @ApiOperation({ summary: 'Update a service group', description: '**Roles**: hyper_admin, hyper_manager, admin' })
  @ApiParam({ name: 'id', format: 'uuid' })
  update(@Param('id') id: string, @Body() data: { name?: string; description?: string; isActive?: boolean }) {
    return this.groupRepo.update(id, data);
  }

  @Delete(':id')
  @RequireRole('hyper_admin', 'hyper_manager', 'admin')
  @ApiOperation({ summary: 'Delete a service group', description: '**Roles**: hyper_admin, hyper_manager, admin' })
  @ApiParam({ name: 'id', format: 'uuid' })
  remove(@Param('id') id: string) {
    return this.groupRepo.delete(id);
  }

  @Get(':id/services')
  @ApiOperation({ summary: 'Get services in a group' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async getServices(@Param('id') groupId: string) {
    const memberships = await this.membershipRepo.find({ where: { groupId }, relations: ['service'] });
    return memberships.map(m => m.service);
  }

  @Post(':id/services')
  @ApiOperation({ summary: 'Add service to group' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBody({ schema: { type: 'object', required: ['serviceId'], properties: { serviceId: { type: 'string', format: 'uuid' } } } })
  addService(@Param('id') groupId: string, @Body('serviceId') serviceId: string) {
    return this.membershipRepo.save(this.membershipRepo.create({ groupId, serviceId }));
  }

  @Delete(':id/services/:serviceId')
  @ApiOperation({ summary: 'Remove service from group' })
  removeService(@Param('id') groupId: string, @Param('serviceId') serviceId: string) {
    return this.membershipRepo.delete({ groupId, serviceId });
  }
}
