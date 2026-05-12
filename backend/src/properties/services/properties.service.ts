import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In } from 'typeorm';
import { Property } from '../entity/property.entity';
import { PropertyAvailability } from '../entity/property-availability.entity';
import { PropertyPromo } from '../entity/property-promo.entity';
import { PromoAlert } from '../entity/promo-alert.entity';
import { SavedSearchAlert } from '../entity/saved-search-alert.entity';
import { VerificationDocument } from '../entity/verification-document.entity';
import { Booking } from '../../bookings/entity/booking.entity';
import { RedisCacheService } from '../../infrastructure/redis';
import { RedisLockService } from '../../infrastructure/redis';
import { ScopeFilterService } from '../../rbac/services/scope-filter.service';
import { ScopeContext, getScopedPerms } from '../../rbac/scope-context';

const IDENTITY_TYPES = ['national_id', 'passport', 'permit'];
const DEED_TYPES = ['notarized_deed', 'land_registry'];
const CACHE_TTL_DETAIL = 600;
const CACHE_TTL_SEARCH = 120;
const CACHE_TTL_AVAIL = 300;

const PERM_KEY_FIND_ALL = 'backend.PropertiesController.findAll.GET';
const PERM_KEY_FIND_ONE = 'backend.PropertiesController.findOne.GET';
const PERM_KEY_UPDATE = 'backend.PropertiesController.update.PUT';
const PERM_KEY_DELETE = 'backend.PropertiesController.delete.DELETE';

@Injectable()
export class PropertiesService {
  private readonly logger = new Logger(PropertiesService.name);

  constructor(
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
    @InjectRepository(PropertyAvailability)
    private readonly availabilityRepository: Repository<PropertyAvailability>,
    @InjectRepository(PropertyPromo)
    private readonly promoRepository: Repository<PropertyPromo>,
    @InjectRepository(PromoAlert)
    private readonly promoAlertRepository: Repository<PromoAlert>,
    @InjectRepository(SavedSearchAlert)
    private readonly savedSearchAlertRepository: Repository<SavedSearchAlert>,
    @InjectRepository(VerificationDocument)
    private readonly verificationDocRepository: Repository<VerificationDocument>,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    private readonly cache: RedisCacheService,
    private readonly lock: RedisLockService,
    private readonly scopeFilter: ScopeFilterService,
  ) {}

  /**
   * Resolve allowed property IDs for the current user's role and scoped perms.
   * Returns null if no filtering is needed (public, hyper_admin, admin with 'all', etc).
   * Returns string[] of allowed IDs otherwise.
   */
  private async resolveAllowedPropertyIds(
    scopeCtx: ScopeContext | undefined,
    permissionKey: string,
  ): Promise<string[] | null> {
    return this.scopeFilter.effectivePropertyIds(scopeCtx, permissionKey);
  }

