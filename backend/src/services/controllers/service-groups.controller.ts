import { Controller, Get, Post, Put, Delete, Param, Body, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ServiceGroup } from '../entity/service-group.entity';
import { ServiceGroupMembership } from '../entity/service-group-membership.entity';
import { PermissionGuard } from '../../auth/guards/permission.guard';
import { JwtAuthGuard } from '../../auth/jwtAuth.guard';
import { CustomCsrfInterceptor } from '../../services/interceptors/custom.csrf.interceptor';
import { CsrfGenAuth, CsrfCheck } from '@tekuconcept/nestjs-csrf';
import { extractScopeContext, getScopedPerms } from '../../rbac/scope-context';
import { ScopeFilterService } from '../../rbac/services/scope-filter.service';

const PERM_KEY_FIND_ALL = 'backend.ServiceGroupsController.findAll.GET';

@Controller('service-groups')
@UseGuards(JwtAuthGuard)
@UseInterceptors(CustomCsrfInterceptor)
export class ServiceGroupsController {
  constructor(
    @InjectRepository(ServiceGroup) private readonly groupRepo: Repository<ServiceGroup>,
    @InjectRepository(ServiceGroupMembership) private readonly membershipRepo: Repository<ServiceGroupMembership>,
    private readonly scopeFilter: ScopeFilterService,
  ) {}

  @Get()
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  async findAll(@Request() req: any) {
    const scopeCtx = extractScopeContext(req);
    const { userRole } = scopeCtx;

    // For scoped roles, filter by allowed service groups
    if (['manager', 'hyper_manager', 'guest'].includes(userRole)) {
      const scopedPerms = getScopedPerms(scopeCtx);
      const relevant = scopedPerms.filter(p => p.backendPermissionKey === PERM_KEY_FIND_ALL && p.isGranted);

      if (relevant.length > 0 && !relevant.some(p => p.scope === 'all')) {
        const groupIds = new Set<string>();
        for (const perm of relevant) {
          if (perm.scope === 'service_groups' && perm.serviceGroups) {
            perm.serviceGroups.forEach(id => groupIds.add(id));
          }
        }
        if (groupIds.size === 0) return [];
        return this.groupRepo.find({ where: { id: In(Array.from(groupIds)) }, order: { createdAt: 'DESC' } });
      }
    }

    return this.groupRepo.find({ order: { createdAt: 'DESC' } });
  }

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
    const scopeCtx = extractScopeContext(req);
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
