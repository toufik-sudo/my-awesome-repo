import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

/**
 * Reads pre-aggregated rows from the `mv_*` summary tables (see migration
 * 1779000000000-materialized-views.ts). Falls back to `null` when a row is
 * missing so callers can compute on-the-fly. Also exposes helpers to force
 * an immediate refresh after a write — useful for "I just confirmed a booking,
 * show me fresh totals" UX flows that can't wait for the 1-minute drainer.
 */
@Injectable()
export class MaterializedViewService {
  private readonly logger = new Logger(MaterializedViewService.name);

  constructor(@InjectDataSource() private readonly ds: DataSource) {}

  // ── Reads ────────────────────────────────────────────────────────────────
  async getHostPropertyStats(hostId: number) {
    const rows = await this.ds.query(
      'SELECT totalProperties, publishedProperties, avgTrustStars, propertyTypeDistribution FROM mv_host_property_stats WHERE hostId = ?',
      [hostId],
    );
    if (!rows.length) return null;
    const r = rows[0];
    return {
      totalProperties: Number(r.totalProperties) || 0,
      publishedProperties: Number(r.publishedProperties) || 0,
      avgTrustStars: Number(r.avgTrustStars) || 0,
      propertyTypeDistribution:
        typeof r.propertyTypeDistribution === 'string'
          ? JSON.parse(r.propertyTypeDistribution)
          : r.propertyTypeDistribution || {},
    };
  }

  async getHostBookingAggregates(hostId: number) {
    const rows = await this.ds.query(
      'SELECT totalRevenue, pendingRequests, confirmedBookings, completedBookings FROM mv_host_booking_aggregates WHERE hostId = ?',
      [hostId],
    );
    if (!rows.length) return null;
    const r = rows[0];
    return {
      totalRevenue: Number(r.totalRevenue) || 0,
      pendingRequests: Number(r.pendingRequests) || 0,
      confirmedBookings: Number(r.confirmedBookings) || 0,
      completedBookings: Number(r.completedBookings) || 0,
    };
  }

  /** Returns last 6 calendar months (oldest → newest), zero-filled. */
  async getHostRevenueLast6Months(hostId: number) {
    const rows: Array<{ year: number; month: number; revenue: string; bookings: number }> =
      await this.ds.query(
        `SELECT year, month, revenue, bookings
         FROM mv_host_revenue_monthly
         WHERE hostId = ?
           AND (year * 100 + month) >= ?`,
        [hostId, this.monthKeyOffset(-5)],
      );
    const byKey = new Map(rows.map(r => [r.year * 100 + r.month, r]));
    const out: { month: string; revenue: number; bookings: number }[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const k = d.getFullYear() * 100 + (d.getMonth() + 1);
      const hit = byKey.get(k);
      out.push({
        month: d.toLocaleString('default', { month: 'short', year: '2-digit' }),
        revenue: hit ? Number(hit.revenue) : 0,
        bookings: hit ? Number(hit.bookings) : 0,
      });
    }
    return out;
  }

  async getUserBookingStats(guestId: number) {
    const rows = await this.ds.query(
      'SELECT totalBookings, pendingBookings, confirmedBookings, completedBookings, totalSpent FROM mv_user_booking_stats WHERE guestId = ?',
      [guestId],
    );
    if (!rows.length) return null;
    const r = rows[0];
    return {
      totalBookings: Number(r.totalBookings) || 0,
      pendingBookings: Number(r.pendingBookings) || 0,
      confirmedBookings: Number(r.confirmedBookings) || 0,
      completedBookings: Number(r.completedBookings) || 0,
      totalSpent: Number(r.totalSpent) || 0,
    };
  }

  async getVerificationStats(hostId: number) {
    const rows = await this.ds.query(
      'SELECT total, approved, pending, rejected FROM mv_property_verification_stats WHERE hostId = ?',
      [hostId],
    );
    if (!rows.length) return { total: 0, approved: 0, pending: 0, rejected: 0 };
    const r = rows[0];
    return {
      total: Number(r.total) || 0,
      approved: Number(r.approved) || 0,
      pending: Number(r.pending) || 0,
      rejected: Number(r.rejected) || 0,
    };
  }