  async findAll(filters: {
    city?: string;
    type?: string;
    minPrice?: number;
    maxPrice?: number;
    guests?: number;
    bedrooms?: number;
    checkIn?: string;
    checkOut?: string;
    minTrustStars?: number;
    sort?: string;
    status?: string;
    page: number;
    limit: number;
  }, scopeCtx?: ScopeContext) {
    const query = this.propertyRepository.createQueryBuilder('property');

    // Management roles (hyper_admin, hyper_manager, admin, manager) may see
    // ALL statuses for resources they own/manage. Public + 'user'/'guest'
    // listings are always restricted to 'published'.
    const seeAllStatuses = this.scopeFilter.canSeeAllStatuses(scopeCtx);
    const ALLOWED = ['draft', 'published', 'archived', 'suspended'];
    if (!seeAllStatuses) {
      query.where('property.status = :status', { status: 'published' });
    } else if (filters.status && filters.status !== 'all' && ALLOWED.includes(filters.status)) {
      query.where('property.status = :status', { status: filters.status });
    } else {
      query.where('1 = 1');
    }

    // Apply scope filtering (admin → own, manager → assigned, hyper → none)
    const allowedIds = await this.resolveAllowedPropertyIds(scopeCtx, PERM_KEY_FIND_ALL);
    if (allowedIds !== null) {
      if (allowedIds.length === 0) {
        return { data: [], total: 0, page: filters.page, limit: filters.limit, totalPages: 0 };
      }
      query.andWhere('property.id IN (:...allowedIds)', { allowedIds });
    }

    if (filters.city) {
      query.andWhere('(property.city LIKE :city OR property.wilaya LIKE :city)', {
        city: `%${filters.city}%`,
      });
    }

    if (filters.type) {
      query.andWhere('property.propertyType = :type', { type: filters.type });
    }

    if (filters.minPrice) {
      query.andWhere('property.pricePerNight >= :minPrice', { minPrice: filters.minPrice });
    }

    if (filters.maxPrice) {
      query.andWhere('property.pricePerNight <= :maxPrice', { maxPrice: filters.maxPrice });
    }

    if (filters.guests) {
      query.andWhere('property.maxGuests >= :guests', { guests: filters.guests });
    }

    if (filters.bedrooms) {
      query.andWhere('property.bedrooms >= :bedrooms', { bedrooms: filters.bedrooms });
    }

    if (filters.minTrustStars && filters.minTrustStars > 0) {
      query.andWhere('property.trustStars >= :minTrust', { minTrust: filters.minTrustStars });
    }

    switch (filters.sort) {
      case 'price_asc':
        query.orderBy('property.pricePerNight', 'ASC');
        break;
      case 'price_desc':
        query.orderBy('property.pricePerNight', 'DESC');
        break;
      case 'rating':
        query.orderBy('property.averageRating', 'DESC');
        break;
      case 'newest':
        query.orderBy('property.createdAt', 'DESC');
        break;
      default:
        query.orderBy('property.trustStars', 'DESC')
          .addOrderBy('property.averageRating', 'DESC')
          .addOrderBy('property.bookingCount', 'DESC');
    }

    const skip = (filters.page - 1) * filters.limit;
    query.skip(skip).take(filters.limit);

    const filterHash = this.cache.hashFilters(filters);
    const scopeSuffix = allowedIds ? `:s${allowedIds.sort().join(',')}` : '';
    const cacheKey = this.cache.key('search', 'properties', filterHash + scopeSuffix);

    return this.cache.getOrSet(cacheKey, async () => {
      const [data, total] = await query.getManyAndCount();
      return {
        data,
        total,
        page: filters.page,
        limit: filters.limit,
        totalPages: Math.ceil(total / filters.limit),
      };
    }, CACHE_TTL_SEARCH);
  }

  async findOne(id: string, scopeCtx?: ScopeContext) {
    // Check scope access
    const allowedIds = await this.resolveAllowedPropertyIds(scopeCtx, PERM_KEY_FIND_ONE);
    if (allowedIds !== null && !allowedIds.includes(id)) {
      throw new ForbiddenException('You do not have access to this property');
    }

    const cacheKey = this.cache.key('property', id);
    return this.cache.getOrSet(cacheKey, () =>
      this.propertyRepository.findOne({
        where: { id },
        relations: ['host'],
      }),
      CACHE_TTL_DETAIL,
    );
  }

  async create(createDto: Partial<Property>) {
    const property = this.propertyRepository.create(createDto);
    return this.propertyRepository.save(property);
  }

  async update(id: string, updateDto: Partial<Property>, scopeCtx?: ScopeContext) {
    // Check scope access
    const allowedIds = await this.resolveAllowedPropertyIds(scopeCtx, PERM_KEY_UPDATE);
    if (allowedIds !== null && !allowedIds.includes(id)) {
      throw new ForbiddenException('You do not have access to update this property');
    }

    await this.propertyRepository.update(id, updateDto);
    await this.cache.del(this.cache.key('property', id));
    await this.cache.invalidatePattern('app:search:properties:*');
    return this.findOne(id);
  }

