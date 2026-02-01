// -----------------------------------------------------------------------------
// CategoryCard Component
// Individual category display card with selection
// -----------------------------------------------------------------------------

import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FolderTree, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CategoryData {
  id: string;
  name: string;
  description?: string;
  productsCount?: number;
  image?: string;
}

interface CategoryCardProps {
  category: CategoryData;
  isSelected: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  isSelected,
  onToggle,
  disabled = false
}) => {
  return (
    <Card
      className={cn(
        'cursor-pointer transition-all hover:shadow-md',
        isSelected && 'border-primary bg-primary/5',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
      onClick={() => !disabled && onToggle()}
    >
      <CardHeader className="flex flex-row items-center gap-3 py-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
          <FolderTree className="h-6 w-6 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <CardTitle className="text-sm flex items-center gap-2">
            {category.name}
            {category.productsCount !== undefined && (
              <Badge variant="outline" className="font-normal">
                {category.productsCount} products
              </Badge>
            )}
          </CardTitle>
          {category.description && (
            <CardDescription className="text-xs truncate mt-1">
              {category.description}
            </CardDescription>
          )}
        </div>
        {isSelected && (
          <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
            <Check className="h-4 w-4 text-primary-foreground" />
          </div>
        )}
      </CardHeader>
    </Card>
  );
};

export default CategoryCard;
