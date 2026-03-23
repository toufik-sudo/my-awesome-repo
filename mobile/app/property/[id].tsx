import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import PropertyDetailScreen from '@/screens/PropertyDetailScreen';

export default function PropertyDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <PropertyDetailScreen route={{ params: { propertyId: id || '' } } as any} />;
}
