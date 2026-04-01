import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, Users, MapPin } from 'lucide-react';
import { CATEGORY_ICONS } from '../services.constants';
import type { TourismService } from '@/types/tourism-service.types';

const getLocalizedText = (obj: Record<string, string> | string | undefined, lang: string): string => {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  return obj[lang] || obj['fr'] || obj['en'] || Object.values(obj)[0] || '';
};

interface ServiceCardProps {
  service: TourismService;
  lang: string;
  onClick: () => void;
}

export const ServiceCard = memo<ServiceCardProps>(({ service, lang, onClick }) => {
  const { t } = useTranslation();
  const title = getLocalizedText(service.title, lang);
  const image = service.images?.[0];
  const icon = CATEGORY_ICONS[service.category] || '✨';

  return (
    <Card
      className="group cursor-pointer overflow-hidden border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
      onClick={onClick}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">{icon}</div>
        )}
        <div className="absolute top-2 left-2 flex gap-1">
          <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm text-xs">
            {icon} {t(`services.categories.${service.category}`, service.category)}
          </Badge>
        </div>
        {service.isVerified && (
          <Badge className="absolute top-2 right-2 bg-emerald-500/90 text-primary-foreground text-xs">✓ {t('services.verified')}</Badge>
        )}
        {service.instantBooking && (
          <Badge className="absolute bottom-2 right-2 bg-primary/90 text-primary-foreground text-xs">⚡ {t('services.instantBooking')}</Badge>
        )}
      </div>
      <CardContent className="p-4 space-y-2">
        <h3 className="font-semibold text-foreground line-clamp-1 text-base">{title}</h3>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          <span>{service.city}, {service.wilaya}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          {service.duration && (
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {service.duration} {t(`services.durationUnits.${service.durationUnit}`, service.durationUnit)}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {service.maxParticipants}
          </span>
        </div>
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="font-medium text-sm">{service.averageRating}</span>
            <span className="text-xs text-muted-foreground">({service.reviewCount})</span>
          </div>
          <div className="text-right">
            <span className="font-bold text-lg text-foreground">{service.price.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground ml-1">{service.currency}/{t(`services.pricingTypes.${service.pricingType}`)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

ServiceCard.displayName = 'ServiceCard';
