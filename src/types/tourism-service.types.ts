export type ServiceCategory =
  | 'restaurant'
  | 'walking_tour'
  | 'cycling_tour'
  | 'car_tour'
  | 'bus_tour'
  | 'horse_tour'
  | 'boat_tour'
  | 'beauty_salon'
  | 'massage'
  | 'hammam'
  | 'tourist_guide'
  | 'photography'
  | 'park_visit'
  | 'beach_visit'
  | 'nature_excursion'
  | 'regional_event'
  | 'cooking_class'
  | 'art_class'
  | 'drawing_class'
  | 'sport_activity'
  | 'spa'
  | 'shopping_tour'
  | 'cultural_visit'
  | 'nightlife'
  | 'silver_jewelry'
  | 'gold_jewelry'
  | 'traditional_jewelry'
  | 'pottery'
  | 'leather_craft'
  | 'carpet_weaving'
  | 'woodwork'
  | 'calligraphy'
  | 'henna_art'
  | 'other';

export type PricingType = 'per_person' | 'per_group' | 'per_hour' | 'fixed';
export type DurationUnit = 'minutes' | 'hours' | 'days';

export interface TourismService {
  id: string;
  providerId: number;
  title: Record<string, string>;
  description: Record<string, string>;
  category: ServiceCategory;
  status: string;
  price: number;
  currency: string;
  pricingType: PricingType;
  priceChild?: number;
  groupDiscount?: number;
  duration?: number;
  durationUnit: DurationUnit;
  minParticipants: number;
  maxParticipants: number;
  latitude?: number;
  longitude?: number;
  address?: string;
  city: string;
  wilaya: string;
  country: string;
  images: string[];
  includes?: Record<string, string[]>;
  requirements?: Record<string, string[]>;
  schedule?: Record<string, any>;
  languages?: string[];
  tags?: string[];
  averageRating: number;
  reviewCount: number;
  bookingCount: number;
  isAvailable: boolean;
  isVerified: boolean;
  instantBooking: boolean;
  minAge: number;
  cancellationPolicy: string;
  createdAt: string;
  updatedAt: string;
}

export interface TourismServiceFilters {
  city?: string;
  category?: string;
  categories?: string[];
  minPrice?: number;
  maxPrice?: number;
  participants?: number;
  sort?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface TourismServiceListResponse {
  data: TourismService[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type ServiceDocumentType =
  | 'national_id'
  | 'registre_commerce'
  | 'avis_imposition'
  | 'certificat_tourisme'
  | 'certificat_culture'
  | 'certificat_artisanat'
  | 'licence_activite';

export interface ServiceVerificationDocument {
  id: string;
  serviceId: string;
  type: ServiceDocumentType;
  fileName: string;
  fileUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewNote?: string;
  createdAt: string;
}
