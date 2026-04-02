import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In } from 'typeorm';
import { Booking } from '../entity/booking.entity';
import { Property } from '../../properties/entity/property.entity';
import { TourismService } from '../../services/entity/tourism-service.entity';
import { User } from '../../user/entity/user.entity';
import { UserRole } from '../../user/entity/user-role.entity';

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
    @InjectRepository(UserRole)
    private readonly userRoleRepo: Repository<UserRole>,
  ) {}

  async getDetailedUsers(filters: {
    role?: string;
    status?: string;
    page: number;
    limit: number;
  }): Promise<PaginatedResult<any>> {
    const qb = this.userRepo.createQueryBuilder('u')
      .leftJoinAndSelect('u.roles', 'ur', 'ur.userId = u.id');

    if (filters.status === 'active') qb.andWhere('u.isActive = :active', { active: true });
    if (filters.status === 'inactive') qb.andWhere('u.isActive = :active', { active: false });

    const total = await qb.getCount();
    const users = await qb
      .skip((filters.page - 1) * filters.limit)
      .take(filters.limit)
      .orderBy('u.id', 'DESC')
      .getMany();

    // Get roles separately for clean mapping
    const allRoles = await this.userRoleRepo.find();
    const roleMap = new Map<number, string[]>();
    allRoles.forEach(r => {
      if (!roleMap.has(r.userId)) roleMap.set(r.userId, []);
      roleMap.get(r.userId)!.push(r.role);
    });

    let data = users.map(u => ({
      id: u.id,
      email: u.email,
      firstName: u.firstName,
      lastName: u.lastName,
      phoneNbr: u.phoneNbr,
      city: u.city,
      country: u.country,
      isActive: u.isActive,
      roles: roleMap.get(u.id) || ['user'],
    }));

    // Filter by role if specified
    if (filters.role) {
      data = data.filter(u => u.roles.includes(filters.role));
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
  }): Promise<PaginatedResult<any>> {
    const qb = this.bookingRepo.createQueryBuilder('b')
      .leftJoinAndSelect('b.property', 'p')
      .leftJoinAndSelect('b.guest', 'g');

    if (filters.status) qb.andWhere('b.status = :status', { status: filters.status });
    if (filters.propertyId) qb.andWhere('b.propertyId = :pid', { pid: filters.propertyId });
    if (filters.guestId) qb.andWhere('b.guestId = :gid', { gid: parseInt(filters.guestId, 10) });
    if (filters.from) qb.andWhere('b.createdAt >= :from', { from: filters.from });
    if (filters.to) qb.andWhere('b.createdAt <= :to', { to: filters.to });

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
  }): Promise<PaginatedResult<any>> {
    const qb = this.propertyRepo.createQueryBuilder('p')
      .leftJoinAndSelect('p.host', 'h');

    if (filters.status) qb.andWhere('p.status = :status', { status: filters.status });
    if (filters.hostId) qb.andWhere('p.hostId = :hid', { hid: parseInt(filters.hostId, 10) });
    if (filters.city) qb.andWhere('p.city LIKE :city', { city: `%${filters.city}%` });

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
  }): Promise<PaginatedResult<any>> {
    const qb = this.serviceRepo.createQueryBuilder('s')
      .leftJoinAndSelect('s.provider', 'p');

    if (filters.status) qb.andWhere('s.status = :status', { status: filters.status });
    if (filters.providerId) qb.andWhere('s.providerId = :pid', { pid: parseInt(filters.providerId, 10) });
    if (filters.category) qb.andWhere('s.category = :cat', { cat: filters.category });

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
  }) {
    const qb = this.bookingRepo.createQueryBuilder('b')
      .select("DATE_FORMAT(b.createdAt, '%Y-%m')", 'month')
      .addSelect('SUM(b.totalPrice)', 'revenue')
      .addSelect('COUNT(b.id)', 'bookings')
      .where('b.status IN (:...statuses)', { statuses: ['confirmed', 'completed'] });

    if (filters.from) qb.andWhere('b.createdAt >= :from', { from: filters.from });
    if (filters.to) qb.andWhere('b.createdAt <= :to', { to: filters.to });

    const results = await qb.groupBy('month').orderBy('month', 'DESC').limit(12).getRawMany();

    return results.map(r => ({
      month: r.month,
      revenue: parseFloat(r.revenue) || 0,
      bookings: parseInt(r.bookings, 10) || 0,
    }));
  }

  async getPlatformSummary() {
    const [
      totalUsers,
      activeUsers,
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
      this.userRepo.count(),
      this.userRepo.count({ where: { isActive: true } }),
      this.propertyRepo.count(),
      this.propertyRepo.count({ where: { status: 'published' } }),
      this.propertyRepo.count({ where: { status: 'suspended' } }),
      this.propertyRepo.count({ where: { status: 'archived' } }),
      this.serviceRepo.count(),
      this.serviceRepo.count({ where: { status: 'published' } }),
      this.bookingRepo.count(),
      this.bookingRepo.count({ where: { status: 'pending' } }),
      this.bookingRepo.count({ where: { status: 'confirmed' } }),
      this.bookingRepo.count({ where: { status: 'completed' } }),
      this.bookingRepo.count({ where: { status: 'cancelled' } }),
    ]);

    const revenueResult = await this.bookingRepo
      .createQueryBuilder('b')
      .select('SUM(b.totalPrice)', 'total')
      .where('b.status IN (:...statuses)', { statuses: ['confirmed', 'completed'] })
      .getRawOne();

    return {
      users: { total: totalUsers, active: activeUsers, inactive: totalUsers - activeUsers },
      properties: { total: totalProperties, published: publishedProperties, paused: pausedProperties, archived: archivedProperties, draft: totalProperties - publishedProperties - pausedProperties - archivedProperties },
      services: { total: totalServices, published: publishedServices },
      bookings: { total: totalBookings, pending: pendingBookings, confirmed: confirmedBookings, completed: completedBookings, cancelled: cancelledBookings },
      revenue: { total: parseFloat(revenueResult?.total) || 0 },
    };
  }
}
