import { Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, In } from 'typeorm';
import { UserBlame, BlameType } from '../entity/user-blame.entity';
import { JobProducerService } from '../../infrastructure/jobs';
import { NotificationContent } from '../../notification/constants/notification-content.constant';

const HYPER_ROLES = ['hyper_admin', 'hyper_manager'];

@Injectable()
export class UserBlameService {
  private readonly logger = new Logger(UserBlameService.name);

  constructor(
    @InjectRepository(UserBlame)
    private readonly blameRepo: Repository<UserBlame>,
    private readonly jobs: JobProducerService,
  ) {}

  /**
   * Issue a blame and notify the user. Idempotent on (userId, type, bookingRef).
   */
  async createBlame(args: {
    userId: number;
    type: BlameType;
    reason: string;
    bookingRef?: string;
    createdByUserId?: number;
  }): Promise<UserBlame> {
    if (args.bookingRef) {
      const existing = await this.blameRepo.findOne({
        where: {
          userId: args.userId,
          type: args.type,
          bookingRef: args.bookingRef,
          removedAt: IsNull(),
        },
      });
      if (existing) return existing;
    }

    const blame = this.blameRepo.create({
      userId: args.userId,
      type: args.type,
      reason: args.reason,
      bookingRef: args.bookingRef || null,
      createdByUserId: args.createdByUserId || null,
    });
    const saved = await this.blameRepo.save(blame);

    this.logger.warn(`[Blame] user=${args.userId} type=${args.type} ref=${args.bookingRef || '-'}`);

    await this.jobs.queueNotification({
      userId: args.userId,
      type: 'general',
      ...NotificationContent.blameAdded({ reason: args.reason }),
      channel: 'both',
      actionUrl: '/support',
      metadata: { blameId: saved.id, blameType: args.type, bookingRef: args.bookingRef },
    });

    return saved;
  }

  async listForUser(userId: number, includeRemoved = false): Promise<UserBlame[]> {
    const where: any = { userId };
    if (!includeRemoved) where.removedAt = IsNull();
    return this.blameRepo.find({ where, order: { createdAt: 'DESC' } });
  }

  async getActiveCount(userId: number): Promise<number> {
    return this.blameRepo.count({ where: { userId, removedAt: IsNull() } });
  }

  /** Active blame counts for many users (badge rendering on listings/cards). */
  async getActiveCountsBulk(userIds: number[]): Promise<Record<number, number>> {
    if (!userIds.length) return {};
    const rows = await this.blameRepo
      .createQueryBuilder('b')
      .select('b.userId', 'userId')
      .addSelect('COUNT(*)', 'count')
      .where('b.userId IN (:...ids)', { ids: userIds })
      .andWhere('b.removedAt IS NULL')
      .groupBy('b.userId')
      .getRawMany();
    const out: Record<number, number> = {};
    for (const r of rows) out[Number(r.userId)] = Number(r.count);
    return out;
  }

  async listAll(filters: { userId?: number; type?: BlameType; active?: boolean } = {}) {
    const qb = this.blameRepo.createQueryBuilder('b')
      .leftJoinAndSelect('b.user', 'user')
      .orderBy('b.createdAt', 'DESC');
    if (filters.userId) qb.andWhere('b.userId = :uid', { uid: filters.userId });
    if (filters.type) qb.andWhere('b.type = :t', { t: filters.type });
    if (filters.active === true) qb.andWhere('b.removedAt IS NULL');
    if (filters.active === false) qb.andWhere('b.removedAt IS NOT NULL');
    return qb.getMany();
  }

  /** Hyper admin/manager removes a blame after support contact. */
  async removeBlame(id: string, removedByUserId: number, callerRole: string, note?: string) {
    if (!HYPER_ROLES.includes(callerRole)) {
      throw new ForbiddenException('Only hyper admin/manager can remove blames');
    }
    const blame = await this.blameRepo.findOne({ where: { id } });
    if (!blame) throw new NotFoundException('Blame not found');
    if (blame.removedAt) return blame;

    blame.removedAt = new Date();
    blame.removedByUserId = removedByUserId;
    blame.removalNote = note || null;
    const saved = await this.blameRepo.save(blame);

    await this.jobs.queueNotification({
      userId: blame.userId,
      type: 'general',
      ...NotificationContent.blameRemoved({ note }),
      channel: 'both',
      actionUrl: '/profile',
      metadata: { blameId: saved.id },
    });

    return saved;
  }
}
