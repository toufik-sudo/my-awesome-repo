// -----------------------------------------------------------------------------
// ECard Grid Component
// Migrated from old_app/src/components/organisms/launch/eCard/eCardContent.tsx
// Displays grid of eCards for selection
// -----------------------------------------------------------------------------

import React from 'react';
import { useIntl } from 'react-intl';
import { CreditCard, Check, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import type { IECardProduct } from '@/api/ECardApi';

interface ECardGridProps {
  cards: IECardProduct[];
  selectedCardIds: number[];
  onCardToggle: (card: IECardProduct) => void;
  isConversion?: boolean;
}

export const ECardGrid: React.FC<ECardGridProps> = ({
  cards,
  selectedCardIds,
  onCardToggle,
  isConversion = false,
}) => {
  const { formatMessage } = useIntl();

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <CreditCard className="h-16 w-16 text-muted-foreground/30 mb-4" />
        <h3 className="text-lg font-medium mb-2">
          {formatMessage({ id: 'eCard.noResults.title', defaultMessage: 'No gift cards found' })}
        </h3>
        <p className="text-muted-foreground max-w-md">
          {formatMessage({ id: 'eCard.noResults.description', defaultMessage: 'Try adjusting your filters or search term to find gift cards.' })}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {cards.map((card) => {
        const isSelected = selectedCardIds.includes(card.ecardId);
        const denominations = card.denominations?.split(',').map((d) => d.trim()).filter(Boolean) || [];

        return (
          <Card
            key={card.ecardId}
            className={cn(
              'cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group relative overflow-hidden border-2',
              isSelected 
                ? 'ring-2 ring-primary border-primary bg-gradient-to-br from-primary/5 to-primary/10 shadow-lg shadow-primary/20' 
                : 'border-border/50 hover:border-primary/50'
            )}
            onClick={() => onCardToggle(card)}
          >
            {/* Selection Indicator */}
            <div
              className={cn(
                'absolute top-3 right-3 z-10 transition-all duration-300 transform',
                isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-75 group-hover:opacity-70 group-hover:scale-100'
              )}
            >
              <div
                className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center shadow-md',
                  isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                )}
              >
                {isSelected && <Check className="h-4 w-4" />}
              </div>
            </div>

            {/* Gradient overlay on hover */}
            <div className={cn(
              'absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 transition-opacity duration-300',
              'group-hover:opacity-100'
            )} />

            <CardHeader className="pb-2 relative">
              {/* Logo */}
              <div className="flex items-start gap-3">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-inner border border-border/50">
                  {card.logoFile ? (
                    <img
                      src={card.logoFile}
                      alt={card.brandName}
                      className="w-full h-full object-contain p-1"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : (
                    <CreditCard className="h-7 w-7 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base truncate group-hover:text-primary transition-colors">{card.brandName}</h3>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <Badge variant="secondary" className="text-xs font-medium bg-secondary/80">
                      {card.countryCode}
                    </Badge>
                    <Badge variant="outline" className="text-xs font-medium">
                      {card.currency}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-2 relative">
              {/* Denominations */}
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                  {denominations.length > 0
                    ? formatMessage({ id: 'eCard.content.denominations', defaultMessage: 'Available amounts' })
                    : formatMessage({ id: 'eCard.content.allDenominations', defaultMessage: 'All amounts available' })}
                </p>
                {denominations.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {denominations.slice(0, 6).map((denom, index) => (
                      <Badge key={index} variant="outline" className="text-xs bg-background/80">
                        €{denom}
                      </Badge>
                    ))}
                    {denominations.length > 6 && (
                      <Badge variant="secondary" className="text-xs">
                        +{denominations.length - 6} more
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              {/* Categories */}
              {card.categories && (
                <div className="mt-3 pt-3 border-t border-border/50">
                  <div className="flex flex-wrap gap-1">
                    {card.categories.split(',').slice(0, 2).map((cat, index) => (
                      <span key={index} className="text-xs text-muted-foreground/80 bg-muted/50 px-2 py-0.5 rounded-full">
                        {cat.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>

            {/* Selection checkbox for accessibility */}
            <div className="sr-only">
              <Checkbox
                checked={isSelected}
                aria-label={`Select ${card.brandName}`}
              />
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default ECardGrid;
