import React, { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, MapPin, Users, Clock, CheckCircle2, XCircle, DollarSign,
  ArrowLeft, Search, Filter, Download, TrendingUp, Building2, Eye, MessageSquare,
  FileText, FileSpreadsheet,
} from 'lucide-react';
import { format, parseISO, differenceInDays, subDays, isAfter, isBefore } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { LoadingSpinner } from '@/modules/shared/components/LoadingSpinner';
import { resolveImageUrl } from '@/modules/shared/components/BackendImage';

import { useAuth } from '@/contexts/AuthContext';
import { useHostBookings } from '../bookings.hooks';
import type { BookingResponse } from '../bookings.api';
import { exportBookingsToCSV, exportBookingsToPDF } from '../utils/exportBookings';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const STATUS_CONFIG: Record<string, { icon: React.ElementType; color: string; bgColor: string; label: string }> = {
  pending: { icon: Clock, color: 'text-amber-600', bgColor: 'bg-amber-100 dark:bg-amber-900/30', label: 'Pending' },
  confirmed: { icon: CheckCircle2, color: 'text-emerald-600', bgColor: 'bg-emerald-100 dark:bg-emerald-900/30', label: 'Confirmed' },
  completed: { icon: CheckCircle2, color: 'text-primary', bgColor: 'bg-primary/10', label: 'Completed' },
  cancelled: { icon: XCircle, color: 'text-destructive', bgColor: 'bg-destructive/10', label: 'Cancelled' },
  rejected: { icon: XCircle, color: 'text-destructive', bgColor: 'bg-destructive/10', label: 'Rejected' },
  counter_offer: { icon: DollarSign, color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/30', label: 'Counter Offer' },
  refunded: { icon: DollarSign, color: 'text-orange-600', bgColor: 'bg-orange-100 dark:bg-orange-900/30', label: 'Refunded' },
};

type DateRange = 'all' | '7d' | '30d' | '90d' | '365d';

export const BookingHistory: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<DateRange>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'price_high' | 'price_low'>('newest');

  const isHyperAdmin = user?.role === 'hyper_manager' || user?.role === 'hyper_admin';

  // Fetch all bookings (backend handles role-based filtering)
  const { data: bookings = [], isLoading } = useHostBookings(
    activeTab !== 'all' ? { status: activeTab } : {}
  );

  // Client-side filtering & sorting
  const filteredBookings = useMemo(() => {
    let result = [...bookings];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(b =>
        b.property?.title?.toLowerCase().includes(q) ||
        b.property?.city?.toLowerCase().includes(q) ||
        b.guest?.firstName?.toLowerCase().includes(q) ||
        b.guest?.lastName?.toLowerCase().includes(q) ||
        b.guest?.email?.toLowerCase().includes(q) ||
        b.id?.toLowerCase().includes(q)
      );
    }

    // Date range filter
    if (dateRange !== 'all') {
      const daysMap: Record<string, number> = { '7d': 7, '30d': 30, '90d': 90, '365d': 365 };
      const cutoff = subDays(new Date(), daysMap[dateRange]);
      result = result.filter(b => isAfter(parseISO(b.createdAt), cutoff));
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'newest': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest': return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'price_high': return Number(b.totalPrice) - Number(a.totalPrice);
        case 'price_low': return Number(a.totalPrice) - Number(b.totalPrice);
        default: return 0;
      }
    });

    return result;
  }, [bookings, searchQuery, dateRange, sortBy]);

  // Stats
  const stats = useMemo(() => {
    const total = bookings.length;
    const totalRevenue = bookings
      .filter(b => b.status === 'completed' || b.status === 'confirmed')
      .reduce((sum, b) => sum + Number(b.totalPrice), 0);
    const completedCount = bookings.filter(b => b.status === 'completed').length;
    const cancelledCount = bookings.filter(b => b.status === 'cancelled' || b.status === 'rejected').length;
    return { total, totalRevenue, completedCount, cancelledCount };
  }, [bookings]);

  const tabs = [
    { value: 'all', label: t('bookings.all') || 'All' },
    { value: 'pending', label: t('bookings.pending') || 'Pending' },
    { value: 'confirmed', label: t('bookings.confirmed') || 'Confirmed' },
    { value: 'completed', label: t('bookings.completed') || 'Completed' },
    { value: 'cancelled', label: t('bookings.cancelled') || 'Cancelled' },
    { value: 'rejected', label: t('bookings.rejected') || 'Rejected' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
                {t('bookings.history') || 'Booking History'}
              </h1>
              <p className="text-sm text-muted-foreground">
                {isHyperAdmin
                  ? t('bookings.historyDescHyper') || 'All platform bookings across all properties'
                  : t('bookings.historyDesc') || 'Reservation history for your properties'
                }
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isHyperAdmin && (
              <Badge variant="outline" className="gap-1.5 text-primary border-primary/30 bg-primary/5 px-3 py-1">
                <Building2 className="h-3.5 w-3.5" />
                {t('bookings.allProperties') || 'All Properties'}
              </Badge>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5 rounded-xl" disabled={filteredBookings.length === 0}>
                  <Download className="h-3.5 w-3.5" />
                  {t('common.export') || 'Export'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => exportBookingsToCSV(filteredBookings)} className="gap-2">
                  <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                  {t('common.exportCSV') || 'Export as CSV'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportBookingsToPDF(filteredBookings, t('bookings.history') || 'Booking History')} className="gap-2">
                  <FileText className="h-4 w-4 text-red-600" />
                  {t('common.exportPDF') || 'Export as PDF'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: t('bookings.totalBookings') || 'Total Bookings', value: stats.total, icon: Calendar, color: 'text-primary' },
            { label: t('bookings.totalRevenue') || 'Total Revenue', value: `${stats.totalRevenue.toLocaleString()} DA`, icon: TrendingUp, color: 'text-emerald-600' },
            { label: t('bookings.completed') || 'Completed', value: stats.completedCount, icon: CheckCircle2, color: 'text-blue-600' },
            { label: t('bookings.cancelled') || 'Cancelled', value: stats.cancelledCount, icon: XCircle, color: 'text-destructive' },
          ].map((stat) => (
            <Card key={stat.label} className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-muted/50 ${stat.color}`}>
                    <stat.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className="text-lg font-bold text-foreground">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('bookings.searchPlaceholder') || 'Search by property, guest, or booking ID...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 bg-muted/30 border-border/50 rounded-xl"
            />
          </div>
          <Select value={dateRange} onValueChange={(v) => setDateRange(v as DateRange)}>
            <SelectTrigger className="w-[140px] h-10 rounded-xl">
              <Filter className="h-3.5 w-3.5 mr-1.5" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('common.allTime') || 'All Time'}</SelectItem>
              <SelectItem value="7d">{t('common.last7Days') || 'Last 7 days'}</SelectItem>
              <SelectItem value="30d">{t('common.last30Days') || 'Last 30 days'}</SelectItem>
              <SelectItem value="90d">{t('common.last90Days') || 'Last 90 days'}</SelectItem>
              <SelectItem value="365d">{t('common.lastYear') || 'Last year'}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
            <SelectTrigger className="w-[150px] h-10 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">{t('common.newest') || 'Newest first'}</SelectItem>
              <SelectItem value="oldest">{t('common.oldest') || 'Oldest first'}</SelectItem>
              <SelectItem value="price_high">{t('common.priceHigh') || 'Price: High'}</SelectItem>
              <SelectItem value="price_low">{t('common.priceLow') || 'Price: Low'}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start bg-muted/50 p-1 rounded-xl flex-wrap h-auto gap-1">
            {tabs.map(tab => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm px-4 py-2 text-sm"
              >
                {tab.label}
                {tab.value !== 'all' && (
                  <Badge variant="secondary" className="ml-1.5 h-5 px-1.5 text-[10px]">
                    {bookings.filter(b => b.status === tab.value).length}
                  </Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Results count */}
        <p className="text-sm text-muted-foreground">
          {t('common.showing') || 'Showing'} {filteredBookings.length} {t('common.of') || 'of'} {bookings.length} {t('bookings.bookings') || 'bookings'}
        </p>

        {/* Booking List */}
        {filteredBookings.length === 0 ? (
          <div className="text-center py-20">
            <Calendar className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t('bookings.noBookings') || 'No bookings found'}</h3>
            <p className="text-sm text-muted-foreground">
              {searchQuery ? (t('bookings.noSearchResults') || 'Try adjusting your search or filters') : (t('bookings.emptyHistory') || 'No booking history yet.')}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredBookings.map(booking => {
              const cfg = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending;
              const StatusIcon = cfg.icon;
              const nights = booking.numberOfNights || differenceInDays(parseISO(booking.checkOutDate), parseISO(booking.checkInDate));

              return (
                <Card key={booking.id} className="overflow-hidden border-border/50 hover:shadow-md transition-all group">
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row">
                      {/* Image */}
                      {booking.property?.images?.[0] && (
                        <div className="sm:w-44 h-36 sm:h-auto relative flex-shrink-0 overflow-hidden">
                          <img
                            src={resolveImageUrl(booking.property.images[0])}
                            alt={booking.property.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className={`absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${cfg.bgColor} ${cfg.color}`}>
                            <StatusIcon className="h-3 w-3" />
                            {cfg.label}
                          </div>
                        </div>
                      )}

                      {/* Details */}
                      <div className="flex-1 p-4 sm:p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="font-semibold text-foreground text-base truncate">
                              {booking.property?.title || 'Property'}
                            </h3>
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
                              <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                              <span className="truncate">{booking.property?.city || 'Unknown'}</span>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-lg font-bold text-foreground">
                              {Number(booking.totalPrice).toLocaleString()} DA
                            </p>
                            <p className="text-xs text-muted-foreground">{nights} {t('bookings.nights') || 'nights'}</p>
                          </div>
                        </div>

                        <Separator className="my-3" />

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                            <div>
                              <p className="text-[10px] uppercase tracking-wider font-medium">Check-in</p>
                              <p className="text-foreground font-medium text-xs">
                                {format(parseISO(booking.checkInDate), 'dd MMM yyyy')}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                            <div>
                              <p className="text-[10px] uppercase tracking-wider font-medium">Check-out</p>
                              <p className="text-foreground font-medium text-xs">
                                {format(parseISO(booking.checkOutDate), 'dd MMM yyyy')}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Users className="h-3.5 w-3.5 flex-shrink-0" />
                            <div>
                              <p className="text-[10px] uppercase tracking-wider font-medium">Guests</p>
                              <p className="text-foreground font-medium text-xs">{booking.numberOfGuests}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <DollarSign className="h-3.5 w-3.5 flex-shrink-0" />
                            <div>
                              <p className="text-[10px] uppercase tracking-wider font-medium">Payment</p>
                              <p className="text-foreground font-medium text-xs capitalize">{booking.paymentMethod?.replace('_', ' ')}</p>
                            </div>
                          </div>
                        </div>

                        {/* Guest info */}
                        {booking.guest && (
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/30">
                            <p className="text-xs text-muted-foreground">
                              {t('bookings.guest') || 'Guest'}: <span className="font-medium text-foreground">
                                {booking.guest.firstName} {booking.guest.lastName}
                              </span>
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                              {format(parseISO(booking.createdAt), 'dd MMM yyyy, HH:mm')}
                            </p>
                          </div>
                        )}

                        {booking.guestMessage && (
                          <div className="mt-2 p-2.5 bg-muted/40 rounded-lg">
                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground mb-0.5">
                              <MessageSquare className="h-3 w-3" />
                              {t('bookings.guestMessage') || 'Guest message'}
                            </div>
                            <p className="text-xs text-foreground line-clamp-2">{booking.guestMessage}</p>
                          </div>
                        )}

                        {/* Quick actions */}
                        <div className="flex items-center gap-2 mt-3">
                          {booking.status === 'pending' && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1 text-xs h-8"
                              onClick={() => navigate('/bookings/host')}
                            >
                              <Eye className="h-3 w-3" />
                              {t('bookings.manageRequest') || 'Manage'}
                            </Button>
                          )}
                          {(booking.status === 'confirmed' || booking.status === 'completed') && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1 text-xs h-8"
                              onClick={() => navigate(`/chat/${booking.id}`)}
                            >
                              <MessageSquare className="h-3 w-3" />
                              {t('bookings.chat') || 'Chat'}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default BookingHistory;
