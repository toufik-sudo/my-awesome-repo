// -----------------------------------------------------------------------------
// CreateProductForm Component
// Form for creating a new product
// -----------------------------------------------------------------------------

import React, { useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Upload, Package, Loader2 } from 'lucide-react';

interface CreateProductFormProps {
  categories: Array<{ id: string; name: string }>;
  onSubmit: (product: {
    name: string;
    description: string;
    points: number;
    categoryId: string;
    image: string | null;
  }) => void;
  isSubmitting?: boolean;
}

export const CreateProductForm: React.FC<CreateProductFormProps> = ({
  categories,
  onSubmit,
  isSubmitting = false
}) => {
  const { formatMessage } = useIntl();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    points: 0,
    categoryId: '',
    image: null as string | null
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({ ...prev, image: event.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (formData.name.trim()) {
      onSubmit(formData);
      setFormData({ name: '', description: '', points: 0, categoryId: '', image: null });
    }
  };

  const isValid = formData.name.trim().length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Plus className="h-5 w-5 text-primary" />
          <FormattedMessage id="launch.products.createNew" defaultMessage="Create New Product" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Image Upload */}
          <div
            className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors flex items-center justify-center min-h-[150px]"
            onClick={() => fileInputRef.current?.click()}
            style={formData.image ? { 
              backgroundImage: `url(${formData.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            } : undefined}
          >
            {!formData.image && (
              <div className="space-y-2">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  <FormattedMessage id="launch.products.uploadImage" defaultMessage="Upload image" />
                </p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          <div className="space-y-4">
            {/* Product Name */}
            <div className="space-y-2">
              <Label>
                <FormattedMessage id="launch.products.name" defaultMessage="Product Name" /> *
              </Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder={formatMessage({ id: 'launch.products.namePlaceholder', defaultMessage: 'Enter product name' })}
              />
            </div>

            {/* Points */}
            <div className="space-y-2">
              <Label>
                <FormattedMessage id="launch.products.points" defaultMessage="Points Value" />
              </Label>
              <Input
                type="number"
                value={formData.points || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, points: parseInt(e.target.value) || 0 }))}
                placeholder="0"
              />
            </div>

            {/* Category */}
            {categories.length > 0 && (
              <div className="space-y-2">
                <Label>
                  <FormattedMessage id="launch.products.category" defaultMessage="Category" />
                </Label>
                <Select 
                  value={formData.categoryId} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={formatMessage({ id: 'launch.products.selectCategory', defaultMessage: 'Select category' })} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label>
            <FormattedMessage id="launch.products.description" defaultMessage="Description" />
          </Label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder={formatMessage({ id: 'launch.products.descPlaceholder', defaultMessage: 'Describe the product...' })}
            rows={3}
          />
        </div>

        <Button onClick={handleSubmit} disabled={!isValid || isSubmitting} className="w-full">
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              <FormattedMessage id="common.creating" defaultMessage="Creating..." />
            </>
          ) : (
            <>
              <Package className="h-4 w-4 mr-2" />
              <FormattedMessage id="launch.products.add" defaultMessage="Add Product" />
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CreateProductForm;
