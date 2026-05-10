import React from 'react';
import { useParams } from 'react-router-dom';
import PropertyDocumentsManager from '@/modules/admin/components/PropertyDocumentsManager';

/**
 * Standalone page wrapper to manage documents for a single property.
 * Route: /admin/properties/:id/documents
 */
export const PropertyDocumentsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  if (!id) return null;
  return (
    <div className="space-y-4">
      <PropertyDocumentsManager propertyId={id} />
    </div>
  );
};

export default PropertyDocumentsPage;
