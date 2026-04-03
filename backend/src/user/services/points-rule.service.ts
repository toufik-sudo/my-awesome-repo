import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PointsRule, PointsRuleType, PointsTargetRole } from '../entity/points-rule.entity';
import { RolesService } from './roles.service';

@Injectable()
export class PointsRuleService {
  constructor(
    @InjectRepository(PointsRule)
    private readonly pointsRuleRepo: Repository<PointsRule>,
    private readonly rolesService: RolesService,
  ) {}

  async getAll(): Promise<PointsRule[]> {
    return this.pointsRuleRepo.find({ order: { ruleType: 'ASC', action: 'ASC' } });
  }

  async getDefaults(): Promise<PointsRule[]> {
    return this.pointsRuleRepo.find({ where: { isDefault: true, isActive: true } });
  }

  async getByRole(targetRole: PointsTargetRole): Promise<PointsRule[]> {
    return this.pointsRuleRepo.find({ where: { targetRole, isActive: true } });
  }

  async getEarningRules(): Promise<PointsRule[]> {
    return this.pointsRuleRepo.find({ where: { ruleType: 'earning' as PointsRuleType, isActive: true } });
  }

  async getConversionRules(): Promise<PointsRule[]> {
    return this.pointsRuleRepo.find({ where: { ruleType: 'conversion' as PointsRuleType, isActive: true } });
  }

  async create(userId: number, data: Partial<PointsRule>): Promise<PointsRule> {
    await this.assertHyperRole(userId);

    if (data.isDefault) {
      // Unset previous default for same type+role+action
      await this.pointsRuleRepo.update(
        { ruleType: data.ruleType, targetRole: data.targetRole, action: data.action, isDefault: true },
        { isDefault: false },
      );
    }

    const rule = this.pointsRuleRepo.create({ ...data, createdByUserId: userId });
    return this.pointsRuleRepo.save(rule);
  }

  async update(userId: number, ruleId: string, data: Partial<PointsRule>): Promise<PointsRule> {
    await this.assertHyperRole(userId);
    const rule = await this.pointsRuleRepo.findOne({ where: { id: ruleId } });
    if (!rule) throw new NotFoundException('Points rule not found');

    if (data.isDefault) {
      await this.pointsRuleRepo.update(
        { ruleType: rule.ruleType, targetRole: rule.targetRole, action: rule.action, isDefault: true },
        { isDefault: false },
      );
    }

    Object.assign(rule, data);
    return this.pointsRuleRepo.save(rule);
  }

  async remove(userId: number, ruleId: string): Promise<void> {
    await this.assertHyperRole(userId);
    await this.pointsRuleRepo.delete(ruleId);
  }

  /** Get the effective points for an action based on rules */
  async getPointsForAction(action: string, targetRole: PointsTargetRole): Promise<number> {
    const rule = await this.pointsRuleRepo.findOne({
      where: { action, targetRole, ruleType: 'earning' as PointsRuleType, isActive: true },
      order: { isDefault: 'DESC' },
    });
    if (!rule) return 0;
    return Math.round(rule.pointsAmount * Number(rule.multiplier));
  }

  /** Get conversion rate for a role */
  async getConversionRate(targetRole: PointsTargetRole): Promise<{ rate: number; currency: string; minPoints: number } | null> {
    const rule = await this.pointsRuleRepo.findOne({
      where: { targetRole, ruleType: 'conversion' as PointsRuleType, isActive: true },
      order: { isDefault: 'DESC' },
    });
    if (!rule) return null;
    return {
      rate: Number(rule.conversionRate),
      currency: rule.currency,
      minPoints: rule.minPointsForConversion || 0,
    };
  }

  private async assertHyperRole(userId: number) {
    const role = await this.rolesService.getUserRole(userId);
    if (role !== 'hyper_admin' && role !== 'hyper_manager') {
      throw new ForbiddenException('Only hyper_admin or hyper_manager can manage points rules');
    }
  }
}
