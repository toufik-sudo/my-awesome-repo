import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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

// Mock property data - will be replaced with API call
const MOCK_PROPERTY = {
  id: '1',
  title: 'Villa Vue Mer avec Piscine Privée',
  description: `Magnifique villa moderne située sur les hauteurs de Tipaza avec une vue imprenable sur la mer Méditerranée. Cette propriété d'exception offre un cadre idyllique pour des vacances en famille ou entre amis.

La villa dispose de grands espaces de vie lumineux, d'une cuisine entièrement équipée et d'une terrasse panoramique parfaite pour admirer les couchers de soleil. La piscine privée et le jardin paysager complètent cette propriété de rêve.

À seulement 10 minutes en voiture des plages et du centre-ville, vous pourrez profiter à la fois du calme de la campagne et de la proximité des commodités.`,
  location: 'Tipaza, Algeria',
  address: '23 Rue des Oliviers, Tipaza 42000',
  price: 15000,
  pricing: {
    pricePerWeek: 90000, // 15000 * 7 = 105000 -> 90000 is ~14% off
    pricePerMonth: 350000, // 15000 * 30 = 450000 -> 350000 is ~22% off
    customDiscount: 10,
    customDiscountMinNights: 10,
    acceptedPaymentMethods: ['visa_master', 'dahabia', 'postal_bank_transfer', 'hand_to_hand'] as PaymentMethodType[],
  },
  rating: 4.9,
  reviewCount: 127,
  maxGuests: 8,
  bedrooms: 4,
  beds: 5,
  bathrooms: 3,
  area: 280,
  images: [
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop',
  ],
  amenities: [
    { id: 'wifi', icon: Wifi, label: 'propertyDetail.amenities.wifi' },
    { id: 'parking', icon: Car, label: 'propertyDetail.amenities.parking' },
    { id: 'ac', icon: Wind, label: 'propertyDetail.amenities.ac' },
    { id: 'tv', icon: Tv, label: 'propertyDetail.amenities.tv' },
    { id: 'kitchen', icon: UtensilsCrossed, label: 'propertyDetail.amenities.kitchen' },
    { id: 'washer', icon: WashingMachine, label: 'propertyDetail.amenities.washer' },
    { id: 'security', icon: Shield, label: 'propertyDetail.amenities.security' },
    { id: 'pool', icon: Waves, label: 'propertyDetail.amenities.pool' },
    { id: 'garden', icon: Mountain, label: 'propertyDetail.amenities.garden' },
    { id: 'breakfast', icon: Coffee, label: 'propertyDetail.amenities.breakfast' },
  ],
  host: {
    id: 'h1',
    name: 'Karim B.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop',
    isSuperhost: true,
    joinedYear: 2019,
    responseRate: 98,
    responseTime: '1 hour',
  },
  reviews: [
    {
      id: 'r1',
      author: 'Sarah M.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop',
      rating: 5,
      date: '2024-01-15',
      comment: 'Séjour exceptionnel! La villa est encore plus belle en vrai. Karim est un hôte très attentionné. Je recommande vivement!',
    },
    {
      id: 'r2',
      author: 'Mohamed A.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop',
      rating: 5,
      date: '2024-01-08',
      comment: 'Vue magnifique, piscine parfaite, tout était impeccable. Nous reviendrons certainement!',
    },
    {
      id: 'r3',
      author: 'Amina K.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop',
      rating: 4,
      date: '2023-12-20',
      comment: 'Très belle propriété, bien équipée. Petit bémol sur la route d\'accès un peu difficile mais ça vaut le détour!',
    },
  ],
  coordinates: { lat: 36.5944, lng: 2.4508 },
  policies: {
    checkIn: '15:00',
    checkOut: '11:00',
    cancellation: 'flexible',
  },
  verification: {
    trustStars: 5,
    isVerified: true,
  },
};

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const canEdit = user?.roles?.some((r: string) => ['admin', 'manager', 'hyper_manager', 'hyper_admin'].includes(r));
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const property = MOCK_PROPERTY; // Will be fetched by ID

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
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
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => navigate(`/properties/${id}/edit`)}
              >
                <Pencil className="h-4 w-4" />
                <span className="hidden sm:inline">{t('propertyDetail.edit', 'Edit')}</span>
              </Button>
            )}
            <Button variant="ghost" size="sm" className="gap-2">
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">{t('propertyDetail.share')}</span>
            </Button>
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
            <img 
              src={property.images[0]} 
              alt={property.title}
              className="w-full h-64 md:h-full object-cover group-hover:brightness-90 transition-all"
            />
          </div>
          {property.images.slice(1, 5).map((img, idx) => (
            <div 
              key={idx}
              className="hidden md:block relative cursor-pointer group"
              onClick={() => { setSelectedImageIndex(idx + 1); setIsGalleryOpen(true); }}
            >
              <img 
                src={img} 
                alt={`${property.title} ${idx + 2}`}
                className="w-full h-full object-cover group-hover:brightness-90 transition-all"
              />
              {idx === 3 && property.images.length > 5 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-semibold">
                  +{property.images.length - 5} {t('propertyDetail.morePhotos')}
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
          {t('propertyDetail.viewAllPhotos')} ({property.images.length})
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
                  {property.title}
                </h1>
                {property.verification && (
                  <TrustBadge 
                    trustStars={property.verification.trustStars} 
                    isVerified={property.verification.isVerified} 
                    size="lg" 
                    showLabel 
                  />
                )}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-accent text-accent" />
                  <span className="font-semibold text-foreground">{property.rating}</span>
                  <span>({property.reviewCount} {t('propertyDetail.reviews')})</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {property.location}
                </div>
              </div>
            </div>

            <Separator />

            {/* Host Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={property.host.avatar} />
                  <AvatarFallback>{property.host.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">
                    {t('propertyDetail.hostedBy')} {property.host.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t('propertyDetail.hostSince')} {property.host.joinedYear}
                  </p>
                </div>
              </div>
              {property.host.isSuperhost && (
                <Badge variant="secondary" className="gap-1">
                  <Shield className="h-3 w-3" />
                  {t('byootdz.badges.superhost')}
                </Badge>
              )}
            </div>

            <Separator />

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">{property.maxGuests}</p>
                  <p className="text-xs text-muted-foreground">{t('propertyDetail.guests')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BedDouble className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">{property.bedrooms}</p>
                  <p className="text-xs text-muted-foreground">{t('propertyDetail.bedrooms')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Bath className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">{property.bathrooms}</p>
                  <p className="text-xs text-muted-foreground">{t('propertyDetail.bathrooms')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Maximize className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">{property.area}m²</p>
                  <p className="text-xs text-muted-foreground">{t('propertyDetail.area')}</p>
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
                {property.description}
              </p>
            </div>

            <Separator />

            {/* Amenities */}
            <div>
              <h2 className="text-xl font-heading font-semibold mb-4">
                {t('propertyDetail.amenitiesTitle')}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.amenities.map((amenity) => {
                  const Icon = amenity.icon;
                  return (
                    <div key={amenity.id} className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                      <span>{t(amenity.label)}</span>
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
              <p className="text-muted-foreground mb-4">{property.address}</p>
              <div className="aspect-video rounded-xl overflow-hidden bg-muted">
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${property.coordinates.lng - 0.02}%2C${property.coordinates.lat - 0.01}%2C${property.coordinates.lng + 0.02}%2C${property.coordinates.lat + 0.01}&layer=mapnik&marker=${property.coordinates.lat}%2C${property.coordinates.lng}`}
                />
              </div>
            </div>

            <Separator />

            {/* Reviews */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-heading font-semibold flex items-center gap-2">
                  <Star className="h-5 w-5 fill-accent text-accent" />
                  {property.rating} · {property.reviewCount} {t('propertyDetail.reviews')}
                </h2>
              </div>
              
              <div className="space-y-6">
                {property.reviews.map((review) => (
                  <div key={review.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={review.avatar} />
                          <AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{review.author}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(review.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                        ))}
                      </div>
                    </div>
                    <p className="text-muted-foreground">{review.comment}</p>
                  </div>
                ))}
              </div>
              
              <Button variant="outline" className="w-full mt-6">
                {t('propertyDetail.showAllReviews')} ({property.reviewCount})
              </Button>
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
                    <p className="text-sm text-muted-foreground">{property.policies.checkIn}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{t('propertyDetail.checkOut')}</p>
                    <p className="text-sm text-muted-foreground">{property.policies.checkOut}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{t('propertyDetail.cancellation')}</p>
                    <p className="text-sm text-muted-foreground capitalize">{property.policies.cancellation}</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Pricing Options */}
            <div className="pt-4">
              <PricingBreakdownSection 
                pricePerNight={property.price}
                pricePerWeek={property.pricing.pricePerWeek}
                pricePerMonth={property.pricing.pricePerMonth}
                customDiscount={property.pricing.customDiscount}
                customDiscountMinNights={property.pricing.customDiscountMinNights}
                acceptedPaymentMethods={property.pricing.acceptedPaymentMethods}
                currency="DZD"
              />
            </div>
          </div>

          {/* Right Column - Booking Widget */}
          <div className="lg:col-span-1">
            <BookingWidget
              propertyId={property.id}
              pricePerNight={property.price}
              pricePerWeek={property.pricing.pricePerWeek}
              pricePerMonth={property.pricing.pricePerMonth}
              customDiscount={property.pricing.customDiscount}
              customDiscountMinNights={property.pricing.customDiscountMinNights}
              acceptedPaymentMethods={property.pricing.acceptedPaymentMethods}
              maxGuests={property.maxGuests}
              rating={property.rating}
              reviewCount={property.reviewCount}
            />
          </div>
        </div>
      </div>

      {/* Mobile Booking Bar */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-background border-t shadow-lg p-4 z-40">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-primary">
              {property.price.toLocaleString()} DA
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
            
            <img
              src={property.images[selectedImageIndex]}
              alt={`${property.title} ${selectedImageIndex + 1}`}
              className="max-h-full max-w-full object-contain"
            />
            
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 text-white hover:bg-white/20"
              onClick={handleNextImage}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
            
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
              {selectedImageIndex + 1} / {property.images.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PropertyDetail;
