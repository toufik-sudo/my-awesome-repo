import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useServiceDetail } from '@/modules/services/services.hooks';
import { CATEGORY_ICONS } from '@/modules/services/services.constants';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { LoadingSpinner } from '@/modules/shared/components/LoadingSpinner';
import {
  ArrowLeft, Star, MapPin, Clock, Users, ChevronLeft, ChevronRight,
  X, Calendar, Check, Copy, Share2, Heart, Globe, Shield,
} from 'lucide-react';

const getLocalizedText = (obj: Record<string, string> | string | undefined, lang: string): string => {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  return obj[lang] || obj['fr'] || obj['en'] || Object.values(obj)[0] || '';
};

const getLocalizedList = (obj: Record<string, string[]> | undefined, lang: string): string[] => {
  if (!obj) return [];
  return obj[lang] || obj['fr'] || obj['en'] || Object.values(obj)[0] || [];
};

const ServiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.split('-')[0] || 'fr';
  const { data: service, isLoading } = useServiceDetail(id || '');

  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  if (isLoading) return <LoadingSpinner />;
  if (!service) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-lg text-muted-foreground">Service not found</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/services')}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to services
        </Button>
      </div>
    );
  }

  const title = getLocalizedText(service.title, lang);
  const description = getLocalizedText(service.description, lang);
  const includes = getLocalizedList(service.includes, lang);
  const requirements = getLocalizedList(service.requirements, lang);
  const images = service.images || [];
  const icon = CATEGORY_ICONS[service.category] || '✨';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border/50 shadow-sm">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-bold text-foreground truncate max-w-[300px]">{title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon"><Share2 className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon"><Heart className="h-4 w-4" /></Button>
            <Button variant="outline" size="sm" onClick={() => navigate(`/services/new?duplicateFrom=${id}`)}>
              <Copy className="h-4 w-4 mr-1" /> Duplicate
            </Button>
          </div>
        </div>
      </header>

      {/* Photo Gallery */}
      {images.length > 0 && (
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-4 gap-2 rounded-xl overflow-hidden max-h-[400px]">
            <div
              className="col-span-2 row-span-2 cursor-pointer relative group"
              onClick={() => { setGalleryIndex(0); setGalleryOpen(true); }}
            >
              <img src={images[0]} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            {images.slice(1, 5).map((img, i) => (
              <div
                key={i}
                className="cursor-pointer relative group aspect-[4/3]"
                onClick={() => { setGalleryIndex(i + 1); setGalleryOpen(true); }}
              >
                <img src={img} alt={`${title} ${i + 2}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                {i === 3 && images.length > 5 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-lg">
                    +{images.length - 5}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & meta */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary">{icon} {t(`services.categories.${service.category}`, service.category)}</Badge>
                {service.isVerified && <Badge className="bg-emerald-500/90 text-primary-foreground">✓ Verified</Badge>}
                {service.instantBooking && <Badge className="bg-primary text-primary-foreground">⚡ Instant Booking</Badge>}
              </div>
              <h2 className="text-3xl font-bold text-foreground">{title}</h2>
              <div className="flex items-center gap-4 flex-wrap text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {service.city}, {service.wilaya}</span>
                {service.duration && (
                  <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {service.duration} {service.durationUnit}</span>
                )}
                <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {service.minParticipants}-{service.maxParticipants} participants</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                <span className="font-bold text-lg">{service.averageRating}</span>
                <span className="text-muted-foreground">({service.reviewCount} reviews)</span>
                <span className="text-muted-foreground">· {service.bookingCount} bookings</span>
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h3 className="text-xl font-semibold mb-3">Description</h3>
              <p className="text-muted-foreground whitespace-pre-line leading-relaxed">{description}</p>
            </div>

            {/* What's included */}
            {includes.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="text-xl font-semibold mb-3">What's Included</h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {includes.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-muted-foreground">
                        <Check className="h-4 w-4 text-primary" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {/* Requirements */}
            {requirements.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="text-xl font-semibold mb-3">Requirements</h3>
                  <ul className="space-y-1">
                    {requirements.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-muted-foreground">
                        <Shield className="h-4 w-4 text-amber-500" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {/* Schedule */}
            {service.schedule && (
              <>
                <Separator />
                <div>
                  <h3 className="text-xl font-semibold mb-3">Schedule</h3>
                  <div className="text-muted-foreground">
                    {service.schedule.days && (
                      <p><strong>Days:</strong> {(service.schedule.days as string[]).join(', ')}</p>
                    )}
                    {service.schedule.startTime && (
                      <p><strong>Time:</strong> {service.schedule.startTime} - {service.schedule.endTime}</p>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Languages */}
            {service.languages && service.languages.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="text-xl font-semibold mb-3">Languages</h3>
                  <div className="flex gap-2 flex-wrap">
                    {service.languages.map(l => (
                      <Badge key={l} variant="outline"><Globe className="h-3 w-3 mr-1" /> {l}</Badge>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Tags */}
            {service.tags && service.tags.length > 0 && (
              <div className="flex gap-2 flex-wrap pt-2">
                {service.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                ))}
              </div>
            )}
          </div>

          {/* Right: Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20 shadow-lg border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-3xl font-bold text-foreground">{Number(service.price).toLocaleString()}</span>
                    <span className="text-muted-foreground ml-1">{service.currency}/{t(`services.pricingTypes.${service.pricingType}`, service.pricingType)}</span>
                  </div>
                </div>
                {service.priceChild && (
                  <p className="text-sm text-muted-foreground">Children: {Number(service.priceChild).toLocaleString()} {service.currency}</p>
                )}
                {service.groupDiscount && Number(service.groupDiscount) > 0 && (
                  <Badge variant="secondary" className="w-fit">Group discount: {service.groupDiscount}%</Badge>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Duration</span>
                    <span className="font-medium text-foreground">{service.duration} {service.durationUnit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Participants</span>
                    <span className="font-medium text-foreground">{service.minParticipants} - {service.maxParticipants}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Min Age</span>
                    <span className="font-medium text-foreground">{service.minAge}+</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cancellation</span>
                    <span className="font-medium text-foreground capitalize">{service.cancellationPolicy}</span>
                  </div>
                </div>
                <Separator />
                <Button className="w-full" size="lg">
                  <Calendar className="h-4 w-4 mr-2" />
                  {service.instantBooking ? 'Book Now' : 'Request Booking'}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  {service.instantBooking ? 'Instant confirmation' : 'Host will review your request'}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Gallery Dialog */}
      <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}>
        <DialogContent className="max-w-4xl p-0 bg-black border-none">
          <div className="relative">
            <Button
              variant="ghost" size="icon"
              className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
              onClick={() => setGalleryOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
            <img
              src={images[galleryIndex]}
              alt={`${title} ${galleryIndex + 1}`}
              className="w-full max-h-[80vh] object-contain"
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
              {galleryIndex + 1} / {images.length}
            </div>
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost" size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                  onClick={() => setGalleryIndex(i => (i - 1 + images.length) % images.length)}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost" size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                  onClick={() => setGalleryIndex(i => (i + 1) % images.length)}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServiceDetail;
