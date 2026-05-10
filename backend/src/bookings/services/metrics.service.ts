import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In } from 'typeorm';
import { Booking } from '../entity/booking.entity';
import { Property } from '../../properties/entity/property.entity';
import { TourismService } from '../../services/entity/tourism-service.entity';
import { AppRole, User } from '../../user/entity/user.entity';
import { ScopeContext, getScopedPerms } from '../../rbac/scope-context';
import { ScopeFilterService } from '../../rbac/services/scope-filter.service';

const PERM_KEY_DETAILED_USERS = 'backend.MetricsController.getDetailedUsers.GET';
const PERM_KEY_DETAILED_BOOKINGS = 'backend.MetricsController.getDetailedBookings.GET';
const PERM_KEY_DETAILED_PROPERTIES = 'backend.MetricsController.getDetailedProperties.GET';
const PERM_KEY_DETAILED_SERVICES = 'backend.MetricsController.getDetailedServices.GET';
const PERM_KEY_REVENUE = 'backend.MetricsController.getRevenueBreakdown.GET';
const PERM_KEY_SUMMARY = 'backend.MetricsController.getPlatformSummary.GET';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class MetricsService {
  private readonly logger = new Logger(MetricsService.name);

  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
    @InjectRepository(Property)
    private readonly propertyRepo: Repository<Property>,
    @InjectRepository(TourismService)
    private readonly serviceRepo: Repository<TourismService>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly scopeFilter: ScopeFilterService,
  ) {}

  private async resolveAllowedPropertyIds(
    scopeCtx: ScopeContext | undefined,
    permissionKey: string,
  ): Promise<string[] | null> {
    if (!scopeCtx) return null;
    const { userRole } = scopeCtx;
    if (['hyper_admin', 'hyper_manager'].includes(userRole)) return null;
    if (userRole === 'admin') {
      // Admin sees only their own properties
      const props = await this.propertyRepo.find({
        where: { hostId: scopeCtx.userId },
        select: ['id'],
      });
      return props.map(p => p.id);
    }
    const scopedPerms = getScopedPerms(scopeCtx);
    if (scopedPerms.length === 0) return [];
    return this.scopeFilter.resolvePropertyIds(scopedPerms, permissionKey);
  }

  private async resolveAllowedServiceIds(
    scopeCtx: ScopeContext | undefined,
    permissionKey: string,
  ): Promise<string[] | null> {
    if (!scopeCtx) return null;
    const { userRole } = scopeCtx;
    if (['hyper_admin', 'hyper_manager'].includes(userRole)) return null;
    if (userRole === 'admin') {
      const svcs = await this.serviceRepo.find({
        where: { providerId: scopeCtx.userId },
        select: ['id'],
      });
      return svcs.map(s => s.id);
    }
    const scopedPerms = getScopedPerms(scopeCtx);
    if (scopedPerms.length === 0) return [];
    return this.scopeFilter.resolveServiceIds(scopedPerms, permissionKey);
  }

  async getDetailedUsers(filters: {
    role?: AppRole;
    status?: string;
    page: number;
    limit: number;
  }, scopeCtx?: ScopeContext): Promise<PaginatedResult<any>> {
    const qb = this.userRepo.createQueryBuilder('u');

    if (filters.status === 'active') qb.andWhere('u.isActive = :active', { active: true });
    if (filters.status === 'inactive') qb.andWhere('u.isActive = :active', { active: false });

    // Scope: admin sees only users they invited
    if (scopeCtx && scopeCtx.userRole === 'admin') {
      qb.andWhere('u.invitedBy = :inviterId', { inviterId: scopeCtx.userId });
    } else if (scopeCtx && scopeCtx.userRole === 'manager') {
      // Manager sees only guests they invited
      qb.andWhere('u.invitedBy = :inviterId', { inviterId: scopeCtx.userId });
    }

    const total = await qb.getCount();
    const users = await qb
      .skip((filters.page - 1) * filters.limit)
      .take(filters.limit)
      .orderBy('u.id', 'DESC')
      .getMany();

    let data = users.map(u => ({
      id: u.id,
      email: u.email,
      firstName: u.firstName,
      lastName: u.lastName,
      phoneNbr: u.phoneNbr,
      city: u.city,
      country: u.country,
      isActive: u.isActive,
      role: u.getRole(),
    }));

    if (filters.role) {
      data = data.filter(u => u.role === filters.role);
    }

    return {
      data,
      total: filters.role ? data.length : total,
      page: filters.page,
      limit: filters.limit,
      totalPages: Math.ceil((filters.role ? data.length : total) / filters.limit),
    };
  }

  async getDetailedBookings(filters: {
    status?: string;
    propertyId?: string;
    guestId?: string;
    from?: string;
    to?: string;
    page: number;
    limit: number;
  }, scopeCtx?: ScopeContext): Promise<PaginatedResult<any>> {
    const qb = this.bookingRepo.createQueryBuilder('b')
      .leftJoinAndSelect('b.property', 'p')
      .leftJoinAndSelect('b.guest', 'g');

    if (filters.status) qb.andWhere('b.status = :status', { status: filters.status });
    if (filters.propertyId) qb.andWhere('b.propertyId = :pid', { pid: filters.propertyId });
    if (filters.guestId) qb.andWhere('b.guestId = :gid', { gid: parseInt(filters.guestId, 10) });
    if (filters.from) qb.andWhere('b.createdAt >= :from', { from: filters.from });
    if (filters.to) qb.andWhere('b.createdAt <= :to', { to: filters.to });

    // Scope filtering
    const allowedPropertyIds = await this.resolveAllowedPropertyIds(scopeCtx, PERM_KEY_DETAILED_BOOKINGS);
    if (allowedPropertyIds !== null) {
      if (allowedPropertyIds.length === 0) {
        return { data: [], total: 0, page: filters.page, limit: filters.limit, totalPages: 0 };
      }
      qb.andWhere('b.propertyId IN (:...allowedPropIds)', { allowedPropIds: allowedPropertyIds });
    }

    const total = await qb.getCount();
    const bookings = await qb
      .skip((filters.page - 1) * filters.limit)
      .take(filters.limit)
      .orderBy('b.createdAt', 'DESC')
      .getMany();

    return {
      data: bookings.map(b => ({
        id: b.id,
        propertyId: b.propertyId,
        propertyTitle: b.property?.title || '—',
        propertyCity: b.property?.city || '—',
        guestId: b.guestId,
        guestEmail: b.guest?.email || '—',
        guestName: `${b.guest?.firstName || ''} ${b.guest?.lastName || ''}`.trim() || '—',
        checkIn: b.checkInDate,
        checkOut: b.checkOutDate,
        nights: b.numberOfNights,
        guests: b.numberOfGuests,
        totalPrice: b.totalPrice,
        currency: b.currency,
        status: b.status,
        paymentStatus: b.paymentStatus,
        paymentMethod: b.paymentMethod,
        createdAt: b.createdAt,
      })),
      total,
      page: filters.page,
      limit: filters.limit,
      totalPages: Math.ceil(total / filters.limit),
    };
  }

  async getDetailedProperties(filters: {
    status?: string;
    hostId?: string;
    city?: string;
    page: number;
    limit: number;
  }, scopeCtx?: ScopeContext): Promise<PaginatedResult<any>> {
    const qb = this.propertyRepo.createQueryBuilder('p')
      .leftJoinAndSelect('p.host', 'h');

    if (filters.status) qb.andWhere('p.status = :status', { status: filters.status });
    if (filters.hostId) qb.andWhere('p.hostId = :hid', { hid: parseInt(filters.hostId, 10) });
    if (filters.city) qb.andWhere('p.city LIKE :city', { city: `%${filters.city}%` });

    // Scope filtering
    const allowedPropertyIds = await this.resolveAllowedPropertyIds(scopeCtx, PERM_KEY_DETAILED_PROPERTIES);
    if (allowedPropertyIds !== null) {
      if (allowedPropertyIds.length === 0) {
        return { data: [], total: 0, page: filters.page, limit: filters.limit, totalPages: 0 };
      }
      qb.andWhere('p.id IN (:...allowedPropIds)', { allowedPropIds: allowedPropertyIds });
    }

    const total = await qb.getCount();
    const properties = await qb
      .skip((filters.page - 1) * filters.limit)
      .take(filters.limit)
      .orderBy('p.createdAt', 'DESC')
      .getMany();

    return {
      data: properties.map(p => ({
        id: p.id,
        title: p.title,
        propertyType: p.propertyType,
        status: p.status,
        city: p.city,
        wilaya: p.wilaya,
        pricePerNight: p.pricePerNight,
        currency: p.currency,
        hostId: p.hostId,
        hostEmail: p.host?.email || '—',
        hostName: `${p.host?.firstName || ''} ${p.host?.lastName || ''}`.trim() || '—',
        bedrooms: p.bedrooms,
        maxGuests: p.maxGuests,
        averageRating: p.averageRating,
        reviewCount: p.reviewCount,
        bookingCount: p.bookingCount,
        trustStars: p.trustStars,
        isVerified: p.isVerified,
        isAvailable: p.isAvailable,
        createdAt: p.createdAt,
      })),
      total,
      page: filters.page,
      limit: filters.limit,
      totalPages: Math.ceil(total / filters.limit),
    };
  }

  async getDetailedServices(filters: {
    status?: string;
    providerId?: string;
    category?: string;
    page: number;
    limit: number;
  }, scopeCtx?: ScopeContext): Promise<PaginatedResult<any>> {
    const qb = this.serviceRepo.createQueryBuilder('s')
      .leftJoinAndSelect('s.provider', 'p');

    if (filters.status) qb.andWhere('s.status = :status', { status: filters.status });
    if (filters.providerId) qb.andWhere('s.providerId = :pid', { pid: parseInt(filters.providerId, 10) });
    if (filters.category) qb.andWhere('s.category = :cat', { cat: filters.category });

    // Scope filtering
    const allowedServiceIds = await this.resolveAllowedServiceIds(scopeCtx, PERM_KEY_DETAILED_SERVICES);
    if (allowedServiceIds !== null) {
      if (allowedServiceIds.length === 0) {
        return { data: [], total: 0, page: filters.page, limit: filters.limit, totalPages: 0 };
      }
      qb.andWhere('s.id IN (:...allowedSvcIds)', { allowedSvcIds: allowedServiceIds });
    }

    const total = await qb.getCount();
    const services = await qb
      .skip((filters.page - 1) * filters.limit)
      .take(filters.limit)
      .orderBy('s.createdAt', 'DESC')
      .getMany();

    return {
      data: services.map(s => ({
        id: s.id,
        title: s.title,
        category: s.category,
        status: s.status,
        city: s.city,
        price: s.price,
        currency: s.currency,
        pricingType: s.pricingType,
        providerId: s.providerId,
        providerEmail: s.provider?.email || '—',
        providerName: `${s.provider?.firstName || ''} ${s.provider?.lastName || ''}`.trim() || '—',
        averageRating: s.averageRating,
        reviewCount: s.reviewCount,
        bookingCount: s.bookingCount,
        isAvailable: s.isAvailable,
        createdAt: s.createdAt,
      })),
      total,
      page: filters.page,
      limit: filters.limit,
      totalPages: Math.ceil(total / filters.limit),
    };
  }

  async getRevenueBreakdown(filters: {
    from?: string;
    to?: string;
    groupBy: string;
  }, scopeCtx?: ScopeContext) {
    const qb = this.bookingRepo.createQueryBuilder('b')
      .select("DATE_FORMAT(b.createdAt, '%Y-%m')", 'month')
      .addSelect('SUM(b.totalPrice)', 'revenue')
      .addSelect('COUNT(b.id)', 'bookings')
      .where('b.status IN (:...statuses)', { statuses: ['confirmed', 'completed'] });

    if (filters.from) qb.andWhere('b.createdAt >= :from', { from: filters.from });
    if (filters.to) qb.andWhere('b.createdAt <= :to', { to: filters.to });

    // Scope: admin sees only revenue from their properties
    const allowedPropertyIds = await this.resolveAllowedPropertyIds(scopeCtx, PERM_KEY_REVENUE);
    if (allowedPropertyIds !== null) {
      if (allowedPropertyIds.length === 0) return [];
      qb.andWhere('b.propertyId IN (:...allowedPropIds)', { allowedPropIds: allowedPropertyIds });
    }

    const results = await qb.groupBy('month').orderBy('month', 'DESC').limit(12).getRawMany();

    return results.map(r => ({
      month: r.month,
      revenue: parseFloat(r.revenue) || 0,
      bookings: parseInt(r.bookings, 10) || 0,
    }));
  }

  async getPlatformSummary(scopeCtx?: ScopeContext) {
    // Scope filtering for the summary
    const allowedPropertyIds = await this.resolveAllowedPropertyIds(scopeCtx, PERM_KEY_SUMMARY);
    const allowedServiceIds = await this.resolveAllowedServiceIds(scopeCtx, PERM_KEY_SUMMARY);

    // Build property query
    const propQb = this.propertyRepo.createQueryBuilder('p');
    if (allowedPropertyIds !== null) {
      if (allowedPropertyIds.length === 0) {
        return this.emptySummary();
      }
      propQb.andWhere('p.id IN (:...ids)', { ids: allowedPropertyIds });
    }

    // Build service query
    const svcQb = this.serviceRepo.createQueryBuilder('s');
    if (allowedServiceIds !== null) {
      if (allowedServiceIds.length === 0) {
        // No services but may have properties
      } else {
        svcQb.andWhere('s.id IN (:...ids)', { ids: allowedServiceIds });
      }
    }

    // Build booking query scoped to allowed properties
    const bookQb = this.bookingRepo.createQueryBuilder('b');
    if (allowedPropertyIds !== null) {
      bookQb.andWhere('b.propertyId IN (:...ids)', { ids: allowedPropertyIds.length > 0 ? allowedPropertyIds : ['__none__'] });
    }

    const [
      totalProperties,
      publishedProperties,
      pausedProperties,
      archivedProperties,
      totalServices,
      publishedServices,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
    ] = await Promise.all([
      propQb.clone().getCount(),
      propQb.clone().andWhere('p.status = :s', { s: 'published' }).getCount(),
      propQb.clone().andWhere('p.status = :s', { s: 'suspended' }).getCount(),
      propQb.clone().andWhere('p.status = :s', { s: 'archived' }).getCount(),
      svcQb.clone().getCount(),
      svcQb.clone().andWhere('s.status = :s', { s: 'published' }).getCount(),
      bookQb.clone().getCount(),
      bookQb.clone().andWhere('b.status = :s', { s: 'pending' }).getCount(),
      bookQb.clone().andWhere('b.status = :s', { s: 'confirmed' }).getCount(),
      bookQb.clone().andWhere('b.status = :s', { s: 'completed' }).getCount(),
      bookQb.clone().andWhere('b.status = :s', { s: 'cancelled' }).getCount(),
    ]);

    // Users: hyper sees all, admin sees own invitees
    let totalUsers = 0;
    let activeUsers = 0;
    if (!scopeCtx || ['hyper_admin', 'hyper_manager'].includes(scopeCtx.userRole)) {
      totalUsers = await this.userRepo.count();
      activeUsers = await this.userRepo.count({ where: { isActive: true } });
    }

    // Revenue scoped
    const revQb = this.bookingRepo.createQueryBuilder('b')
      .select('SUM(b.totalPrice)', 'total')
      .where('b.status IN (:...statuses)', { statuses: ['confirmed', 'completed'] });
    if (allowedPropertyIds !== null) {
      revQb.andWhere('b.propertyId IN (:...ids)', { ids: allowedPropertyIds.length > 0 ? allowedPropertyIds : ['__none__'] });
    }
    const revenueResult = await revQb.getRawOne();

    return {
      users: { total: totalUsers, active: activeUsers, inactive: totalUsers - activeUsers },
      properties: { total: totalProperties, published: publishedProperties, paused: pausedProperties, archived: archivedProperties, draft: totalProperties - publishedProperties - pausedProperties - archivedProperties },
      services: { total: totalServices, published: publishedServices },
      bookings: { total: totalBookings, pending: pendingBookings, confirmed: confirmedBookings, completed: completedBookings, cancelled: cancelledBookings },
      revenue: { total: parseFloat(revenueResult?.total) || 0 },
    };
  }

  private emptySummary() {
    return {
      users: { total: 0, active: 0, inactive: 0 },
      properties: { total: 0, published: 0, paused: 0, archived: 0, draft: 0 },
      services: { total: 0, published: 0 },
      bookings: { total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0 },
      revenue: { total: 0 },
    };
  }
}
