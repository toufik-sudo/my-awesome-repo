/**
 * Dashboard module types
 */

export interface DashboardStats {
  totalProperties: number;
  publishedProperties: number;
  avgTrustStars: number;
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  totalSpent: number;
  totalRevenue: number;
  pendingRequests: number;
  favoritesCount: number;
}

export interface VerificationStats {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
}

export interface RevenueMonth {
  month: string;
  revenue: number;
  bookings: number;
}

export interface RecentBooking {
  id: string;
  propertyTitle: string;
  propertyImage: string;
  location: string;
  checkIn: string;
  checkOut: string;
  status: string;
  totalPrice: number;
  guests: number;
}

export interface HostRequest {
  id: string;
  guestName: string;
  propertyTitle: string;
  checkIn: string;
  checkOut: string;
  status: string;
  totalPrice: number;
  guests: number;
}

export interface DashboardProperty {
  id: string;
  title: string;
  image: string;
  location: string;
  price: number;
  rating: number;
  reviewCount: number;
  bookingCount: number;
  trustStars: number;
  isVerified: boolean;
  status: string;
}

export interface DashboardData {
  stats: DashboardStats;
  verificationStats: VerificationStats;
  revenueByMonth: RevenueMonth[];
  recentBookings: RecentBooking[];
  recentHostRequests: HostRequest[];
  propertyTypeDistribution: Record<string, number>;
  properties: DashboardProperty[];
}