  /** Aggregated multi-host (hyper roles) — sums across given host ids in a single query. */
  async getMultiHostAggregates(hostIds: number[]) {
    if (!hostIds.length) {
      return {
        totalProperties: 0, publishedProperties: 0, avgTrustStars: 0,
        totalRevenue: 0, pendingRequests: 0,
        confirmedBookings: 0, completedBookings: 0,
        propertyTypeDistribution: {} as Record<string, number>,
      };
    }
    const placeholders = hostIds.map(() => '?').join(',');
    const [propRows] = await Promise.all([
      this.ds.query(
        `SELECT
           COALESCE(SUM(totalProperties),0) totalProperties,
           COALESCE(SUM(publishedProperties),0) publishedProperties,
           COALESCE(AVG(NULLIF(avgTrustStars,0)),0) avgTrustStars
         FROM mv_host_property_stats WHERE hostId IN (${placeholders})`,
        hostIds,
      ),
    ]);
    const bookRows = await this.ds.query(
      `SELECT
         COALESCE(SUM(totalRevenue),0) totalRevenue,
         COALESCE(SUM(pendingRequests),0) pendingRequests,
         COALESCE(SUM(confirmedBookings),0) confirmedBookings,
         COALESCE(SUM(completedBookings),0) completedBookings
       FROM mv_host_booking_aggregates WHERE hostId IN (${placeholders})`,
      hostIds,
    );
    const distRows = await this.ds.query(
      `SELECT propertyTypeDistribution FROM mv_host_property_stats WHERE hostId IN (${placeholders})`,
      hostIds,
    );
    const dist: Record<string, number> = {};
    for (const r of distRows) {
      const j = typeof r.propertyTypeDistribution === 'string'
        ? JSON.parse(r.propertyTypeDistribution || '{}')
        : (r.propertyTypeDistribution || {});
      for (const [k, v] of Object.entries(j)) dist[k] = (dist[k] || 0) + Number(v);
    }
    return {
      totalProperties: Number(propRows[0].totalProperties) || 0,
      publishedProperties: Number(propRows[0].publishedProperties) || 0,
      avgTrustStars: Math.round((Number(propRows[0].avgTrustStars) || 0) * 10) / 10,
      totalRevenue: Number(bookRows[0].totalRevenue) || 0,
      pendingRequests: Number(bookRows[0].pendingRequests) || 0,
      confirmedBookings: Number(bookRows[0].confirmedBookings) || 0,
      completedBookings: Number(bookRows[0].completedBookings) || 0,
      propertyTypeDistribution: dist,
    };
  }

  async getPlatformSummary() {
    const rows = await this.ds.query('SELECT * FROM mv_platform_summary WHERE id = 1');
    if (!rows.length) return null;
    const r = rows[0];
    return {
      users: {
        total: Number(r.totalUsers),
        active: Number(r.activeUsers),
        inactive: Number(r.totalUsers) - Number(r.activeUsers),
      },
      properties: {
        total: Number(r.totalProperties),
        published: Number(r.publishedProperties),
      },
      services: { total: Number(r.totalServices) },
      bookings: {
        total: Number(r.totalBookings),
        pending: Number(r.pendingBookings),
        confirmed: Number(r.confirmedBookings),
        completed: Number(r.completedBookings),
        cancelled: Number(r.cancelledBookings),
      },
      revenue: { total: Number(r.totalRevenue) },
      updatedAt: r.updatedAt,
    };
  }

  // ── Manual refresh hooks ─────────────────────────────────────────────────
  async refreshHost(hostId: number) {
    try {
      await Promise.all([
        this.ds.query('CALL sp_refresh_mv_host_property_stats(?)', [hostId]),
        this.ds.query('CALL sp_refresh_mv_host_booking_aggregates(?)', [hostId]),
        this.ds.query('CALL sp_refresh_mv_host_revenue_monthly(?)', [hostId]),
        this.ds.query('CALL sp_refresh_mv_property_verification_stats(?)', [hostId]),
      ]);
    } catch (e) {
      this.logger.warn(`refreshHost(${hostId}) failed: ${(e as Error).message}`);
    }
  }

  async refreshUser(guestId: number) {
    try {
      await this.ds.query('CALL sp_refresh_mv_user_booking_stats(?)', [guestId]);
    } catch (e) {
      this.logger.warn(`refreshUser(${guestId}) failed: ${(e as Error).message}`);
    }
  }

  async refreshPlatform() {
    try { await this.ds.query('CALL sp_refresh_mv_platform_summary()'); }
    catch (e) { this.logger.warn(`refreshPlatform failed: ${(e as Error).message}`); }
  }

  async drainQueueNow() {
    try { await this.ds.query('CALL sp_drain_mv_refresh_queue()'); }
    catch (e) { this.logger.warn(`drain failed: ${(e as Error).message}`); }
  }

  private monthKeyOffset(deltaMonths: number) {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() + deltaMonths);
    return d.getFullYear() * 100 + (d.getMonth() + 1);
  }
}
