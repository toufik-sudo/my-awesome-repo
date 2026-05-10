import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Property } from '../properties/entity/property.entity';
import { Booking } from '../bookings/entity/booking.entity';
import { Favorite } from '../favorites/entity/favorite.entity';
import { VerificationDocument } from '../properties/entity/verification-document.entity';
import { ScopeContext, getScopedPerms } from '../rbac/scope-context';
import { ScopeFilterService } from '../rbac/services/scope-filter.service';
import { MaterializedViewService } from './materialized-view.service';

const PERM_KEY_DASHBOARD = 'backend.DashboardController.getDashboard.GET';

/**
 * Dashboard read service. Heavy aggregates (counts, sums, monthly revenue,
 * verification breakdown, property-type distribution) come from the
 * `mv_*` materialized views (see migration 1779000000000). Only the small
 * "recent N" lists still hit the live tables — they're already LIMIT-ed
 * and use the existing indexes.
 */
@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepo: Repository<Property>,
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
    @InjectRepository(Favorite)
    private readonly favoriteRepo: Repository<Favorite>,
    @InjectRepository(VerificationDocument)
    private readonly verDocRepo: Repository<VerificationDocument>,
    private readonly scopeFilter: ScopeFilterService,
    private readonly mv: MaterializedViewService,
  ) {}

  async getDashboard(userId: number, scopeCtx?: ScopeContext) {
    let effectiveHostId = userId;
    let scopedPropertyIds: string[] | null = null;
    const role = scopeCtx?.userRole;

    if (scopeCtx) {
      if (role === 'admin') {
        effectiveHostId = scopeCtx.scopedAdminId || userId;
      } else if (role === 'manager' || role === 'guest') {
        const scopedPerms = getScopedPerms(scopeCtx);
        scopedPropertyIds = await this.scopeFilter.resolvePropertyIds(scopedPerms, PERM_KEY_DASHBOARD);
        if (scopedPropertyIds !== null && scopedPropertyIds.length === 0) {
          return this.emptyDashboard(userId);
        }
      }
    }

    const isHyper = role === 'hyper_admin' || role === 'hyper_manager';
    const isScoped = scopedPropertyIds !== null;

    // ── Resolve which hostIds the MV lookups should sum over ──
    let hostIds: number[] | null = null; // null = all (hyper)
    if (!isHyper) {
      if (isScoped) {
        const rows = await this.propertyRepo
          .createQueryBuilder('p').select('DISTINCT p.hostId', 'hostId')
          .where('p.id IN (:...ids)', { ids: scopedPropertyIds }).getRawMany();
        hostIds = rows.map(r => Number(r.hostId)).filter(Boolean);
      } else {
        hostIds = [effectiveHostId];
      }
    } else {
      const rows = await this.propertyRepo
        .createQueryBuilder('p').select('DISTINCT p.hostId', 'hostId').getRawMany();
      hostIds = rows.map(r => Number(r.hostId)).filter(Boolean);
    }

    // ── Aggregates from MV ──
    const agg = await this.mv.getMultiHostAggregates(hostIds);
    const verificationStats = await this.aggregateVerification(hostIds);
    const revenueByMonth = await this.aggregateMonthlyRevenue(hostIds);

    // ── User-side stats from MV ──
    const userStats = (await this.mv.getUserBookingStats(userId)) ?? {
      totalBookings: 0, pendingBookings: 0, confirmedBookings: 0,
      completedBookings: 0, totalSpent: 0,
    };

    // ── Small recent lists (live, LIMIT-ed) ──
    const recentMyBookings = await this.bookingRepo.find({
      where: { guestId: userId },
      relations: ['property'],
      order: { createdAt: 'DESC' },
      take: 5,
    });

    let recentHostBookings: Booking[] = [];
    if (isScoped) {
      recentHostBookings = scopedPropertyIds!.length
        ? await this.bookingRepo.createQueryBuilder('b')
            .leftJoinAndSelect('b.property', 'property')
            .leftJoinAndSelect('b.guest', 'guest')
            .where('b.propertyId IN (:...ids)', { ids: scopedPropertyIds })
            .orderBy('b.createdAt', 'DESC').limit(5).getMany()
        : [];
    } else if (isHyper) {
      recentHostBookings = await this.bookingRepo.createQueryBuilder('b')
        .leftJoinAndSelect('b.property', 'property')
        .leftJoinAndSelect('b.guest', 'guest')
        .orderBy('b.createdAt', 'DESC').limit(5).getMany();
    } else {
      recentHostBookings = await this.bookingRepo.createQueryBuilder('b')
        .leftJoinAndSelect('b.property', 'property')
        .leftJoinAndSelect('b.guest', 'guest')
        .innerJoin('b.property', 'p2', 'p2.hostId = :hid', { hid: effectiveHostId })
        .orderBy('b.createdAt', 'DESC').limit(5).getMany();
    }

    const favoritesCount = await this.favoriteRepo.count({ where: { userId } });

    // ── Properties preview (small list) ──
    let previewProperties: Property[];
    if (isScoped) {
      previewProperties = scopedPropertyIds!.length
        ? await this.propertyRepo.find({ where: { id: In(scopedPropertyIds!) }, take: 6 })
        : [];
    } else if (isHyper) {
      previewProperties = await this.propertyRepo.find({ take: 6, order: { createdAt: 'DESC' } });
    } else {
      previewProperties = await this.propertyRepo.find({ where: { hostId: effectiveHostId }, take: 6 });
    }

    return {
      stats: {
        totalProperties: agg.totalProperties,
        publishedProperties: agg.publishedProperties,
        avgTrustStars: agg.avgTrustStars,
        totalBookings: userStats.totalBookings,
        pendingBookings: userStats.pendingBookings,
        confirmedBookings: userStats.confirmedBookings,
        completedBookings: userStats.completedBookings,
        totalSpent: userStats.totalSpent,
        totalRevenue: agg.totalRevenue,
        pendingRequests: agg.pendingRequests,
        favoritesCount,
      },
      verificationStats,
      revenueByMonth,
      recentBookings: recentMyBookings.map(b => ({
        id: b.id,
        propertyTitle: b.property?.title || 'Unknown',
        propertyImage: b.property?.images?.[0] || '',
        location: b.property ? `${b.property.city}, ${b.property.wilaya}` : '',
        checkIn: b.checkInDate, checkOut: b.checkOutDate,
        status: b.status, totalPrice: b.totalPrice, guests: b.numberOfGuests,
      })),
      recentHostRequests: recentHostBookings.map(b => ({
        id: b.id,
        guestName: (b as any).guest?.firstName
          ? `${(b as any).guest.firstName} ${(b as any).guest.lastName?.[0] || ''}.`
          : 'Guest',
        propertyTitle: b.property?.title || 'Unknown',
        checkIn: b.checkInDate, checkOut: b.checkOutDate,
        status: b.status, totalPrice: b.totalPrice, guests: b.numberOfGuests,
      })),
      propertyTypeDistribution: agg.propertyTypeDistribution,
      properties: previewProperties.map(p => ({
        id: p.id, title: p.title, image: p.images?.[0] || '',
        location: `${p.city}, ${p.wilaya}`, price: p.pricePerNight,
        rating: p.averageRating, reviewCount: p.reviewCount,
        bookingCount: p.bookingCount, trustStars: p.trustStars,
        isVerified: p.isVerified, status: p.status,
      })),
    };
  }

  private async aggregateVerification(hostIds: number[] | null) {
    const acc = { total: 0, approved: 0, pending: 0, rejected: 0 };
    if (!hostIds || !hostIds.length) return acc;
    for (const id of hostIds) {
      const v = await this.mv.getVerificationStats(id);
      acc.total += v.total; acc.approved += v.approved;
      acc.pending += v.pending; acc.rejected += v.rejected;
    }
    return acc;
  }

  private async aggregateMonthlyRevenue(hostIds: number[] | null) {
    const blank = this.mv['monthKeyOffset'] // ensure available; otherwise rebuild list manually
      ? null : null;
    void blank;
    const months = await this.mv.getHostRevenueLast6Months(hostIds && hostIds[0] ? hostIds[0] : 0);
    if (!hostIds || hostIds.length <= 1) return months;
    // Sum across remaining hostIds.
    const buckets = months.map(m => ({ ...m }));
    for (let i = 1; i < hostIds.length; i++) {
      const extra = await this.mv.getHostRevenueLast6Months(hostIds[i]);
      extra.forEach((m, idx) => {
        buckets[idx].revenue += m.revenue;
        buckets[idx].bookings += m.bookings;
      });
    }
    return buckets;
  }

  private emptyDashboard(_userId: number) {
    return {
      stats: { totalProperties: 0, publishedProperties: 0, avgTrustStars: 0, totalBookings: 0, pendingBookings: 0, confirmedBookings: 0, completedBookings: 0, totalSpent: 0, totalRevenue: 0, pendingRequests: 0, favoritesCount: 0 },
      verificationStats: { total: 0, approved: 0, pending: 0, rejected: 0 },
      revenueByMonth: [],
      recentBookings: [],
      recentHostRequests: [],
      propertyTypeDistribution: {},
      properties: [],
    };
  }
}