  async deleteImage(id: string, url: string, scopeCtx?: ScopeContext) {
    if (!url) throw new NotFoundException('Image URL is required');
    const allowedIds = await this.resolveAllowedPropertyIds(scopeCtx, PERM_KEY_UPDATE);
    if (allowedIds !== null && !allowedIds.includes(id)) {
      throw new ForbiddenException('You do not have access to update this property');
    }
    const property = await this.propertyRepository.findOne({ where: { id } });
    if (!property) throw new NotFoundException('Property not found');
    const images = (property.images || []).filter((u) => u !== url);
    await this.propertyRepository.update(id, { images });

    // Best-effort delete the file on disk if it's a local upload
    try {
      if (url.startsWith('/uploads/') || url.startsWith('uploads/')) {
        const fs = await import('fs/promises');
        const path = await import('path');
        const rel = url.replace(/^\//, '');
        await fs.unlink(path.join(process.cwd(), rel));
      }
    } catch (err) {
      this.logger.warn(`Failed to remove image file from disk: ${url} (${(err as Error).message})`);
    }

    await this.cache.del(this.cache.key('property', id));
    await this.cache.invalidatePattern('app:search:properties:*');
    return { success: true, images };
  }

  async remove(id: string, scopeCtx?: ScopeContext) {
    const allowedIds = await this.resolveAllowedPropertyIds(scopeCtx, PERM_KEY_DELETE);
    if (allowedIds !== null && !allowedIds.includes(id)) {
      throw new ForbiddenException('You do not have access to delete this property');
    }

    const result = await this.propertyRepository.delete(id);
    await this.cache.del(this.cache.key('property', id));
    await this.cache.invalidatePattern('app:search:properties:*');
    return result;
  }

  async recalculateTrustStars(propertyId: string) {
    const property = await this.propertyRepository.findOne({ where: { id: propertyId } });
    if (!property) throw new NotFoundException('Property not found');

    const approvedDocs = await this.verificationDocRepository.find({
      where: { propertyId, status: 'approved' },
    });

    const docTypes = approvedDocs.map(d => d.type);
    const hasIdentity = docTypes.some(t => IDENTITY_TYPES.includes(t));
    const hasDeed = docTypes.some(t => DEED_TYPES.includes(t));
    const hasUtility = docTypes.includes('utility_bill');

    let trustStars = 0;
    if (hasIdentity) {
      if (hasDeed && hasUtility) trustStars = 5;
      else if (hasDeed) trustStars = 3;
      else if (hasUtility) trustStars = 2;
      else trustStars = 1;
    }

    const isVerified = trustStars > 0;
    await this.propertyRepository.update(propertyId, { trustStars, isVerified });

    this.logger.log(
      `Trust recalculated: property=${propertyId}, stars=${trustStars}, ` +
      `identity=${hasIdentity}, deed=${hasDeed}, utility=${hasUtility}, ` +
      `docs=[${docTypes.join(', ')}]`,
    );

    return { propertyId, trustStars, isVerified };
  }

  // ─── Availability ──────────────────────────────────────────────────────────

  async getAvailability(propertyId: string, from: string, to: string) {
    const cacheKey = this.cache.key('avail', propertyId, from, to);
    return this.cache.getOrSet(cacheKey, async () => {
      const records = await this.availabilityRepository.find({
        where: {
          propertyId,
          date: Between(new Date(from), new Date(to)),
        },
        order: { date: 'ASC' },
      });
      const map = new Map<string, { date: any; isBlocked: boolean; customPrice: number | null }>();
      for (const r of records) {
        const key = typeof r.date === 'string' ? r.date : new Date(r.date).toISOString().slice(0, 10);
        map.set(key, { date: r.date, isBlocked: r.isBlocked, customPrice: r.customPrice });
      }

      // Merge active booking ranges as blocked dates.
      // Active = pending | accepted | confirmed (rejected / cancelled / archived /
      // completed / refunded do NOT block).
      const activeBookings = await this.bookingRepository.find({
        where: {
          propertyId,
          status: In(['pending', 'accepted', 'confirmed']),
        },
        select: ['id', 'checkInDate', 'checkOutDate'],
      });
      const fromDate = new Date(from);
      const toDate = new Date(to);
      for (const b of activeBookings) {
        const start = new Date(b.checkInDate);
        const end = new Date(b.checkOutDate);
        for (
          let d = new Date(Math.max(start.getTime(), fromDate.getTime()));
          d < end && d <= toDate;
          d.setDate(d.getDate() + 1)
        ) {
          const key = d.toISOString().slice(0, 10);
          const existing = map.get(key);
          if (existing) {
            existing.isBlocked = true;
          } else {
            map.set(key, { date: key, isBlocked: true, customPrice: null });
          }
        }
      }

      return Array.from(map.values())
        .sort((a, b) => String(a.date).localeCompare(String(b.date)))
        .map(r => ({
        date: r.date,
        isBlocked: r.isBlocked,
        customPrice: r.customPrice,
      }));
    }, CACHE_TTL_AVAIL);
  }

  async updateAvailability(propertyId: string, data: {
    dates: Array<{ date: string; isBlocked?: boolean; customPrice?: number | null }>;
  }, scopeCtx?: ScopeContext) {
    // Check scope access
    const allowedIds = await this.resolveAllowedPropertyIds(scopeCtx, PERM_KEY_UPDATE);
    if (allowedIds !== null && !allowedIds.includes(propertyId)) {
      throw new ForbiddenException('You do not have access to update this property');
    }

    const property = await this.propertyRepository.findOne({ where: { id: propertyId } });
    if (!property) throw new NotFoundException('Property not found');

    for (const entry of data.dates) {
      await this.availabilityRepository.upsert(
        {
          propertyId,
          date: new Date(entry.date),
          isBlocked: entry.isBlocked ?? false,
          customPrice: entry.customPrice ?? null,
        },
        ['propertyId', 'date'],
      );
    }

    await this.cache.invalidatePattern(`app:avail:${propertyId}:*`);
    return { success: true, updated: data.dates.length };
  }

  // ─── Promos ────────────────────────────────────────────────────────────────

  async createPromo(propertyId: string, data: {
    startDate: string;
    endDate: string;
    discountPercent?: number;
    fixedPrice?: number;
    label?: string;
  }) {
    const property = await this.propertyRepository.findOne({ where: { id: propertyId } });
    if (!property) throw new NotFoundException('Property not found');

    const promo = this.promoRepository.create({
      propertyId,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      discountPercent: data.discountPercent || 0,
      fixedPrice: data.fixedPrice,
      label: data.label,
    });
    return this.promoRepository.save(promo);
  }

  async getPromos(propertyId: string) {
    return this.promoRepository.find({
      where: { propertyId, isActive: true },
      order: { startDate: 'ASC' },
    });
  }

  async deletePromo(propertyId: string, promoId: string) {
    const result = await this.promoRepository.delete({ id: promoId, propertyId });
    return { deleted: result.affected > 0 };
  }

  // ─── Promo Alerts ──────────────────────────────────────────────────────────

  async subscribePromoAlert(propertyId: string, userId: number, body: {
    notifyEmail?: boolean;
    notifyPhone?: boolean;
  }) {
    const existing = await this.promoAlertRepository.findOne({
      where: { propertyId, userId },
    });
    if (existing) {
      await this.promoAlertRepository.update(existing.id, {
        notifyEmail: body.notifyEmail ?? true,
        notifyPhone: body.notifyPhone ?? false,
        isActive: true,
      });
      return { ...existing, ...body, isActive: true };
    }
    const alert = this.promoAlertRepository.create({
      propertyId,
      userId,
      notifyEmail: body.notifyEmail ?? true,
      notifyPhone: body.notifyPhone ?? false,
    });
    return this.promoAlertRepository.save(alert);
  }

  async unsubscribePromoAlert(propertyId: string, userId: number) {
    await this.promoAlertRepository.update(
      { propertyId, userId },
      { isActive: false },
    );
    return { success: true };
  }

  // ─── Saved Search Alerts ───────────────────────────────────────────────────

  async getSavedSearchAlerts(userId: number) {
    return this.savedSearchAlertRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async createSavedSearchAlert(userId: number, body: {
    name: string;
    criteria: any;
    frequency?: string;
    channels?: string[];
  }) {
    const alert = this.savedSearchAlertRepository.create({
      userId,
      name: body.name,
      criteria: body.criteria,
      frequency: (body.frequency as any) || 'daily',
      channels: (body.channels as any) || ['email'],
    });
    return this.savedSearchAlertRepository.save(alert);
  }

  async updateSavedSearchAlert(id: string, userId: number, body: Partial<{
    name: string;
    criteria: any;
    frequency: string;
    channels: string[];
    isActive: boolean;
  }>) {
    const alert = await this.savedSearchAlertRepository.findOne({ where: { id, userId } });
    if (!alert) throw new NotFoundException('Alert not found');
    await this.savedSearchAlertRepository.update(id, body as any);
    return this.savedSearchAlertRepository.findOne({ where: { id } });
  }

  async deleteSavedSearchAlert(id: string, userId: number) {
    const alert = await this.savedSearchAlertRepository.findOne({ where: { id, userId } });
    if (!alert) throw new NotFoundException('Alert not found');
    await this.savedSearchAlertRepository.delete(id);
    return { deleted: true };
  }
}
