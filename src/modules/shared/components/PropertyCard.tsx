import React from 'react';
import { Property } from '@/types/property.types';
import { Star, Users, Bed, Bath } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { TrustBadge } from '@/modules/shared/components/TrustBadge';

interface PropertyCardProps {
  property: Property;
  onSelect?: (property: Property) => void;
  compact?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ 
  property, 
  onSelect,
  compact = false 
}) => {
  const handleClick = () => {
    if (onSelect) {
      onSelect(property);
    }
  };

  const hasTrust = typeof property.trustStars === 'number' && property.trustStars > 0;

  if (compact) {
    return (
      <div 
        className="cursor-pointer hover:opacity-90 transition-base"
        onClick={handleClick}
      >
        <div className="flex gap-3">
          <div className="relative">
            <img 
              src={property.images[0]} 
              alt={property.title}
              className="w-20 h-20 rounded-lg object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h4 className="font-semibold text-sm truncate text-foreground">{property.title}</h4>
              {hasTrust && (
                <TrustBadge trustStars={property.trustStars!} isVerified={property.isVerified ?? false} size="sm" showLabel={false} />
              )}
            </div>
            <p className="text-xs text-muted-foreground truncate">{property.location.city}</p>
            <div className="flex items-center gap-1 mt-1">
              {property.rating && (
                <>
                  <Star className="h-3 w-3 fill-accent text-accent" />
                  <span className="text-xs font-medium text-foreground">{property.rating}</span>
                </>
              )}
              <span className="text-xs text-muted-foreground ml-auto font-semibold">
                {property.currency}{property.price}/night
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card 
      className="overflow-hidden cursor-pointer hover:shadow-custom-lg transition-slow border-border bg-card"
      onClick={handleClick}
    >
      <div className="relative">
        <img 
          src={property.images[0]} 
          alt={property.title}
          className="w-full h-48 object-cover"
        />
        {property.rating && (
          <div className="absolute top-3 right-3 bg-card/95 px-2 py-1 rounded-lg flex items-center gap-1 shadow-custom">
            <Star className="h-3 w-3 fill-accent text-accent" />
            <span className="text-xs font-medium text-foreground">{property.rating}</span>
          </div>
        )}
        {/* Trust badge overlay */}
        {hasTrust && (
          <div className="absolute top-3 left-3">
            <TrustBadge 
              trustStars={property.trustStars!} 
              isVerified={property.isVerified ?? false} 
              size="sm" 
              showLabel={false}
              className="shadow-custom bg-card/95 backdrop-blur-sm"
            />
          </div>
        )}
      </div>
      
      <div className="p-4 space-y-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-heading font-semibold text-base text-foreground truncate">
              {property.title}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground">{property.location.city}, {property.location.country}</p>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{property.guests}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bed className="h-4 w-4" />
            <span>{property.bedrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="h-4 w-4" />
            <span>{property.bathrooms}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div>
            <span className="text-lg font-bold text-foreground">
              {property.currency}{property.price}
            </span>
            <span className="text-sm text-muted-foreground ml-1">/night</span>
          </div>
          <div className="flex items-center gap-2">
            {hasTrust && (
              <TrustBadge 
                trustStars={property.trustStars!} 
                isVerified={property.isVerified ?? false} 
                size="sm" 
                showLabel
              />
            )}
            {property.reviewCount && !hasTrust && (
              <span className="text-xs text-muted-foreground">
                {property.reviewCount} reviews
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
