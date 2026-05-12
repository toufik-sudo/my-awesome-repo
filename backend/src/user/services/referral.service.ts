import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Referral, PropertyShare } from '../entity/referral.entity';
import { PointsService } from '../../modules/points/services/points.service';
import { JobProducerService } from '../../infrastructure/jobs';
import * as crypto from 'crypto';
import { NotificationContent } from '../../notification/constants/notification-content.constant';

const REFERRER_SIGNUP_POINTS = 100;
const REFERRED_SIGNUP_POINTS = 50;
const REFERRER_FIRST_BOOKING_POINTS = 100;

@Injectable()
export class ReferralService {
  private readonly logger = new Logger(ReferralService.name);

  constructor(
    @InjectRepository(Referral)
    private readonly referralRepo: Repository<Referral>,
    @InjectRepository(PropertyShare)
    private readonly shareRepo: Repository<PropertyShare>,
    private readonly pointsService: PointsService,
    private readonly jobs: JobProducerService,
  ) {}

  /** Generate a unique referral code for a user */
  async getOrCreateReferralCode(userId: number): Promise<string> {
    const existing = await this.referralRepo.findOne({
      where: { referrerId: userId, status: 'pending', sharedPropertyId: null as any },
    });
    if (existing) return existing.code;

    const code = `REF-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    const referral = this.referralRepo.create({
      referrerId: userId,
      code,
      status: 'pending',
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
    });
    await this.referralRepo.save(referral);
    return code;
  }

  /** Create a referral invitation */
  async createReferral(userId: number, data: {
    method: string;
    inviteeContact?: string;
    propertyId?: string;
  }): Promise<Referral> {
    const code = `REF-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    const referral = this.referralRepo.create({
      referrerId: userId,
      code,
      method: data.method,
      inviteeContact: data.inviteeContact,
      sharedPropertyId: data.propertyId,
      status: 'pending',
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    });
    return this.referralRepo.save(referral);
  }

  /** Record a property share action */
  async shareProperty(userId: number, propertyId: string, method: string, recipient?: string): Promise<PropertyShare> {
    const share = this.shareRepo.create({ userId, propertyId, method, recipient });
    return this.shareRepo.save(share);
  }

  /** Complete a referral when someone signs up with a code */
  async completeSignup(code: string, newUserId: number): Promise<Referral | null> {
    const referral = await this.referralRepo.findOne({ where: { code } });
    if (!referral || referral.status !== 'pending') return null;
    if (referral.referrerId === newUserId) {
      this.logger.warn(`Self-referral attempt blocked: user ${newUserId} / code ${code}`);
      return null;
    }
    if (referral.expiresAt && new Date() > referral.expiresAt) {
      referral.status = 'expired';
      await this.referralRepo.save(referral);
      return null;
    }

    referral.referredUserId = newUserId;
    referral.status = 'signed_up';

    // Award points to both sides
    try {
      await this.pointsService.awardPoints(referral.referrerId, 'referral_signup', {
        customPoints: REFERRER_SIGNUP_POINTS,
        description: `Referral signup bonus (code ${referral.code})`,
        referenceId: referral.id,
        referenceType: 'referral',
      });
      referral.referrerPointsAwarded = REFERRER_SIGNUP_POINTS;

      await this.pointsService.awardPoints(newUserId, 'referral_signup', {
        customPoints: REFERRED_SIGNUP_POINTS,
        description: `Welcome bonus — joined via referral`,
        referenceId: referral.id,
        referenceType: 'referral',
      });
      referral.referredPointsAwarded = REFERRED_SIGNUP_POINTS;
    } catch (e) {
      this.logger.error(`Failed to award referral signup points: ${(e as Error).message}`);
    }

    const saved = await this.referralRepo.save(referral);

    // Notify the referrer
    try {
      await this.jobs.queueNotification({
        userId: referral.referrerId,
        type: 'system' as any,
        ...NotificationContent.referralSignup({ points: REFERRER_SIGNUP_POINTS }),
        channel: 'both',
        actionUrl: '/referrals',
        metadata: { referralId: referral.id },
      });
    } catch (e) {
      this.logger.warn(`Referral notify failed: ${(e as Error).message}`);
    }

    return saved;
  }

