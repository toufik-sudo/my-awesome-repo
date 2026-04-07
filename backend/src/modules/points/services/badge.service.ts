import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ScopeContext } from '../../../rbac/scope-context';
import { Repository } from 'typeorm';
import { Badge, UserBadge } from '../entity/badge.entity';
import { UserPoints, PointTransaction } from '../entity/user-points.entity';

/** Default badges seeded on first run */
const DEFAULT_BADGES: Partial<Badge>[] = [
  { code: 'first_booking', name: { fr: 'Première réservation', en: 'First Booking', ar: 'أول حجز' }, description: { fr: 'Complétez votre première réservation', en: 'Complete your first booking', ar: 'أكمل حجزك الأول' }, icon: '🎯', category: 'booking', actionRequired: 'booking_completed', actionCountRequired: 1, bonusPoints: 50, sortOrder: 1 },
  { code: 'explorer_5', name: { fr: 'Explorateur', en: 'Explorer', ar: 'مستكشف' }, description: { fr: '5 réservations complétées', en: '5 bookings completed', ar: '5 حجوزات مكتملة' }, icon: '🧭', category: 'booking', actionRequired: 'booking_completed', actionCountRequired: 5, bonusPoints: 100, sortOrder: 2 },
  { code: 'traveler_20', name: { fr: 'Grand voyageur', en: 'Seasoned Traveler', ar: 'مسافر محنك' }, description: { fr: '20 réservations complétées', en: '20 bookings completed', ar: '20 حجز مكتمل' }, icon: '✈️', category: 'booking', actionRequired: 'booking_completed', actionCountRequired: 20, bonusPoints: 300, sortOrder: 3 },
  { code: 'reviewer', name: { fr: 'Critique', en: 'Reviewer', ar: 'مراجع' }, description: { fr: 'Soumettez votre premier avis', en: 'Submit your first review', ar: 'قدم أول تقييم لك' }, icon: '📝', category: 'review', actionRequired: 'review_submitted', actionCountRequired: 1, bonusPoints: 30, sortOrder: 4 },
  { code: 'top_reviewer', name: { fr: 'Critique expert', en: 'Top Reviewer', ar: 'مراجع متميز' }, description: { fr: '10 avis soumis', en: '10 reviews submitted', ar: '10 تقييمات' }, icon: '⭐', category: 'review', actionRequired: 'review_submitted', actionCountRequired: 10, bonusPoints: 150, sortOrder: 5 },
  { code: 'ambassador', name: { fr: 'Ambassadeur', en: 'Ambassador', ar: 'سفير' }, description: { fr: '5 parrainages réussis', en: '5 successful referrals', ar: '5 إحالات ناجحة' }, icon: '🤝', category: 'social', actionRequired: 'referral_signup', actionCountRequired: 5, bonusPoints: 200, sortOrder: 6 },
  { code: 'silver_tier', name: { fr: 'Membre Silver', en: 'Silver Member', ar: 'عضو فضي' }, description: { fr: 'Atteindre 500 points', en: 'Reach 500 points', ar: 'الوصول إلى 500 نقطة' }, icon: '🥈', category: 'loyalty', pointsThreshold: 500, bonusPoints: 50, sortOrder: 10 },
  { code: 'gold_tier', name: { fr: 'Membre Gold', en: 'Gold Member', ar: 'عضو ذهبي' }, description: { fr: 'Atteindre 1000 points', en: 'Reach 1000 points', ar: 'الوصول إلى 1000 نقطة' }, icon: '🥇', category: 'loyalty', pointsThreshold: 1000, bonusPoints: 100, sortOrder: 11 },
  { code: 'platinum_tier', name: { fr: 'Membre Platinum', en: 'Platinum Member', ar: 'عضو بلاتيني' }, description: { fr: 'Atteindre 2000 points', en: 'Reach 2000 points', ar: 'الوصول إلى 2000 نقطة' }, icon: '💎', category: 'loyalty', pointsThreshold: 2000, bonusPoints: 200, sortOrder: 12 },
  { code: 'diamond_tier', name: { fr: 'Membre Diamond', en: 'Diamond Member', ar: 'عضو ماسي' }, description: { fr: 'Atteindre 5000 points', en: 'Reach 5000 points', ar: 'الوصول إلى 5000 نقطة' }, icon: '👑', category: 'loyalty', pointsThreshold: 5000, bonusPoints: 500, sortOrder: 13 },
  { code: 'photographer', name: { fr: 'Photographe', en: 'Photographer', ar: 'مصور' }, description: { fr: '10 photos ajoutées', en: '10 photos uploaded', ar: '10 صور مرفوعة' }, icon: '📸', category: 'achievement', actionRequired: 'photo_upload', actionCountRequired: 10, bonusPoints: 50, sortOrder: 20 },
  { code: 'social_butterfly', name: { fr: 'Papillon social', en: 'Social Butterfly', ar: 'فراشة اجتماعية' }, description: { fr: '5 partages sociaux', en: '5 social shares', ar: '5 مشاركات' }, icon: '🦋', category: 'social', actionRequired: 'social_share', actionCountRequired: 5, bonusPoints: 30, sortOrder: 21 },
  { code: 'verified_host', name: { fr: 'Hôte vérifié', en: 'Verified Host', ar: 'مضيف موثق' }, description: { fr: 'Propriété vérifiée', en: 'Property verified', ar: 'عقار موثق' }, icon: '✅', category: 'achievement', actionRequired: 'property_verified', actionCountRequired: 1, bonusPoints: 100, sortOrder: 22 },
];

