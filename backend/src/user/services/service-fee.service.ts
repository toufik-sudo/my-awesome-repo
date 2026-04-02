import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceFeeRule, FeeScope, FeeCalculation } from '../entity/service-fee-rule.entity';
import { RolesService } from './roles.service';

@Injectable()
export class ServiceFeeService {
  constructor(
    @InjectRepository(ServiceFeeRule)
    private readonly feeRuleRepo: Repository<ServiceFeeRule>,
    private readonly rolesService: RolesService,
  ) {}

  async getAll(): Promise<ServiceFeeRule[]> {
    return this.feeRuleRepo.find({ order: { priority: 'ASC', createdAt: 'DESC' } });
  }

  async getDefault(): Promise<ServiceFeeRule | null> {
    return this.feeRuleRepo.findOne({ where: { isDefault: true, isActive: true } });
  }

  async getForHost(hostId: number): Promise<ServiceFeeRule[]> {
    return this.feeRuleRepo.find({
      where: [
        { targetHostId: hostId, isActive: true },
        { scope: 'global' as FeeScope, isActive: true },
      ],
      order: { priority: 'ASC' },
    });
  }

  async create(userId: number, data: Partial<ServiceFeeRule>): Promise<ServiceFeeRule> {
    await this.assertHyperRole(userId);

    // If setting as default, unset previous default
    if (data.isDefault) {
      await this.feeRuleRepo.update({ isDefault: true }, { isDefault: false });
    }

    const rule = this.feeRuleRepo.create({ ...data, createdByUserId: userId });
    return this.feeRuleRepo.save(rule);
  }

  async update(userId: number, ruleId: string, data: Partial<ServiceFeeRule>): Promise<ServiceFeeRule> {
    await this.assertHyperRole(userId);
    const rule = await this.feeRuleRepo.findOne({ where: { id: ruleId } });
    if (!rule) throw new NotFoundException('Fee rule not found');

    if (data.isDefault) {
      await this.feeRuleRepo.update({ isDefault: true }, { isDefault: false });
    }

    Object.assign(rule, data);
    return this.feeRuleRepo.save(rule);
  }

  async remove(userId: number, ruleId: string): Promise<void> {
    await this.assertHyperRole(userId);
    await this.feeRuleRepo.delete(ruleId);
  }

  /** Calculate fee for a given booking amount using the best matching rule */
  async calculateFee(
    hostId: number,
    propertyId: string,
    propertyGroupId: string | null,
    amount: number,
    serviceId?: string,
    serviceGroupId?: string,
  ): Promise<{ fee: number; rule: ServiceFeeRule }> {
    const rules = await this.feeRuleRepo.find({
      where: { isActive: true },
      order: { priority: 'ASC' },
    });

    const rule = rules.find(r =>
      (r.scope === 'property' && r.targetPropertyId === propertyId) ||
      (r.scope === 'service' && serviceId && r.targetServiceId === serviceId) ||
      (r.scope === 'property_group' && r.targetPropertyGroupId === propertyGroupId) ||
      (r.scope === 'service_group' && serviceGroupId && r.targetServiceGroupId === serviceGroupId) ||
      (r.scope === 'host' && r.targetHostId === hostId) ||
      (r.scope === 'global')
    ) || await this.getDefault();

    if (!rule) return { fee: 0, rule: null };

    let fee = 0;
    if (rule.calculationType === 'percentage') {
      fee = amount * (Number(rule.percentageRate) / 100);
    } else if (rule.calculationType === 'fixed') {
      fee = Number(rule.fixedAmount);
    } else if (rule.calculationType === 'fixed_then_percentage') {
      // Fixed fee up to threshold, then percentage on the remainder
      const threshold = Number(rule.fixedThreshold) || 0;
      if (amount <= threshold) {
        fee = Number(rule.fixedAmount);
      } else {
        fee = Number(rule.fixedAmount) + (amount - threshold) * (Number(rule.percentageRate) / 100);
      }
    } else {
      // percentage_plus_fixed
      fee = amount * (Number(rule.percentageRate) / 100) + Number(rule.fixedAmount);
    }

    if (rule.minFee && fee < Number(rule.minFee)) fee = Number(rule.minFee);
    if (rule.maxFee && fee > Number(rule.maxFee)) fee = Number(rule.maxFee);

    return { fee: Math.round(fee * 100) / 100, rule };
  }

  private async assertHyperRole(userId: number) {
    const roles = await this.rolesService.getUserRoles(userId);
    if (!roles.includes('hyper_admin') && !roles.includes('hyper_manager')) {
      throw new ForbiddenException('Only hyper_admin or hyper_manager can manage fee rules');
    }
  }
}
