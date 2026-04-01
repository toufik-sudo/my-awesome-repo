import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPoints, PointTransaction, PointAction, PointTier } from '../entity/user-points.entity';

/** Point values per action */
const POINT_VALUES: Record<PointAction, number> = {
  booking_completed: 50,
  review_submitted: 20,
  referral_signup: 100,
  first_booking: 75,
  profile_completed: 30,
  property_verified: 40,
  service_created: 35,
  five_star_review: 30,
  monthly_bonus: 25,
  event_participation: 15,
  photo_upload: 10,
  social_share: 5,
  property_shared: 5,
  loyalty_milestone: 200,
  admin_bonus: 0, // variable
  penalty: 0,     // variable
};

/** Tier thresholds */
const TIER_THRESHOLDS: { tier: PointTier; min: number }[] = [
  { tier: 'diamond', min: 5000 },
  { tier: 'platinum', min: 2000 },
  { tier: 'gold', min: 1000 },
  { tier: 'silver', min: 500 },
  { tier: 'bronze', min: 0 },
];

@Injectable()
export class PointsService {
  private readonly logger = new Logger(PointsService.name);

  constructor(
    @InjectRepository(UserPoints)
    private readonly pointsRepo: Repository<UserPoints>,
    @InjectRepository(PointTransaction)
    private readonly transRepo: Repository<PointTransaction>,
  ) {}

  /** Get or create user points record */
  async getOrCreate(userId: number): Promise<UserPoints> {
    let record = await this.pointsRepo.findOne({ where: { userId } });
    if (!record) {
      record = this.pointsRepo.create({ userId, user: { id: userId } as any });
      record = await this.pointsRepo.save(record);
    }
    return record;
  }

  /** Award points for an action */
  async awardPoints(
    userId: number,
    action: PointAction,
    opts?: { customPoints?: number; description?: string; referenceId?: string; referenceType?: string },
  ): Promise<PointTransaction> {
    const points = opts?.customPoints ?? POINT_VALUES[action];
    if (points <= 0 && action !== 'admin_bonus') return null as any;

    const userPoints = await this.getOrCreate(userId);
    userPoints.totalPoints += points;
    userPoints.availablePoints += points;
    userPoints.lifetimePoints += points;
    userPoints.tier = this.calculateTier(userPoints.lifetimePoints);
    await this.pointsRepo.save(userPoints);

    const transaction = this.transRepo.create({
      userId,
      user: { id: userId } as any,
      action,
      points,
      type: action === 'penalty' ? 'penalty' : action === 'admin_bonus' ? 'bonus' : 'earn',
      description: opts?.description || `Points earned: ${action.replace(/_/g, ' ')}`,
      referenceId: opts?.referenceId,
      referenceType: opts?.referenceType,
    });

    return this.transRepo.save(transaction);
  }

  /** Spend points */
  async spendPoints(
    userId: number,
    points: number,
    description: string,
    referenceId?: string,
    referenceType?: string,
  ): Promise<PointTransaction | null> {
    const userPoints = await this.getOrCreate(userId);
    if (userPoints.availablePoints < points) return null;

    userPoints.availablePoints -= points;
    userPoints.spentPoints += points;
    await this.pointsRepo.save(userPoints);

    const transaction = this.transRepo.create({
      userId,
      user: { id: userId } as any,
      action: 'booking_completed',
      points: -points,
      type: 'spend',
      description,
      referenceId,
      referenceType,
    });

    return this.transRepo.save(transaction);
  }

  /** Apply penalty */
  async deductPoints(userId: number, points: number, reason: string): Promise<PointTransaction> {
    const userPoints = await this.getOrCreate(userId);
    userPoints.totalPoints = Math.max(0, userPoints.totalPoints - points);
    userPoints.availablePoints = Math.max(0, userPoints.availablePoints - points);
    userPoints.tier = this.calculateTier(userPoints.lifetimePoints);
    await this.pointsRepo.save(userPoints);

    const transaction = this.transRepo.create({
      userId,
      user: { id: userId } as any,
      action: 'penalty',
      points: -points,
      type: 'penalty',
      description: reason,
    });

    return this.transRepo.save(transaction);
  }

  /** Get user summary */
  async getUserSummary(userId: number) {
    const userPoints = await this.getOrCreate(userId);
    const recentTransactions = await this.transRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 20,
    });

    const nextTier = TIER_THRESHOLDS.find(t => t.min > userPoints.lifetimePoints);

    return {
      ...userPoints,
      recentTransactions,
      nextTier: nextTier ? { tier: nextTier.tier, pointsNeeded: nextTier.min - userPoints.lifetimePoints } : null,
      tierProgress: this.getTierProgress(userPoints.lifetimePoints),
    };
  }

  /** Get leaderboard */
  async getLeaderboard(limit = 20) {
    return this.pointsRepo.find({
      relations: ['user'],
      order: { lifetimePoints: 'DESC' },
      take: limit,
    });
  }

  /** Get transactions history */
  async getTransactions(userId: number, page = 1, limit = 20) {
    const [data, total] = await this.transRepo.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  private calculateTier(lifetimePoints: number): PointTier {
    for (const { tier, min } of TIER_THRESHOLDS) {
      if (lifetimePoints >= min) return tier;
    }
    return 'bronze';
  }

  private getTierProgress(lifetimePoints: number): number {
    const currentTierIdx = TIER_THRESHOLDS.findIndex(t => lifetimePoints >= t.min);
    if (currentTierIdx <= 0) return 100;
    const current = TIER_THRESHOLDS[currentTierIdx];
    const next = TIER_THRESHOLDS[currentTierIdx - 1];
    return Math.round(((lifetimePoints - current.min) / (next.min - current.min)) * 100);
  }
}
