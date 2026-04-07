import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { PropertyGroup } from '../entity/property-group.entity';
import { PropertyGroupMembership } from '../entity/property-group-membership.entity';
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
    @InjectRepository(PropertyGroupMembership)
    private readonly membershipRepo: Repository<PropertyGroupMembership>,
    @InjectRepository(Property)
    private readonly propertyRepo: Repository<Property>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly scopeFilter: ScopeFilterService,
  ) {}

  private async getUserRoles(userId: number): Promise<string[]> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    return user ? user.getRoles() : [];
  }

  private async checkAdminAccess(userId: number): Promise<void> {
    const roles = await this.getUserRoles(userId);
    const hasAccess = roles.some(r =>
      r === 'hyper_admin' || r === 'hyper_manager' || r === 'admin'
    );
    if (!hasAccess) {
      throw new ForbiddenException('Admin access required');
    }
  }

  async findAll(userId: number, scopeCtx?: ScopeContext): Promise<PropertyGroup[]> {
    const roles = await this.getUserRoles(userId);
    const isHyper = roles.includes('hyper_admin') || roles.includes('hyper_manager');

    // Apply scope filtering for manager/hyper_manager/guest
    if (scopeCtx && ['manager', 'hyper_manager', 'guest'].includes(scopeCtx.userRole)) {
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

    if (isHyper) {
      return this.groupRepo.find({ order: { name: 'ASC' } });
    }

    return this.groupRepo.find({
      where: { adminId: userId },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<PropertyGroup> {
    const group = await this.groupRepo.findOne({
      where: { id },
      relations: ['admin'],
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

    const roles = await this.getUserRoles(userId);
    const isHyper = roles.includes('hyper_admin') || roles.includes('hyper_manager');

    if (!isHyper && group.adminId !== userId) {
      throw new ForbiddenException('Cannot update this group');
    }

    Object.assign(group, data);
    return this.groupRepo.save(group);
  }

  async remove(userId: number, groupId: string): Promise<void> {
    const group = await this.findOne(groupId);

    const roles = await this.getUserRoles(userId);
    const isHyper = roles.includes('hyper_admin') || roles.includes('hyper_manager');

    if (!isHyper && group.adminId !== userId) {
      throw new ForbiddenException('Cannot delete this group');
    }

    await this.groupRepo.remove(group);
  }

  async addPropertyToGroup(
    userId: number,
    groupId: string,
    propertyId: string,
  ): Promise<PropertyGroupMembership> {
    const group = await this.findOne(groupId);

    const roles = await this.getUserRoles(userId);
    const isHyper = roles.includes('hyper_admin') || roles.includes('hyper_manager');

    if (!isHyper && group.adminId !== userId) {
      throw new ForbiddenException('Cannot modify this group');
    }

    const property = await this.propertyRepo.findOne({ where: { id: propertyId } });
    if (!property) throw new NotFoundException('Property not found');

    const existing = await this.membershipRepo.findOne({
      where: { propertyId, groupId },
    });
    if (existing) return existing;

    const membership = this.membershipRepo.create({ propertyId, groupId });
    return this.membershipRepo.save(membership);
  }

  async removePropertyFromGroup(
    userId: number,
    groupId: string,
    propertyId: string,
  ): Promise<void> {
    const group = await this.findOne(groupId);

    const roles = await this.getUserRoles(userId);
    const isHyper = roles.includes('hyper_admin') || roles.includes('hyper_manager');

    if (!isHyper && group.adminId !== userId) {
      throw new ForbiddenException('Cannot modify this group');
    }

    await this.membershipRepo.delete({ propertyId, groupId });
  }

  async getGroupProperties(groupId: string): Promise<Property[]> {
    const memberships = await this.membershipRepo.find({
      where: { groupId },
      relations: ['property'],
    });
    return memberships.map(m => m.property);
  }
}