@Injectable()
export class BadgeService {
  private readonly logger = new Logger(BadgeService.name);

  constructor(
    @InjectRepository(Badge) private readonly badgeRepo: Repository<Badge>,
    @InjectRepository(UserBadge) private readonly userBadgeRepo: Repository<UserBadge>,
    @InjectRepository(UserPoints) private readonly pointsRepo: Repository<UserPoints>,
    @InjectRepository(PointTransaction) private readonly transRepo: Repository<PointTransaction>,
  ) {
    this.seedDefaults();
  }

  private async seedDefaults() {
    const count = await this.badgeRepo.count();
    if (count > 0) return;
    for (const b of DEFAULT_BADGES) {
      await this.badgeRepo.save(this.badgeRepo.create(b));
    }
    this.logger.log(`Seeded ${DEFAULT_BADGES.length} default badges`);
  }

  /** Get all badges with user unlock status */
  async getAllBadges(_scopeCtx?: ScopeContext): Promise<Badge[]> {
    return this.badgeRepo.find({ where: { isActive: true }, order: { sortOrder: 'ASC' } });
  }

  /** Get user's unlocked badges */
  async getUserBadges(userId: number, _scopeCtx?: ScopeContext): Promise<UserBadge[]> {
    return this.userBadgeRepo.find({ where: { userId }, relations: ['badge'], order: { unlockedAt: 'DESC' } });
  }

  /** Check and unlock badges after points change or action */
  async checkAndUnlock(userId: number, action?: string, _scopeCtx?: ScopeContext): Promise<UserBadge[]> {
    const unlocked: UserBadge[] = [];
    const allBadges = await this.badgeRepo.find({ where: { isActive: true } });
    const existingBadges = await this.userBadgeRepo.find({ where: { userId } });
    const existingCodes = new Set(existingBadges.map(ub => ub.badge?.code || ub.badgeId));

    const userPoints = await this.pointsRepo.findOne({ where: { userId } });
    const lifetimePoints = userPoints?.lifetimePoints || 0;

    for (const badge of allBadges) {
      if (existingCodes.has(badge.code) || existingCodes.has(badge.id)) continue;

      let qualified = false;

      // Points threshold check
      if (badge.pointsThreshold > 0 && lifetimePoints >= badge.pointsThreshold) {
        qualified = true;
      }

      // Action count check
      if (badge.actionRequired && badge.actionCountRequired > 0) {
        const actionCount = await this.transRepo.count({
          where: { userId, action: badge.actionRequired as any },
        });
        if (actionCount >= badge.actionCountRequired) {
          qualified = true;
        }
      }

      if (qualified) {
        const userBadge = this.userBadgeRepo.create({
          userId, badgeId: badge.id, user: { id: userId } as any,
        });
        const saved = await this.userBadgeRepo.save(userBadge);
        saved.badge = badge;
        unlocked.push(saved);
        this.logger.log(`Badge "${badge.code}" unlocked for user ${userId}`);
      }
    }

    return unlocked;
  }

  /** Get badge progress for a user */
  async getBadgeProgress(userId: number, _scopeCtx?: ScopeContext): Promise<Array<{ badge: Badge; progress: number; total: number; unlocked: boolean }>> {
    const allBadges = await this.badgeRepo.find({ where: { isActive: true }, order: { sortOrder: 'ASC' } });
    const userBadges = await this.userBadgeRepo.find({ where: { userId } });
    const unlockedIds = new Set(userBadges.map(ub => ub.badgeId));

    const userPoints = await this.pointsRepo.findOne({ where: { userId } });
    const lifetimePoints = userPoints?.lifetimePoints || 0;

    const result: Array<{ badge: Badge; progress: number; total: number; unlocked: boolean }> = [];

    for (const badge of allBadges) {
      const unlocked = unlockedIds.has(badge.id);
      let progress = 0;
      let total = 1;

      if (badge.pointsThreshold > 0) {
        total = badge.pointsThreshold;
        progress = Math.min(lifetimePoints, total);
      } else if (badge.actionRequired && badge.actionCountRequired > 0) {
        total = badge.actionCountRequired;
        const count = await this.transRepo.count({ where: { userId, action: badge.actionRequired as any } });
        progress = Math.min(count, total);
      }

      result.push({ badge, progress, total, unlocked });
    }

    return result;
  }
}
