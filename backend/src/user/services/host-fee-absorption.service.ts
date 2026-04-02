import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual, IsNull, In } from 'typeorm';
import { HostFeeAbsorption, AbsorptionScope } from '../entity/host-fee-absorption.entity';

@Injectable()
export class HostFeeAbsorptionService {
  constructor(
    @InjectRepository(HostFeeAbsorption)
    private readonly repo: Repository<HostFeeAbsorption>,
  ) {}

  async getForHost(hostUserId: number): Promise<HostFeeAbsorption[]> {
    return this.repo.find({ where: { hostUserId }, order: { createdAt: 'DESC' } });
  }

  async create(hostUserId: number, data: Partial<HostFeeAbsorption>): Promise<HostFeeAbsorption> {
    const entity = this.repo.create({ ...data, hostUserId });
    return this.repo.save(entity);
  }

  async update(hostUserId: number, id: string, data: Partial<HostFeeAbsorption>): Promise<HostFeeAbsorption> {
    const entity = await this.repo.findOne({ where: { id, hostUserId } });
    if (!entity) throw new NotFoundException('Fee absorption rule not found');
    Object.assign(entity, data);
    return this.repo.save(entity);
  }

  async remove(hostUserId: number, id: string): Promise<void> {
    const entity = await this.repo.findOne({ where: { id, hostUserId } });
    if (!entity) throw new NotFoundException('Fee absorption rule not found');
    await this.repo.delete(id);
  }

  /**
   * Find the best matching absorption for a given booking context.
   * Returns the absorption percentage (0-100) that the host covers.
   */
  async getAbsorptionForBooking(
    hostUserId: number,
    propertyId?: string,
    serviceId?: string,
    propertyGroupId?: string,
    serviceGroupId?: string,
    bookingDate?: Date,
  ): Promise<{ absorptionPercent: number; absorption: HostFeeAbsorption | null }> {
    const now = bookingDate || new Date();

    const absorptions = await this.repo.find({
      where: { hostUserId, isActive: true },
      order: { createdAt: 'DESC' },
    });

    // Filter by date validity
    const valid = absorptions.filter(a => {
      if (a.validFrom && new Date(a.validFrom) > now) return false;
      if (a.validTo && new Date(a.validTo) < now) return false;
      return true;
    });

    // Priority: specific > group > all
    const specific = valid.find(a =>
      (a.scope === 'property' && a.targetPropertyId === propertyId) ||
      (a.scope === 'service' && a.targetServiceId === serviceId)
    );
    if (specific) return { absorptionPercent: Number(specific.absorptionPercent), absorption: specific };

    const group = valid.find(a =>
      (a.scope === 'property_group' && a.targetPropertyGroupId === propertyGroupId) ||
      (a.scope === 'service_group' && a.targetServiceGroupId === serviceGroupId)
    );
    if (group) return { absorptionPercent: Number(group.absorptionPercent), absorption: group };

    const all = valid.find(a => a.scope === 'all');
    if (all) return { absorptionPercent: Number(all.absorptionPercent), absorption: all };

    return { absorptionPercent: 0, absorption: null };
  }
}
