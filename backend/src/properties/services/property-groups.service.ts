import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { PropertyGroup } from '../entity/property-group.entity';
import { Property } from '../entity/property.entity';
import { User } from '../../user/entity/user.entity';
import { ScopeFilterService } from '../../rbac/services/scope-filter.service';
import { ScopeContext, getScopedPerms } from '../../rbac/scope-context';

const PERM_KEY_FIND_ALL = 'backend.PropertyGroupsController.findAll.GET';

@Injectable()
export class PropertyGroupsService {
  constructor(
    @InjectRepository(PropertyGroup)
    private readonly groupRepo: Repository<PropertyGroup>,
    @InjectRepository(Property)
    private readonly propertyRepo: Repository<Property>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly scopeFilter: ScopeFilterService,
  ) {}

  private async getUserRole(userId: number): Promise<string> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    return user ? user.getRole() : 'user';
  }

  private async checkAdminAccess(userId: number): Promise<void> {
    const role = await this.getUserRole(userId);
    if (!['hyper_admin', 'hyper_manager', 'admin'].includes(role)) {
      throw new ForbiddenException('Admin access required');
    }
  }

  async findAll(userId: number, scopeCtx?: ScopeContext): Promise<PropertyGroup[]> {
    const role = scopeCtx?.userRole || await this.getUserRole(userId);

    // hyper_manager, manager, guest: use scoped perms
    if (scopeCtx && ['hyper_manager', 'manager', 'guest'].includes(role)) {
      const scopedPerms = getScopedPerms(scopeCtx);
      const relevant = scopedPerms.filter(p => p.backendPermissionKey === PERM_KEY_FIND_ALL && p.isGranted);

      if (relevant.length > 0 && !relevant.some(p => p.scope === 'all')) {
        const groupIds = new Set<string>();
        for (const perm of relevant) {
          if (perm.scope === 'property_groups' && perm.propertyGroups) {
            perm.propertyGroups.forEach(id => groupIds.add(id));
          }
        }
        if (groupIds.size === 0) return [];
        return this.groupRepo.find({ where: { id: In(Array.from(groupIds)) }, order: { name: 'ASC' } });
      }
    }

    // Only hyper_admin has unrestricted global access
    if (role === 'hyper_admin') {
      return this.groupRepo.find({ order: { name: 'ASC' } });
    }

    // Admin: filter by adminId (ownership)
    return this.groupRepo.find({
      where: { adminId: userId },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<PropertyGroup> {
    const group = await this.groupRepo.findOne({
      where: { id },
      relations: ['admin', 'properties'],
    });
    if (!group) throw new NotFoundException('Property group not found');
    return group;
  }

  async create(adminId: number, name: string, description?: string): Promise<PropertyGroup> {
    await this.checkAdminAccess(adminId);
    const group = this.groupRepo.create({ adminId, name, description });
    return this.groupRepo.save(group);
  }

  async update(
    userId: number,
    groupId: string,
    data: { name?: string; description?: string; isActive?: boolean },
  ): Promise<PropertyGroup> {
    const group = await this.findOne(groupId);
    const role = await this.getUserRole(userId);

    // Only hyper_admin has global access
    if (role !== 'hyper_admin' && group.adminId !== userId) {
      throw new ForbiddenException('Cannot update this group');
    }

    Object.assign(group, data);
    return this.groupRepo.save(group);
  }

  async remove(userId: number, groupId: string): Promise<void> {
    const group = await this.findOne(groupId);
    const role = await this.getUserRole(userId);

    if (role !== 'hyper_admin' && group.adminId !== userId) {
      throw new ForbiddenException('Cannot delete this group');
    }

    await this.groupRepo.remove(group);
  }

  async addPropertyToGroup(
    userId: number,
    groupId: string,
    propertyId: string,
  ): Promise<PropertyGroup> {
    const group = await this.findOne(groupId);
    const role = await this.getUserRole(userId);

    if (role !== 'hyper_admin' && group.adminId !== userId) {
      throw new ForbiddenException('Cannot modify this group');
    }

    const property = await this.propertyRepo.findOne({ where: { id: propertyId } });
    if (!property) throw new NotFoundException('Property not found');

    if (!group.properties) group.properties = [];
    if (!group.properties.some(p => p.id === propertyId)) {
      group.properties.push(property);
    }
    return this.groupRepo.save(group);
  }

  async removePropertyFromGroup(
    userId: number,
    groupId: string,
    propertyId: string,
  ): Promise<void> {
    const group = await this.findOne(groupId);
    const role = await this.getUserRole(userId);

    if (role !== 'hyper_admin' && group.adminId !== userId) {
      throw new ForbiddenException('Cannot modify this group');
    }

    if (group.properties) {
      group.properties = group.properties.filter(p => p.id !== propertyId);
      await this.groupRepo.save(group);
    }
  }

  async getGroupProperties(groupId: string): Promise<Property[]> {
    const group = await this.groupRepo.findOne({
      where: { id: groupId },
      relations: ['properties'],
    });
    return group?.properties || [];
  }
}
