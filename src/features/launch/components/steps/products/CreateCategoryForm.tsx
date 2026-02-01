// -----------------------------------------------------------------------------
// CreateCategoryForm Component
// Form for creating a new product category
// -----------------------------------------------------------------------------

import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FolderPlus, Loader2 } from 'lucide-react';

interface CreateCategoryFormProps {
  onSubmit: (category: {
    name: string;
    description: string;
  }) => void;
  isSubmitting?: boolean;
}

export const CreateCategoryForm: React.FC<CreateCategoryFormProps> = ({
  onSubmit,
  isSubmitting = false
}) => {
  const { formatMessage } = useIntl();
  
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const handleSubmit = () => {
    if (formData.name.trim()) {
      onSubmit(formData);
      setFormData({ name: '', description: '' });
    }
  };

  const isValid = formData.name.trim().length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <FolderPlus className="h-5 w-5 text-primary" />
          <FormattedMessage id="launch.products.createCategory" defaultMessage="Create New Category" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>
            <FormattedMessage id="launch.products.categoryName" defaultMessage="Category Name" /> *
          </Label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder={formatMessage({ id: 'launch.products.categoryNamePlaceholder', defaultMessage: 'Enter category name' })}
          />
        </div>

        <div className="space-y-2">
          <Label>
            <FormattedMessage id="launch.products.categoryDescription" defaultMessage="Description" />
          </Label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder={formatMessage({ id: 'launch.products.categoryDescPlaceholder', defaultMessage: 'Describe the category...' })}
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
              <FolderPlus className="h-4 w-4 mr-2" />
              <FormattedMessage id="launch.products.addCategory" defaultMessage="Add Category" />
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CreateCategoryForm;
