import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Referral, PropertyShare } from '../entity/referral.entity';
import * as crypto from 'crypto';

@Injectable()
export class ReferralService {
  private readonly logger = new Logger(ReferralService.name);

  constructor(
    @InjectRepository(Referral)
    private readonly referralRepo: Repository<Referral>,
    @InjectRepository(PropertyShare)
    private readonly shareRepo: Repository<PropertyShare>,
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
    if (referral.expiresAt && new Date() > referral.expiresAt) {
      referral.status = 'expired';
      await this.referralRepo.save(referral);
      return null;
    }

    referral.referredUserId = newUserId;
    referral.status = 'signed_up';
    return this.referralRepo.save(referral);
  }

  /** Get referrals by user */
  async getUserReferrals(userId: number): Promise<Referral[]> {
    return this.referralRepo.find({
      where: { referrerId: userId },
      relations: ['referredUser'],
      order: { createdAt: 'DESC' },
    });
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

  /** Get property share stats */
  async getShareStats(propertyId: string) {
    const shares = await this.shareRepo.find({ where: { propertyId } });
    const byMethod: Record<string, number> = {};
    shares.forEach(s => { byMethod[s.method] = (byMethod[s.method] || 0) + 1; });
    return { total: shares.length, byMethod };
  }
}
