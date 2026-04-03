import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CancellationRule } from '../entity/cancellation-rule.entity';
import { RolesService } from './roles.service';

@Injectable()
export class CancellationRuleService {
  constructor(
    @InjectRepository(CancellationRule)
    private readonly ruleRepo: Repository<CancellationRule>,
    private readonly rolesService: RolesService,
  ) {}

  async getForUser(userId: number): Promise<CancellationRule[]> {
    return this.ruleRepo.find({
      where: { hostUserId: userId },
      order: { createdAt: 'DESC' },
    });
  }

  async getForHost(hostId: number): Promise<CancellationRule[]> {
    return this.ruleRepo.find({
      where: { hostUserId: hostId, isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async create(userId: number, data: Partial<CancellationRule>): Promise<CancellationRule> {
    await this.assertHostRole(userId);
    const rule = this.ruleRepo.create({ ...data, hostUserId: userId });
    return this.ruleRepo.save(rule);
  }

  async update(userId: number, ruleId: string, data: Partial<CancellationRule>): Promise<CancellationRule> {
    const rule = await this.ruleRepo.findOne({ where: { id: ruleId, hostUserId: userId } });
    if (!rule) throw new NotFoundException('Cancellation rule not found');
    Object.assign(rule, data);
    return this.ruleRepo.save(rule);
  }

  async remove(userId: number, ruleId: string): Promise<void> {
    const rule = await this.ruleRepo.findOne({ where: { id: ruleId, hostUserId: userId } });
    if (!rule) throw new NotFoundException('Cancellation rule not found');
    await this.ruleRepo.delete(ruleId);
  }

  /** Calculate refund for a cancellation */
  calculateRefund(
    rule: CancellationRule,
    totalPrice: number,
    hoursBeforeCheckin: number,
  ): { refundAmount: number; refundPercent: number; penaltyType: string } {
    if (hoursBeforeCheckin >= rule.fullRefundHours) {
      return { refundAmount: totalPrice, refundPercent: 100, penaltyType: 'none' };
    }
    if (hoursBeforeCheckin >= rule.partialRefundHours) {
      const pct = Number(rule.partialRefundPercent);
      return { refundAmount: totalPrice * pct / 100, refundPercent: pct, penaltyType: 'partial' };
    }
    const penalty = Number(rule.lateCancelPenalty);
    const refundPct = Math.max(0, 100 - penalty);
    return { refundAmount: totalPrice * refundPct / 100, refundPercent: refundPct, penaltyType: 'late' };
  }

  private async assertHostRole(userId: number) {
    const role = await this.rolesService.getUserRole(userId);
    const allowed = ['hyper_admin', 'hyper_manager', 'admin', 'manager'];
    if (!allowed.includes(role)) {
      throw new ForbiddenException('Only admin/manager can manage cancellation rules');
    }
  }
}
