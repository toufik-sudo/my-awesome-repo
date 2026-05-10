import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { propertiesApi } from '@/modules/properties/properties.api';
import PropertyDocumentsManager from './PropertyDocumentsManager';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

/**
 * Wrapper used in the admin/manager dashboard "Documents" tab.
 * Lets the host pick one of their properties and manage its documents.
 */
export const PropertyDocumentsTab: React.FC = () => {
  const [selected, setSelected] = useState<string | null>(null);

  const { data: properties = [], isLoading } = useQuery({
    queryKey: ['my-properties-for-docs'],
    queryFn: async () => {
      const res = await propertiesApi.getAll({ status: 'all', page: 1, limit: 100 } as any);
      return (res?.data ?? res ?? []) as any[];
    },
  });

  if (isLoading) {
    return <div className="flex items-center justify-center h-32"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  if (properties.length === 0) {
    return <Card><CardContent className="py-8 text-center text-sm text-muted-foreground">No properties to manage.</CardContent></Card>;
  }

  const current = selected ?? properties[0]?.id;
  const currentTitle = properties.find(p => p.id === current)?.title;

  return (
    <div className="space-y-4">
      <div className="max-w-md">
        <Select value={current} onValueChange={setSelected}>
          <SelectTrigger><SelectValue placeholder="Select a property" /></SelectTrigger>
          <SelectContent className="bg-popover border border-border">
            {properties.map(p => (
              <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {current && <PropertyDocumentsManager propertyId={current} propertyTitle={currentTitle} />}
    </div>
  );
};

export default PropertyDocumentsTab;
