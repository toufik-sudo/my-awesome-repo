import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from '../properties/entity/property.entity';
import { Booking } from '../bookings/entity/booking.entity';
import { Favorite } from '../favorites/entity/favorite.entity';
import { VerificationDocument } from '../properties/entity/verification-document.entity';
import { ScopeContext } from '../rbac/scope-context';

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
  ) {}

  async getDashboard(userId: number, _scopeCtx?: ScopeContext) {
    // ── Properties stats ──
    const myProperties = await this.propertyRepo.find({ where: { hostId: userId } });
    const totalProperties = myProperties.length;
    const publishedProperties = myProperties.filter(p => p.status === 'published').length;
    const avgTrustStars = totalProperties > 0
      ? Math.round((myProperties.reduce((sum, p) => sum + p.trustStars, 0) / totalProperties) * 10) / 10
      : 0;

    // ── Bookings stats (as guest) ──
    const myBookings = await this.bookingRepo.find({
      where: { guestId: userId },
      relations: ['property'],
      order: { createdAt: 'DESC' },
    });
    const totalBookings = myBookings.length;
    const pendingBookings = myBookings.filter(b => b.status === 'pending').length;
    const confirmedBookings = myBookings.filter(b => b.status === 'confirmed').length;
    const completedBookings = myBookings.filter(b => b.status === 'completed').length;
    const totalSpent = myBookings
      .filter(b => b.status !== 'cancelled' && b.status !== 'rejected')
      .reduce((sum, b) => sum + Number(b.totalPrice), 0);

    // ── Host bookings (incoming) ──
    const propertyIds = myProperties.map(p => p.id);
    let hostBookings: Booking[] = [];
    if (propertyIds.length > 0) {
      hostBookings = await this.bookingRepo
        .createQueryBuilder('booking')
        .leftJoinAndSelect('booking.property', 'property')
        .leftJoinAndSelect('booking.guest', 'guest')
        .where('booking.propertyId IN (:...ids)', { ids: propertyIds })
        .orderBy('booking.createdAt', 'DESC')
        .getMany();
    }
    const totalRevenue = hostBookings
      .filter(b => b.status === 'confirmed' || b.status === 'completed')
      .reduce((sum, b) => sum + Number(b.totalPrice), 0);
    const pendingRequests = hostBookings.filter(b => b.status === 'pending').length;

    // ── Monthly revenue chart (last 6 months) ──
    const now = new Date();
    const revenueByMonth: { month: string; revenue: number; bookings: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const monthName = d.toLocaleString('default', { month: 'short', year: '2-digit' });
      const monthBookings = hostBookings.filter(b => {
        const bd = new Date(b.createdAt);
        return bd.getFullYear() === d.getFullYear() && bd.getMonth() === d.getMonth()
          && (b.status === 'confirmed' || b.status === 'completed');
      });
      revenueByMonth.push({
        month: monthName,
        revenue: monthBookings.reduce((s, b) => s + Number(b.totalPrice), 0),
        bookings: monthBookings.length,
      });
    }

    // ── Favorites count ──
    const favoritesCount = await this.favoriteRepo.count({ where: { userId } });

    // ── Verification documents ──
    let verificationStats = { total: 0, approved: 0, pending: 0, rejected: 0 };
    if (propertyIds.length > 0) {
      const docs = await this.verDocRepo
        .createQueryBuilder('doc')
        .where('doc.propertyId IN (:...ids)', { ids: propertyIds })
        .getMany();
      verificationStats = {
        total: docs.length,
        approved: docs.filter(d => d.status === 'approved').length,
        pending: docs.filter(d => d.status === 'pending').length,
        rejected: docs.filter(d => d.status === 'rejected').length,
      };
    }

    // ── Recent bookings (last 5) ──
    const recentBookings = myBookings.slice(0, 5).map(b => ({
      id: b.id,
      propertyTitle: b.property?.title || 'Unknown',
      propertyImage: b.property?.images?.[0] || '',
      location: b.property ? `${b.property.city}, ${b.property.wilaya}` : '',
      checkIn: b.checkInDate,
      checkOut: b.checkOutDate,
      status: b.status,
      totalPrice: b.totalPrice,
      guests: b.numberOfGuests,
    }));

    // ── Recent host requests (last 5) ──
    const recentHostRequests = hostBookings.slice(0, 5).map(b => ({
      id: b.id,
      guestName: (b as any).guest?.firstName
        ? `${(b as any).guest.firstName} ${(b as any).guest.lastName?.[0] || ''}.`
        : 'Guest',
      propertyTitle: b.property?.title || 'Unknown',
      checkIn: b.checkInDate,
      checkOut: b.checkOutDate,
      status: b.status,
      totalPrice: b.totalPrice,
      guests: b.numberOfGuests,
    }));

    // ── Property type distribution ──
    const propertyTypeDistribution = myProperties.reduce((acc, p) => {
      acc[p.propertyType] = (acc[p.propertyType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      stats: {
        totalProperties,
        publishedProperties,
        avgTrustStars,
        totalBookings,
        pendingBookings,
        confirmedBookings,
        completedBookings,
        totalSpent,
        totalRevenue,
        pendingRequests,
        favoritesCount,
      },
      verificationStats,
      revenueByMonth,
      recentBookings,
      recentHostRequests,
      propertyTypeDistribution,
      properties: myProperties.slice(0, 6).map(p => ({
        id: p.id,
        title: p.title,
        image: p.images?.[0] || '',
        location: `${p.city}, ${p.wilaya}`,
        price: p.pricePerNight,
        rating: p.averageRating,
        reviewCount: p.reviewCount,
        bookingCount: p.bookingCount,
        trustStars: p.trustStars,
        isVerified: p.isVerified,
        status: p.status,
      })),
    };
  }
}