  /**
   * Called when a referred user completes their first booking.
   * Transitions: signed_up → first_booking → completed, awards bonus.
   */
  async onReferredUserBooking(referredUserId: number, bookingId?: string) {
    const referral = await this.referralRepo.findOne({
      where: { referredUserId, status: 'signed_up' as any },
    });
    if (!referral) return null;

    referral.status = 'first_booking';
    try {
      await this.pointsService.awardPoints(referral.referrerId, 'first_booking', {
        customPoints: REFERRER_FIRST_BOOKING_POINTS,
        description: `Referred user completed first booking`,
        referenceId: bookingId || referral.id,
        referenceType: 'booking',
      });
      referral.referrerPointsAwarded += REFERRER_FIRST_BOOKING_POINTS;
    } catch (e) {
      this.logger.error(`Failed to award first-booking points: ${(e as Error).message}`);
    }
    referral.status = 'completed';
    const saved = await this.referralRepo.save(referral);

    try {
      await this.jobs.queueNotification({
        userId: referral.referrerId,
        type: 'system' as any,
        ...NotificationContent.referralCompleted({ points: REFERRER_FIRST_BOOKING_POINTS }),
        channel: 'both',
        actionUrl: '/referrals',
        metadata: { referralId: referral.id, bookingId },
      });
    } catch {}

    return saved;
  }

  /** Get referrals by user */
  async getUserReferrals(
    userId: number,
    pagination?: { page?: number; limit?: number },
  ) {
    const page = Math.max(1, pagination?.page ?? 1);
    const limit = Math.max(1, Math.min(100, pagination?.limit ?? 20));
    const [data, total] = await this.referralRepo.findAndCount({
      where: { referrerId: userId },
      relations: ['referredUser'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  /** Get referral stats */
  async getReferralStats(userId: number) {
    const referrals = await this.referralRepo.find({ where: { referrerId: userId } });
    return {
      total: referrals.length,
      pending: referrals.filter(r => r.status === 'pending').length,
      signedUp: referrals.filter(r => r.status === 'signed_up').length,
      completed: referrals.filter(r => r.status === 'completed').length,
      totalPointsEarned: referrals.reduce((sum, r) => sum + r.referrerPointsAwarded, 0),
    };
  }

  /**
   * Scoped view of referrals for admin/manager (their invited users) or hyper (all).
   * Returns referrals + aggregated stats.
   */
  async getScopedReferrals(
    scopeCtx: { userId: number; userRole: string },
    pagination?: { page?: number; limit?: number },
  ) {
    const qb = this.referralRepo
      .createQueryBuilder('r')
      .leftJoinAndSelect('r.referredUser', 'referredUser')
      .leftJoinAndSelect('r.referrer', 'referrer')
      .orderBy('r.createdAt', 'DESC');

    const role = scopeCtx.userRole;
    if (role === 'hyper_admin' || role === 'hyper_manager') {
      // No filter — sees all referrals platform-wide
    } else if (role === 'admin' || role === 'manager') {
      // No users.invitedBy column — derive invited user IDs from accepted invitations
      // matched on email/phone.
      qb.where(
        `(r.referrerId = :uid OR r.referrerId IN (
            SELECT u.id FROM users u
            INNER JOIN invitations i
              ON i.status = 'accepted'
             AND i.invitedBy = :uid
             AND ((i.email IS NOT NULL AND i.email = u.email)
                  OR (i.phone IS NOT NULL AND i.phone = u.phoneNbr))
         ))`,
        { uid: scopeCtx.userId },
      );
    } else {
      qb.where('r.referrerId = :uid', { uid: scopeCtx.userId });
    }

    // Aggregate stats over the entire scoped set (not just current page)
    const allReferrals = await qb.getMany();
    const stats = {
      total: allReferrals.length,
      pending: allReferrals.filter(r => r.status === 'pending').length,
      signedUp: allReferrals.filter(r => r.status === 'signed_up').length,
      firstBooking: allReferrals.filter(r => r.status === 'first_booking').length,
      completed: allReferrals.filter(r => r.status === 'completed').length,
      expired: allReferrals.filter(r => r.status === 'expired').length,
      totalReferrerPoints: allReferrals.reduce((s, r) => s + (r.referrerPointsAwarded || 0), 0),
      totalReferredPoints: allReferrals.reduce((s, r) => s + (r.referredPointsAwarded || 0), 0),
    };

    const page = Math.max(1, pagination?.page ?? 1);
    const limit = Math.max(1, Math.min(100, pagination?.limit ?? 20));
    const total = allReferrals.length;
    const data = allReferrals.slice((page - 1) * limit, page * limit);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit), stats };
  }

  /** Get property share stats */
  async getShareStats(propertyId: string) {
    const shares = await this.shareRepo.find({ where: { propertyId } });
    const byMethod: Record<string, number> = {};
    shares.forEach(s => { byMethod[s.method] = (byMethod[s.method] || 0) + 1; });
    return { total: shares.length, byMethod };
  }
}
