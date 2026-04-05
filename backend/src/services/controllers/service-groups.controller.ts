import { Controller, Get, Post, Put, Delete, Param, Body, Request, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceGroup } from '../entity/service-group.entity';
import { ServiceGroupMembership } from '../entity/service-group-membership.entity';
import { PermissionGuard } from '../../auth/guards/permission.guard';
import { RequireRole } from '../../auth/decorators';

@Controller('service-groups')
@UseGuards(PermissionGuard)
export class ServiceGroupsController {
  constructor(
    @InjectRepository(ServiceGroup)
    private readonly groupRepo: Repository<ServiceGroup>,
    @InjectRepository(ServiceGroupMembership)
    private readonly membershipRepo: Repository<ServiceGroupMembership>,
  ) {}

  @Get()
  @RequireRole('hyper_admin', 'hyper_manager', 'admin')
  findAll() {
    return this.groupRepo.find({ order: { createdAt: 'DESC' } });
  }

  @Get(':id')
  @RequireRole('hyper_admin', 'hyper_manager', 'admin')
  findOne(@Param('id') id: string) {
    return this.groupRepo.findOne({ where: { id } });
  }

  // [BE-07] Only admin can create service groups — hyper_admin removed
  @Post()
  @RequireRole('admin')
  create(@Request() req: any, @Body() data: { name: string; description?: string }) {
    return this.groupRepo.save(this.groupRepo.create({
      ...data,
      adminId: req.user.id,
    }));
  }

  @Put(':id')
  @RequireRole('admin')
  update(@Param('id') id: string, @Body() data: { name?: string; description?: string; isActive?: boolean }) {
    return this.groupRepo.update(id, data);
  }

  @Delete(':id')
  @RequireRole('hyper_admin', 'hyper_manager', 'admin')
  remove(@Param('id') id: string) {
    return this.groupRepo.delete(id);
  }

  @Get(':id/services')
  @RequireRole('hyper_admin', 'hyper_manager', 'admin')
  async getServices(@Param('id') groupId: string) {
    const memberships = await this.membershipRepo.find({
      where: { groupId },
      relations: ['service'],
    });
    return memberships.map(m => m.service);
  }

  @Post(':id/services')
  @RequireRole('admin')
  addService(@Param('id') groupId: string, @Body('serviceId') serviceId: string) {
    return this.membershipRepo.save(this.membershipRepo.create({ groupId, serviceId }));
  }

  @Delete(':id/services/:serviceId')
  @RequireRole('hyper_admin', 'hyper_manager', 'admin')
  removeService(@Param('id') groupId: string, @Param('serviceId') serviceId: string) {
    return this.membershipRepo.delete({ groupId, serviceId });
  }
}
