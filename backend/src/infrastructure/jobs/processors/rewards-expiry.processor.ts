import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan } from 'typeorm';
import { Job } from 'bullmq';
import { PointsRule } from '../../../user/entity/points-rule.entity';
import { NotificationService } from '../../../notification/services/notification.service';

const QUEUE_REWARDS = 'rewards-expiry';

@Processor(QUEUE_REWARDS)
@Injectable()
export class RewardsExpiryProcessor extends WorkerHost {
  private readonly logger = new Logger(RewardsExpiryProcessor.name);

  constructor(
    @InjectRepository(PointsRule)
    private readonly pointsRuleRepo: Repository<PointsRule>,
    private readonly notificationService: NotificationService,
  ) {
    super();
  }

  async process(job: Job): Promise<void> {
    switch (job.name) {
      case 'check-reward-expiry':
        await this.checkRewardExpiry();
        break;
      case 'check-tier-unlock':
        await this.checkTierUnlocks(job.data);
        break;
      default:
        this.logger.warn(`Unknown job: ${job.name}`);
    }
  }

  /** Check for points rules expiring within 7 days and notify relevant users */
  private async checkRewardExpiry() {
    const now = new Date();
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(now.getDate() + 7);

    const expiringRules = await this.pointsRuleRepo.find({
      where: {
        isActive: true,
        validTo: LessThan(sevenDaysLater),
      },
    });

    const expiredRules = expiringRules.filter(r => r.validTo && new Date(r.validTo) <= now);
    const soonExpiring = expiringRules.filter(r => r.validTo && new Date(r.validTo) > now);

    // Deactivate expired rules
    for (const rule of expiredRules) {
      await this.pointsRuleRepo.update(rule.id, { isActive: false });
      this.logger.log(`Deactivated expired rule: ${rule.description} (expired ${rule.validTo})`);
    }

    // Notify about soon-expiring rules
    for (const rule of soonExpiring) {
      const daysLeft = Math.ceil((new Date(rule.validTo!).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      await this.notificationService.notifyHyperAdmins(
        'system',
        'Reward Rule Expiring Soon',
        `Rule "${rule.description}" expires in ${daysLeft} day(s) (${rule.validTo}).`,
        { ruleId: rule.id, daysLeft },
      );
    }

    this.logger.log(`Reward expiry check: ${expiredRules.length} expired, ${soonExpiring.length} expiring soon`);
  }

  /** Notify user when they unlock a new tier */
  private async checkTierUnlocks(data: { userId: number; totalPoints: number }) {
    const { userId, totalPoints } = data;

    const tiers = [
      { name: 'Bronze', threshold: 100 },
      { name: 'Silver', threshold: 500 },
      { name: 'Gold', threshold: 1500 },
      { name: 'Platinum', threshold: 5000 },
      { name: 'Diamond', threshold: 15000 },
    ];

    const unlockedTier = [...tiers].reverse().find(t => totalPoints >= t.threshold);
    if (!unlockedTier) return;

    await this.notificationService.create({
      userId,
      type: 'system',
      title: `🎉 Tier ${unlockedTier.name} débloqué !`,
      message: `Félicitations ! Vous avez atteint le tier ${unlockedTier.name} avec ${totalPoints} points.`,
      channel: 'both',
      actionUrl: '/points',
      metadata: { tier: unlockedTier.name, totalPoints },
    });

    this.logger.log(`User ${userId} unlocked tier ${unlockedTier.name} (${totalPoints} pts)`);
  }
}
