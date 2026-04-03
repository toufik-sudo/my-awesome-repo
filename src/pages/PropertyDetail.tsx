import React, { useState } from 'react';
import { PropertyShare as PropertyShareButton } from '@/modules/referrals/components/PropertyShare';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import {
  MapPin,
  Star,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  X,
  Wifi,
  Car,
  Wind,
  Tv,
  UtensilsCrossed,
  WashingMachine,
  Shield,
  Waves,
  Mountain,
  Coffee,
  Users,
  BedDouble,
  Bath,
  Maximize,
  Calendar,
  Check,
  Pencil,
  Copy,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { BookingWidget } from '@/modules/bookings/components/BookingWidget';
import { PricingBreakdownSection, PaymentMethodType } from '@/modules/shared/components/PricingBreakdownSection';
import logoImage from '@/assets/byootdz-logo.png';
import { TrustBadge } from '@/modules/shared/components/TrustBadge';
import { BackendImage, resolveImageUrl } from '@/modules/shared/components/BackendImage';
import { LoadingSpinner } from '@/modules/shared/components/LoadingSpinner';
import { ReviewForm } from '@/modules/reviews/components/ReviewForm';
import { usePropertyReviews } from '@/modules/reviews/reviews.hooks';
import { propertiesApi } from '@/modules/properties/properties.api';

// Amenity icon map
const AMENITY_ICONS: Record<string, React.ElementType> = {
  wifi: Wifi, parking: Car, ac: Wind, tv: Tv,
  kitchen: UtensilsCrossed, washer: WashingMachine,
  security: Shield, pool: Waves, garden: Mountain, breakfast: Coffee,
};

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const canEdit = ['admin', 'manager', 'hyper_manager', 'hyper_admin'].includes(user?.role || '');

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Fetch property from API
  const { data: property, isLoading, isError } = useQuery({
    queryKey: ['property', id],
    queryFn: () => propertiesApi.getById(id!),
    enabled: !!id,
    retry: 1,
  });

  // Fetch reviews from API
  const { data: reviews = [], isLoading: reviewsLoading } = usePropertyReviews(id || '');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="lg" text={t('common.loading', 'Loading...')} />
      </div>
    );
  }

  if (isError || !property) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">{t('common.error', 'Something went wrong')}</p>
        <Button variant="outline" onClick={() => navigate(-1)}>
          {t('common.goBack', 'Go Back')}
        </Button>
      </div>
    );
  }

  // Normalize property data from API
  const images: string[] = property.images || [];
  const amenities: string[] = property.amenities || [];
  const pricePerNight = (property as any).pricePerNight ?? property.price ?? 0;
  const rating = (property as any).averageRating ?? property.rating ?? 0;
  const reviewCount = (property as any).reviewCount ?? property.reviewCount ?? 0;
  const maxGuests = (property as any).maxGuests ?? property.guests ?? 0;
  const bedrooms = property.bedrooms ?? 0;
  const bathrooms = property.bathrooms ?? 0;
  const beds = (property as any).beds ?? bedrooms;
  const title = property.title ?? '';
  const description = property.description ?? '';
  const location = (property as any).city
    ? `${(property as any).city}, ${(property as any).wilaya || (property as any).country || ''}`
    : property.location?.city
      ? `${property.location.city}, ${property.location.country}`
      : '';
  const address = (property as any).address ?? property.location?.address ?? '';
  const latitude = Number((property as any).latitude ?? property.location?.latitude ?? 36.7538);
  const longitude = Number((property as any).longitude ?? property.location?.longitude ?? 3.0588);
  const trustStars = (property as any).trustStars ?? property.trustStars ?? 0;
  const isVerified = (property as any).isVerified ?? property.isVerified ?? false;
  const host = (property as any).host ?? null;
  const hostName = host?.firstName ? `${host.firstName} ${host.lastName || ''}`.trim() : property.hostName || 'Host';
  const hostAvatar = host?.avatar ? resolveImageUrl(host.avatar) : property.hostAvatar || '';
  const checkInTime = (property as any).checkInTime ?? '14:00';
  const checkOutTime = (property as any).checkOutTime ?? '11:00';
  const cancellationPolicy = (property as any).cancellationPolicy ?? 'flexible';
  const pricePerWeek = (property as any).pricePerWeek ?? null;
  const pricePerMonth = (property as any).pricePerMonth ?? null;
  const customDiscount = (property as any).customDiscount ?? 0;
  const customDiscountMinNights = (property as any).customDiscountMinNights ?? 0;
  const acceptedPaymentMethods = ((property as any).acceptedPaymentMethods ?? ['hand_to_hand']) as PaymentMethodType[];

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b border-border shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <img
              src={logoImage}
              alt="ByootDZ"
              className="h-7 w-auto cursor-pointer"
              onClick={() => navigate('/')}
            />
          </div>
          <div className="flex items-center gap-2">
            {canEdit && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => navigate(`/properties/${id}/edit`)}
                >
                  <Pencil className="h-4 w-4" />
                  <span className="hidden sm:inline">{t('propertyDetail.edit', 'Edit')}</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => navigate(`/properties/new?duplicateFrom=${id}`)}
                >
                  <Copy className="h-4 w-4" />
                  <span className="hidden sm:inline">{t('propertyDetail.duplicate', 'Duplicate')}</span>
                </Button>
              </>
            )}
            <PropertyShareButton
              propertyId={id!}
              propertyTitle={property.title}
            />
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              onClick={() => setIsFavorite(!isFavorite)}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-destructive text-destructive' : ''}`} />
              <span className="hidden sm:inline">{t('propertyDetail.save')}</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Photo Gallery */}
      <section className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 rounded-2xl overflow-hidden">
          <div
            className="md:col-span-2 md:row-span-2 relative cursor-pointer group"
            onClick={() => { setSelectedImageIndex(0); setIsGalleryOpen(true); }}
          >
            {images[0] ? (
              <BackendImage
                src={images[0]}
                alt={title}
                className="w-full h-64 md:h-full object-cover group-hover:brightness-90 transition-all"
              />
            ) : (
              <div className="w-full h-64 md:h-full bg-muted flex items-center justify-center">
                <span className="text-muted-foreground">{t('common.noImage', 'No image')}</span>
              </div>
            )}
          </div>
          {images.slice(1, 5).map((img, idx) => (
            <div
              key={idx}
              className="hidden md:block relative cursor-pointer group"
              onClick={() => { setSelectedImageIndex(idx + 1); setIsGalleryOpen(true); }}
            >
              <BackendImage
                src={img}
                alt={`${title} ${idx + 2}`}
                className="w-full h-full object-cover group-hover:brightness-90 transition-all"
              />
              {idx === 3 && images.length > 5 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-semibold">
                  +{images.length - 5} {t('propertyDetail.morePhotos')}
                </div>
              )}
            </div>
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          className="mt-4 md:hidden"
          onClick={() => setIsGalleryOpen(true)}
        >
          {t('propertyDetail.viewAllPhotos')} ({images.length})
        </Button>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-24">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Property Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title & Basic Info */}
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-2xl md:text-3xl font-heading font-bold">
                  {title}
                </h1>
                <TrustBadge
                  trustStars={trustStars}
                  isVerified={isVerified}
                  size="lg"
                  showLabel
                />
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-accent text-accent" />
                  <span className="font-semibold text-foreground">{rating}</span>
                  <span>({reviewCount} {t('propertyDetail.reviews')})</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {location}
                </div>
              </div>
            </div>

            <Separator />

            {/* Host Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={hostAvatar} />
                  <AvatarFallback>{hostName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">
                    {t('propertyDetail.hostedBy')} {hostName}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">{maxGuests}</p>
                  <p className="text-xs text-muted-foreground">{t('propertyDetail.guests')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BedDouble className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">{bedrooms}</p>
                  <p className="text-xs text-muted-foreground">{t('propertyDetail.bedrooms')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Bath className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">{bathrooms}</p>
                  <p className="text-xs text-muted-foreground">{t('propertyDetail.bathrooms')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BedDouble className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">{beds}</p>
                  <p className="text-xs text-muted-foreground">{t('propertyDetail.beds', 'Beds')}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h2 className="text-xl font-heading font-semibold mb-4">
                {t('propertyDetail.aboutProperty')}
              </h2>
              <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                {description}
              </p>
            </div>

            <Separator />

            {/* Amenities */}
            <div>
              <h2 className="text-xl font-heading font-semibold mb-4">
                {t('propertyDetail.amenitiesTitle')}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {amenities.map((amenityId) => {
                  const Icon = AMENITY_ICONS[amenityId] || Check;
                  return (
                    <div key={amenityId} className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                      <span>{t(`propertyDetail.amenities.${amenityId}`, amenityId)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <Separator />

            {/* Location */}
            <div>
              <h2 className="text-xl font-heading font-semibold mb-4">
                {t('propertyDetail.locationTitle')}
              </h2>
              <p className="text-muted-foreground mb-4">{address}</p>
              <div className="aspect-video rounded-xl overflow-hidden bg-muted">
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.02}%2C${latitude - 0.01}%2C${longitude + 0.02}%2C${latitude + 0.01}&layer=mapnik&marker=${latitude}%2C${longitude}`}
                />
              </div>
            </div>

            <Separator />

            {/* Reviews */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-heading font-semibold flex items-center gap-2">
                  <Star className="h-5 w-5 fill-accent text-accent" />
                  {rating} · {reviewCount} {t('propertyDetail.reviews')}
                </h2>
                {user && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowReviewForm(!showReviewForm)}
                  >
                    {showReviewForm
                      ? t('common.cancel', 'Cancel')
                      : t('reviews.writeReview', 'Write a Review')}
                  </Button>
                )}
              </div>

              {/* Review Form */}
              {showReviewForm && (
                <div className="mb-8">
                  <ReviewForm
                    propertyId={id!}
                    bookingId=""
                    onSuccess={() => setShowReviewForm(false)}
                    onCancel={() => setShowReviewForm(false)}
                  />
                </div>
              )}

              {reviewsLoading ? (
                <LoadingSpinner size="sm" text={t('common.loading', 'Loading...')} />
              ) : reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={review.guest?.avatar ? resolveImageUrl(review.guest.avatar) : undefined} />
                            <AvatarFallback>
                              {(review.guest?.firstName || review.guest?.email || 'U').charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">
                              {review.guest?.firstName
                                ? `${review.guest.firstName} ${review.guest.lastName || ''}`.trim()
                                : t('reviews.anonymous', 'Guest')}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            {Array.from({ length: review.overallRating }).map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                            ))}
                          </div>
                          {review.hostRating && (
                            <Badge variant="secondary" className="text-[10px]">
                              {t('reviews.host', 'Host')}: {review.hostRating}/5
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-muted-foreground">{review.comment}</p>
                      {review.hostReply && (
                        <div className="ml-8 p-3 bg-muted rounded-lg">
                          <p className="text-xs font-semibold text-foreground mb-1">
                            {t('reviews.hostReply', 'Host Reply')}:
                          </p>
                          <p className="text-sm text-muted-foreground">{review.hostReply}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  {t('reviews.noReviews', 'No reviews yet. Be the first to review!')}
                </p>
              )}
            </div>

            <Separator />

            {/* House Rules */}
            <div>
              <h2 className="text-xl font-heading font-semibold mb-4">
                {t('propertyDetail.houseRules')}
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{t('propertyDetail.checkIn')}</p>
                    <p className="text-sm text-muted-foreground">{checkInTime}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{t('propertyDetail.checkOut')}</p>
                    <p className="text-sm text-muted-foreground">{checkOutTime}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{t('propertyDetail.cancellation')}</p>
                    <p className="text-sm text-muted-foreground capitalize">{cancellationPolicy}</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Pricing Options */}
            <div className="pt-4">
              <PricingBreakdownSection
                pricePerNight={pricePerNight}
                pricePerWeek={pricePerWeek}
                pricePerMonth={pricePerMonth}
                customDiscount={customDiscount}
                customDiscountMinNights={customDiscountMinNights}
                acceptedPaymentMethods={acceptedPaymentMethods}
                currency="DZD"
              />
            </div>
          </div>

          {/* Right Column - Booking Widget */}
          <div className="lg:col-span-1">
            <BookingWidget
              propertyId={String(property.id)}
              pricePerNight={pricePerNight}
              pricePerWeek={pricePerWeek}
              pricePerMonth={pricePerMonth}
              customDiscount={customDiscount}
              customDiscountMinNights={customDiscountMinNights}
              acceptedPaymentMethods={acceptedPaymentMethods}
              maxGuests={maxGuests}
              rating={rating}
              reviewCount={reviewCount}
              allowPets={(property as any).allowPets ?? false}
            />
          </div>
        </div>
      </div>

      {/* Mobile Booking Bar */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-background border-t shadow-lg p-4 z-40">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-primary">
              {pricePerNight.toLocaleString()} DA
            </span>
            <span className="text-muted-foreground text-sm">/{t('byootdz.perNight')}</span>
          </div>
          <Button className="px-8" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            {t('propertyDetail.bookNow')}
          </Button>
        </div>
      </div>

      {/* Gallery Modal */}
      <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
        <DialogContent className="max-w-5xl h-[90vh] p-0 bg-black">
          <div className="relative h-full flex items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/20 z-10"
              onClick={() => setIsGalleryOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 text-white hover:bg-white/20"
              onClick={handlePrevImage}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>

            {images[selectedImageIndex] && (
              <BackendImage
                src={images[selectedImageIndex]}
                alt={`${title} ${selectedImageIndex + 1}`}
                className="max-h-full max-w-full object-contain"
              />
            )}

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 text-white hover:bg-white/20"
              onClick={handleNextImage}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
              {selectedImageIndex + 1} / {images.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PropertyDetail;
