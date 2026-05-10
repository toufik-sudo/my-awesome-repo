import { Controller, Get, Post, Put, Delete, Param, Body, Query, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { maybePaginate } from '../../common/pagination.util';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ServiceGroup } from '../entity/service-group.entity';
import { TourismService } from '../entity/tourism-service.entity';
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
    @InjectRepository(TourismService) private readonly serviceRepo: Repository<TourismService>,
    private readonly scopeFilter: ScopeFilterService,
  ) {}

  @Get()
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  async findAll(@Request() req: any, @Query('page') page?: string, @Query('limit') limit?: string) {
    const scopeCtx = extractScopeContext(req);
    const { userRole } = scopeCtx;
    let items: ServiceGroup[] = [];

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
        items = groupIds.size === 0
          ? []
          : await this.groupRepo.find({ where: { id: In(Array.from(groupIds)) }, order: { createdAt: 'DESC' } });
        return maybePaginate(items, page, limit);
      }
    }

    if (userRole === 'admin') {
      items = await this.groupRepo.find({ where: { adminId: req.user.id }, order: { createdAt: 'DESC' } });
      return maybePaginate(items, page, limit);
    }

    items = await this.groupRepo.find({ order: { createdAt: 'DESC' } });
    return maybePaginate(items, page, limit);
  }

  @Get(':id')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  findOne(@Param('id') id: string) {
    return this.groupRepo.findOne({ where: { id }, relations: ['services'] });
  }

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
  remove(@Param('id') id: string) {
    return this.groupRepo.delete(id);
  }

  @Get(':id/services')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  async getServices(@Param('id') groupId: string) {
    const group = await this.groupRepo.findOne({ where: { id: groupId }, relations: ['services'] });
    return group?.services || [];
  }

  @Post(':id/services')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  async addService(@Param('id') groupId: string, @Body('serviceId') serviceId: string) {
    const group = await this.groupRepo.findOne({ where: { id: groupId }, relations: ['services'] });
    if (!group) return;
    const service = await this.serviceRepo.findOne({ where: { id: serviceId } });
    if (!service) return;
    if (!group.services) group.services = [];
    if (!group.services.some(s => s.id === serviceId)) {
      group.services.push(service);
    }
    return this.groupRepo.save(group);
  }

  @Delete(':id/services/:serviceId')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  async removeService(@Param('id') groupId: string, @Param('serviceId') serviceId: string) {
    const group = await this.groupRepo.findOne({ where: { id: groupId }, relations: ['services'] });
    if (!group) return;
    group.services = (group.services || []).filter(s => s.id !== serviceId);
    return this.groupRepo.save(group);
  }
}
