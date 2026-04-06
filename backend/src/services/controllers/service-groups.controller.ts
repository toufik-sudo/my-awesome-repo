import { Controller, Get, Post, Put, Delete, Param, Body, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceGroup } from '../entity/service-group.entity';
import { ServiceGroupMembership } from '../entity/service-group-membership.entity';
import { PermissionGuard } from '../../auth/guards/permission.guard';
import { JwtAuthGuard } from '../../auth/jwtAuth.guard';
import { CustomCsrfInterceptor } from '../../services/interceptors/custom.csrf.interceptor';
import { CsrfGenAuth, CsrfCheck } from '@tekuconcept/nestjs-csrf';

@Controller('service-groups')
@UseGuards(JwtAuthGuard)
@UseInterceptors(CustomCsrfInterceptor)
export class ServiceGroupsController {
  constructor(
    @InjectRepository(ServiceGroup) private readonly groupRepo: Repository<ServiceGroup>,
    @InjectRepository(ServiceGroupMembership) private readonly membershipRepo: Repository<ServiceGroupMembership>,
  ) {}

  @Get()
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  findAll() { return this.groupRepo.find({ order: { createdAt: 'DESC' } }); }

  @Get(':id')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  findOne(@Param('id') id: string) { return this.groupRepo.findOne({ where: { id } }); }

  @Post()
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  create(@Request() req: any, @Body() data: { name: string; description?: string }) {
    return this.groupRepo.save(this.groupRepo.create({ ...data, adminId: req.user.id }));
  }

  @Put(':id')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  update(@Param('id') id: string, @Body() data: { name?: string; description?: string; isActive?: boolean }) {
    return this.groupRepo.update(id, data);
  }

  @Delete(':id')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  remove(@Param('id') id: string) { return this.groupRepo.delete(id); }

  @Get(':id/services')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  async getServices(@Param('id') groupId: string) {
    const memberships = await this.membershipRepo.find({ where: { groupId }, relations: ['service'] });
    return memberships.map(m => m.service);
  }

  @Post(':id/services')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  addService(@Param('id') groupId: string, @Body('serviceId') serviceId: string) {
    return this.membershipRepo.save(this.membershipRepo.create({ groupId, serviceId }));
  }

  @Delete(':id/services/:serviceId')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  removeService(@Param('id') groupId: string, @Param('serviceId') serviceId: string) {
    return this.membershipRepo.delete({ groupId, serviceId });
  }
}
