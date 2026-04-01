import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, Star, Eye, Calendar, Users, BedDouble,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { TrustBadge } from '@/modules/shared/components/TrustBadge';
import type { DashboardProperty } from '../dashboard.types';

interface PropertyDetailModalProps {
  property: DashboardProperty | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  open,
  onOpenChange,
}) => {
  const navigate = useNavigate();

  if (!property) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BedDouble className="h-5 w-5 text-primary" />
            Détails de la propriété
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Image */}
          {property.image && (
            <div className="relative rounded-lg overflow-hidden">
              <img
                src={property.image}
                alt={property.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 left-2">
                <TrustBadge
                  trustStars={property.trustStars}
                  isVerified={property.isVerified}
                  size="sm"
                  showLabel={false}
                  className="bg-card/95 backdrop-blur-sm shadow-sm"
                />
              </div>
            </div>
          )}

          {/* Info */}
          <div>
            <h3 className="font-semibold text-lg text-foreground">{property.title}</h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <MapPin className="h-3.5 w-3.5" />
              {property.location}
            </p>
          </div>

          <Separator />

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-2 rounded-lg bg-muted/50">
              <Star className="h-4 w-4 text-accent mx-auto mb-1" />
              <p className="text-sm font-bold">{property.rating}</p>
              <p className="text-[10px] text-muted-foreground">{property.reviewCount} avis</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-muted/50">
              <Calendar className="h-4 w-4 text-primary mx-auto mb-1" />
              <p className="text-sm font-bold">{property.bookingCount}</p>
              <p className="text-[10px] text-muted-foreground">réservations</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-muted/50">
              <Users className="h-4 w-4 text-secondary mx-auto mb-1" />
              <p className="text-sm font-bold">{property.price.toLocaleString()}</p>
              <p className="text-[10px] text-muted-foreground">DA/nuit</p>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Statut</span>
            <Badge variant={property.status === 'published' ? 'secondary' : 'outline'}>
              {property.status === 'published' ? 'Publié' : property.status}
            </Badge>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
          <Button
            onClick={() => {
              onOpenChange(false);
              navigate(`/property/${property.id}`);
            }}
            className="gap-1.5"
          >
            <Eye className="h-4 w-4" />
            Voir la page
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
