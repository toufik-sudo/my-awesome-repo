// -----------------------------------------------------------------------------
// Products Page
// Migrated from old_app/src/components/pages/ProductsPage.tsx
// -----------------------------------------------------------------------------

import React from 'react';
import { useIntl } from 'react-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Package, Search, Plus, ArrowRight } from 'lucide-react';

const ProductsPage: React.FC = () => {
  const { formatMessage } = useIntl();

  // Sample products data
  const products = [
    { id: 1, name: 'Gift Card €50', category: 'Gift Cards', points: 5000 },
    { id: 2, name: 'Electronics Voucher', category: 'Electronics', points: 10000 },
    { id: 3, name: 'Travel Experience', category: 'Experiences', points: 25000 },
    { id: 4, name: 'Restaurant Voucher', category: 'Dining', points: 3000 },
  ];

  const handleNext = () => {
    // TODO: Navigate to next step
    console.log('Navigate to next step');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Package className="h-6 w-6 text-primary" />
          {formatMessage({ id: 'launchProgram.title', defaultMessage: 'Launch Program' })}
        </h1>
        <p className="text-muted-foreground">
          {formatMessage({ id: 'launchProgram.products.subtitle', defaultMessage: 'Select products for your rewards catalog' })}
        </p>
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={formatMessage({ id: 'products.search', defaultMessage: 'Search products...' })}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          {formatMessage({ id: 'products.addNew', defaultMessage: 'Add Product' })}
        </Button>
      </div>

      {/* Products Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id} className="cursor-pointer hover:border-primary transition-colors">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <Badge variant="secondary">{product.category}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {formatMessage({ id: 'products.points', defaultMessage: 'Points required' })}
                </span>
                <span className="font-bold text-primary">{product.points.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {products.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <CardTitle className="text-center mb-2">
              {formatMessage({ id: 'products.empty.title', defaultMessage: 'No products yet' })}
            </CardTitle>
            <CardDescription className="text-center mb-4">
              {formatMessage({ id: 'products.empty.description', defaultMessage: 'Add products to your rewards catalog' })}
            </CardDescription>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {formatMessage({ id: 'products.addFirst', defaultMessage: 'Add Your First Product' })}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-center pt-4">
        <Button size="lg" onClick={handleNext}>
          {formatMessage({ id: 'form.submit.next', defaultMessage: 'Next' })}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ProductsPage;
