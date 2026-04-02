import { Injectable, ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual, In } from 'typeorm';
import * as crypto from 'crypto';
import { Reward, RewardRedemption } from '../entity/reward.entity';
import { RolesService } from './roles.service';

@Injectable()
export class RewardsService {
  constructor(
    @InjectRepository(Reward)
    private readonly rewardRepo: Repository<Reward>,
    @InjectRepository(RewardRedemption)
    private readonly redemptionRepo: Repository<RewardRedemption>,
    private readonly rolesService: RolesService,
  ) {}

  /** Get all active rewards for the shop */
  async getShopRewards(): Promise<Reward[]> {
    return this.rewardRepo.find({
      where: { status: 'active' },
      order: { sortOrder: 'ASC', pointsCost: 'ASC' },
    });
  }

  /** Get all rewards (admin view) */
  async getAll(): Promise<Reward[]> {
    return this.rewardRepo.find({ order: { category: 'ASC', sortOrder: 'ASC' } });
  }

  /** Get a single reward */
  async getById(id: string): Promise<Reward> {
    const reward = await this.rewardRepo.findOne({ where: { id } });
    if (!reward) throw new NotFoundException('Reward not found');
    return reward;
  }

  /** Create a reward (hyper only) */
  async create(userId: number, data: Partial<Reward>): Promise<Reward> {
    await this.assertHyperRole(userId);
    const reward = this.rewardRepo.create({ ...data, createdByUserId: userId });
    return this.rewardRepo.save(reward);
  }

  /** Update a reward (hyper only) */
  async update(userId: number, rewardId: string, data: Partial<Reward>): Promise<Reward> {
    await this.assertHyperRole(userId);
    const reward = await this.getById(rewardId);
    Object.assign(reward, data);
    return this.rewardRepo.save(reward);
  }

  /** Delete a reward (hyper only) */
  async remove(userId: number, rewardId: string): Promise<void> {
    await this.assertHyperRole(userId);
    await this.rewardRepo.delete(rewardId);
  }

  /** Redeem a reward (any user with enough points) */
  async redeem(userId: number, rewardId: string, pointsService: any): Promise<RewardRedemption> {
    const reward = await this.getById(rewardId);

    // Check status
    if (reward.status !== 'active') {
      throw new BadRequestException('This reward is not currently available');
    }

    // Check date validity
    const now = new Date();
    if (reward.validFrom && new Date(reward.validFrom) > now) {
      throw new BadRequestException('This reward is not yet available');
    }
    if (reward.validTo && new Date(reward.validTo) < now) {
      throw new BadRequestException('This reward has expired');
    }

    // Check max redemptions
    if (reward.maxRedemptions && reward.currentRedemptions >= reward.maxRedemptions) {
      throw new BadRequestException('This reward is sold out');
    }

    // Check per-user limit
    if (reward.maxPerUser) {
      const userCount = await this.redemptionRepo.count({
        where: { userId, rewardId, status: In(['pending', 'confirmed', 'used']) },
      });
      if (userCount >= reward.maxPerUser) {
        throw new BadRequestException('You have reached the maximum redemptions for this reward');
      }
    }

    // Check tier requirement
    if (reward.requiredTier) {
      const summary = await pointsService.getUserSummary(userId);
      const tierOrder = ['bronze', 'silver', 'gold', 'platinum', 'diamond'];
      const userTierIdx = tierOrder.indexOf(summary.tier);
      const requiredTierIdx = tierOrder.indexOf(reward.requiredTier);
      if (userTierIdx < requiredTierIdx) {
        throw new BadRequestException(`Requires ${reward.requiredTier} tier or above`);
      }
    }

    // Spend points
    const spent = await pointsService.spendPoints(
      userId,
      reward.pointsCost,
      `Redeemed: ${reward.name}`,
      rewardId,
      'reward',
    );
    if (!spent) {
      throw new BadRequestException('Insufficient points');
    }

    // Create redemption
    const code = `RWD-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 90); // 90-day expiry

    const redemption = this.redemptionRepo.create({
      userId,
      rewardId,
      pointsSpent: reward.pointsCost,
      code,
      status: 'confirmed',
      expiresAt,
    });

    // Increment counter
    reward.currentRedemptions += 1;
    if (reward.maxRedemptions && reward.currentRedemptions >= reward.maxRedemptions) {
      reward.status = 'sold_out';
    }
    await this.rewardRepo.save(reward);

    return this.redemptionRepo.save(redemption);
  }

  /** Get user's redemptions */
  async getUserRedemptions(userId: number): Promise<RewardRedemption[]> {
    return this.redemptionRepo.find({
      where: { userId },
      relations: ['reward'],
      order: { createdAt: 'DESC' },
    });
  }

  /** Use a redemption code */
  async useRedemption(userId: number, code: string, referenceId?: string, referenceType?: string): Promise<RewardRedemption> {
    const redemption = await this.redemptionRepo.findOne({
      where: { code, userId },
      relations: ['reward'],
    });
    if (!redemption) throw new NotFoundException('Redemption not found');
    if (redemption.status === 'used') throw new BadRequestException('Already used');
    if (redemption.status === 'cancelled') throw new BadRequestException('Cancelled');
    if (redemption.expiresAt && new Date(redemption.expiresAt) < new Date()) {
      redemption.status = 'expired';
      await this.redemptionRepo.save(redemption);
      throw new BadRequestException('Redemption code has expired');
    }

    redemption.status = 'used';
    redemption.usedAt = new Date();
    redemption.usedOnReferenceId = referenceId || null;
    redemption.usedOnReferenceType = referenceType || null;
    return this.redemptionRepo.save(redemption);
  }

  /** Cancel a redemption and refund points */
  async cancelRedemption(userId: number, redemptionId: string, pointsService: any): Promise<void> {
    const redemption = await this.redemptionRepo.findOne({ where: { id: redemptionId, userId } });
    if (!redemption) throw new NotFoundException('Redemption not found');
    if (redemption.status === 'used') throw new BadRequestException('Cannot cancel a used redemption');

    redemption.status = 'cancelled';
    await this.redemptionRepo.save(redemption);

    // Refund points
    await pointsService.awardPoints(userId, 'admin_bonus', {
      customPoints: redemption.pointsSpent,
      description: `Refund: cancelled reward redemption`,
      referenceId: redemptionId,
      referenceType: 'reward_refund',
    });

    // Decrement counter
    await this.rewardRepo.decrement({ id: redemption.rewardId }, 'currentRedemptions', 1);
  }

  /** Get all redemptions (admin) */
  async getAllRedemptions(): Promise<RewardRedemption[]> {
    return this.redemptionRepo.find({
      relations: ['user', 'reward'],
      order: { createdAt: 'DESC' },
      take: 100,
    });
  }

  private async assertHyperRole(userId: number) {
    const roles = await this.rolesService.getUserRoles(userId);
    if (!roles.includes('hyper_admin') && !roles.includes('hyper_manager')) {
      throw new ForbiddenException('Only hyper_admin or hyper_manager can manage rewards');
    }
  }
}
