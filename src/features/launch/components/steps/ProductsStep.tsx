// -----------------------------------------------------------------------------
// ProductsStep Component
// Products configuration step: Add products and categories to the program
// Integrated with Redux store and Categories API
// -----------------------------------------------------------------------------

import React, { useState, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Package,
  FolderTree,
  Plus,
  Search,
  Upload,
  Trash2,
  Check,
  Image as ImageIcon,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLaunchWizard } from '../../hooks/useLaunchWizard';
import { useCategories } from '@/api/hooks/useLaunchApi';
import {
  PROGRAM_PRODUCTS,
  PROGRAM_CATEGORIES,
  FULL_PRODUCTS,
  FULL_CATEGORIES_PRODUCTS
} from '@/constants/wall/launch';

interface Product {
  id: string;
  name: string;
  description?: string;
  image?: string;
  points?: number;
  category?: string;
}

interface Category {
  id: string;
  name: string;
  description?: string;
  productsCount?: number;
}

const ProductsStep: React.FC = () => {
  const { formatMessage } = useIntl();
  const { updateStepData, launchData } = useLaunchWizard();

  const platformId = (launchData.platform as { id?: number })?.id || (launchData.platformId as number);

  // Fetch categories from API
  const { data: categoriesData, isLoading: categoriesLoading, error: categoriesError } = useCategories({
    platform: platformId,
    size: 50,
    offset: 0
  });

  const [activeTab, setActiveTab] = useState('existing');
  const [searchQuery, setSearchQuery] = useState('');

  // Get selected products/categories from store
  const selectedProductIds = (launchData[PROGRAM_PRODUCTS] as string[]) || [];
  const selectedCategoryIds = (launchData[PROGRAM_CATEGORIES] as string[]) || [];
  const fullProducts = (launchData[FULL_PRODUCTS] as Product[]) || [];
  const fullCategories = (launchData[FULL_CATEGORIES_PRODUCTS] as Category[]) || [];

  // New product form state
  const [newProduct, setNewProduct] = useState < Partial < Product >> ({
    name: '',
    description: '',
    points: 0,
  });

  // Parse API categories
  const apiCategories: Category[] = (categoriesData?.entries || []).map((cat: any) => ({
    id: cat.id?.toString() || cat.categoryId?.toString(),
    name: cat.name || cat.categoryName,
    description: cat.description,
    productsCount: cat.productsCount || 0
  }));

  // Get products from selected categories (mock for now, would come from API)
  const availableProducts: Product[] = [
    { id: '1', name: 'Gift Card $50', description: 'Amazon gift card', points: 500, category: 'Gift Cards' },
    { id: '2', name: 'Gift Card $100', description: 'Amazon gift card', points: 1000, category: 'Gift Cards' },
    { id: '3', name: 'Premium Headphones', description: 'Wireless noise-canceling', points: 2500, category: 'Electronics' },
    { id: '4', name: 'Smart Watch', description: 'Fitness tracker watch', points: 3000, category: 'Electronics' },
    { id: '5', name: 'Extra PTO Day', description: 'One additional paid day off', points: 5000, category: 'Benefits' },
  ];

  const filteredProducts = availableProducts.filter(product =>
    (!searchQuery || searchQuery == "") || product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCategories = apiCategories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedProducts = availableProducts.filter(p => selectedProductIds.includes(p.id));
  const selectedCategories = apiCategories.filter(c => selectedCategoryIds.includes(c.id));

  const toggleProduct = (product: Product) => {
    const exists = selectedProductIds.includes(product.id);
    const newIds = exists
      ? selectedProductIds.filter(id => id !== product.id)
      : [...selectedProductIds, product.id];

    updateStepData(PROGRAM_PRODUCTS, newIds);

    // Also update full products array for display
    const newFullProducts = exists
      ? fullProducts.filter(p => p.id !== product.id)
      : [...fullProducts, product];
    updateStepData(FULL_PRODUCTS, newFullProducts);
  };

  const toggleCategory = (category: Category) => {
    const exists = selectedCategoryIds.includes(category.id);
    const newIds = exists
      ? selectedCategoryIds.filter(id => id !== category.id)
      : [...selectedCategoryIds, category.id];

    updateStepData(PROGRAM_CATEGORIES, newIds);

    // Also update full categories array for display
    const newFullCategories = exists
      ? fullCategories.filter(c => c.id !== category.id)
      : [...fullCategories, category];
    updateStepData(FULL_CATEGORIES_PRODUCTS, newFullCategories);
  };

  const handleAddNewProduct = () => {
    if (newProduct.name) {
      const product: Product = {
        id: `new-${Date.now()}`,
        name: newProduct.name,
        description: newProduct.description,
        points: newProduct.points,
      };

      updateStepData(PROGRAM_PRODUCTS, [...selectedProductIds, product.id]);
      updateStepData(FULL_PRODUCTS, [...fullProducts, product]);
      setNewProduct({ name: '', description: '', points: 0 });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">
          <FormattedMessage
            id="launch.step.products.title"
            defaultMessage="Configure Products"
          />
        </h2>
        <p className="text-muted-foreground">
          <FormattedMessage
            id="launch.step.products.description"
            defaultMessage="Add products and categories that users can redeem with their points"
          />
        </p>
      </div>

      {/* Selected items summary */}
      {(selectedProducts.length > 0 || selectedCategories.length > 0) && (
        <div className="flex flex-wrap gap-2 p-4 bg-muted/50 rounded-lg">
          {selectedProducts.map(product => (
            <Badge key={product.id} variant="secondary" className="gap-1">
              <Package className="h-3 w-3" />
              {product.name}
              <button
                onClick={() => toggleProduct(product)}
                className="ml-1 hover:text-destructive"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {selectedCategories.map(category => (
            <Badge key={category.id} variant="outline" className="gap-1">
              <FolderTree className="h-3 w-3" />
              {category.name}
              <button
                onClick={() => toggleCategory(category)}
                className="ml-1 hover:text-destructive"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="existing" className="gap-2">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">
              <FormattedMessage id="launch.products.existing" defaultMessage="Products" />
            </span>
          </TabsTrigger>
          <TabsTrigger value="new" className="gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">
              <FormattedMessage id="launch.products.new" defaultMessage="New" />
            </span>
          </TabsTrigger>
          <TabsTrigger value="categories" className="gap-2">
            <FolderTree className="h-4 w-4" />
            <span className="hidden sm:inline">
              <FormattedMessage id="launch.products.categories" defaultMessage="Categories" />
            </span>
          </TabsTrigger>
          <TabsTrigger value="import" className="gap-2">
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline">
              <FormattedMessage id="launch.products.import" defaultMessage="Import" />
            </span>
          </TabsTrigger>
        </TabsList>

        {/* Existing Products */}
        <TabsContent value="existing" className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={formatMessage({ id: 'launch.products.search', defaultMessage: 'Search products...' })}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <ScrollArea className="h-[300px]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredProducts.map(product => {
                const isSelected = selectedProductIds.includes(product.id);
                return (
                  <Card
                    key={product.id}
                    className={cn(
                      'cursor-pointer transition-all hover:shadow-md',
                      isSelected && 'border-primary bg-primary/5'
                    )}
                    onClick={() => toggleProduct(product)}
                  >
                    <CardHeader className="flex flex-row items-center gap-3 py-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded bg-muted">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="h-8 w-8 object-contain" />
                        ) : (
                          <Package className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-sm truncate">{product.name}</CardTitle>
                        <CardDescription className="text-xs truncate">
                          {product.points} points • {product.category}
                        </CardDescription>
                      </div>
                      {isSelected && (
                        <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                          <Check className="h-3 w-3 text-primary-foreground" />
                        </div>
                      )}
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* New Product */}
        <TabsContent value="new" className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label>
                  <FormattedMessage id="launch.products.name" defaultMessage="Product Name" />
                </Label>
                <Input
                  value={newProduct.name}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                  placeholder={formatMessage({ id: 'launch.products.namePlaceholder', defaultMessage: 'Enter product name' })}
                />
              </div>

              <div className="space-y-2">
                <Label>
                  <FormattedMessage id="launch.products.description" defaultMessage="Description" />
                </Label>
                <Input
                  value={newProduct.description}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                  placeholder={formatMessage({ id: 'launch.products.descriptionPlaceholder', defaultMessage: 'Describe your product' })}
                />
              </div>

              <div className="space-y-2">
                <Label>
                  <FormattedMessage id="launch.products.points" defaultMessage="Points Value" />
                </Label>
                <Input
                  type="number"
                  value={newProduct.points}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, points: parseInt(e.target.value) || 0 }))}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label>
                  <FormattedMessage id="launch.products.image" defaultMessage="Product Image" />
                </Label>
                <div className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors">
                  <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mt-2">
                    <FormattedMessage id="launch.products.uploadImage" defaultMessage="Click to upload image" />
                  </p>
                </div>
              </div>

              <Button onClick={handleAddNewProduct} disabled={!newProduct.name} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                <FormattedMessage id="launch.products.add" defaultMessage="Add Product" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories */}
        <TabsContent value="categories" className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={formatMessage({ id: 'launch.categories.search', defaultMessage: 'Search categories...' })}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <ScrollArea className="h-[300px]">
            {categoriesLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardHeader className="py-3">
                      <Skeleton className="h-10 w-full" />
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : categoriesError ? (
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                <AlertCircle className="h-5 w-5 mr-2" />
                <FormattedMessage id="launch.categories.error" defaultMessage="Failed to load categories" />
              </div>
            ) : filteredCategories.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                <FormattedMessage id="launch.categories.empty" defaultMessage="No categories found" />
              </div>
            ) : (
              <div className="space-y-3">
                {filteredCategories.map(category => {
                  const isSelected = selectedCategoryIds.includes(category.id);
                  return (
                    <Card
                      key={category.id}
                      className={cn(
                        'cursor-pointer transition-all hover:shadow-md',
                        isSelected && 'border-primary bg-primary/5'
                      )}
                      onClick={() => toggleCategory(category)}
                    >
                      <CardHeader className="flex flex-row items-center gap-3 py-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded bg-muted">
                          <FolderTree className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-sm">{category.name}</CardTitle>
                          <CardDescription className="text-xs">
                            {category.description} {category.productsCount && `• ${category.productsCount} products`}
                          </CardDescription>
                        </div>
                        {isSelected && (
                          <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                            <Check className="h-3 w-3 text-primary-foreground" />
                          </div>
                        )}
                      </CardHeader>
                    </Card>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </TabsContent>

        {/* Import */}
        <TabsContent value="import" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer hover:border-primary/50 transition-colors">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">
                  <FormattedMessage id="launch.products.importTitle" defaultMessage="Import Products" />
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                  <FormattedMessage
                    id="launch.products.importDescription"
                    defaultMessage="Upload a CSV or Excel file with your product catalog"
                  />
                </p>
                <Button variant="outline" className="mt-4">
                  <FormattedMessage id="launch.products.selectFile" defaultMessage="Select File" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export { ProductsStep };
export default ProductsStep;
