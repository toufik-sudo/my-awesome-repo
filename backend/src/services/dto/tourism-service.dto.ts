import { IsString, IsNumber, IsOptional, IsBoolean, IsArray, IsObject, IsEnum, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

const SERVICE_CATEGORIES = [
  'restaurant', 'walking_tour', 'cycling_tour', 'car_tour', 'bus_tour',
  'horse_tour', 'boat_tour', 'beauty_salon', 'massage', 'hammam',
  'tourist_guide', 'photography', 'park_visit', 'beach_visit', 'nature_excursion',
  'regional_event', 'cooking_class', 'art_class', 'drawing_class', 'sport_activity',
  'spa', 'shopping_tour', 'cultural_visit', 'nightlife',
  'silver_jewelry', 'gold_jewelry', 'traditional_jewelry', 'pottery',
  'leather_craft', 'carpet_weaving', 'woodwork', 'calligraphy', 'henna_art',
  'other',
] as const;

const PRICING_TYPES = ['per_person', 'per_group', 'per_hour', 'fixed'] as const;
const DURATION_UNITS = ['minutes', 'hours', 'days'] as const;

export class CreateServiceDto {
  @IsObject()
  title: Record<string, string>;

  @IsObject()
  description: Record<string, string>;

  @IsString()
  category: string;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  price: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  pricingType?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  priceChild?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  groupDiscount?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  duration?: number;

  @IsOptional()
  @IsString()
  durationUnit?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  minParticipants?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxParticipants?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  latitude?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  longitude?: number;

  @IsOptional()
  @IsString()
  address?: string;

  @IsString()
  city: string;

  @IsString()
  wilaya: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsArray()
  images?: string[];

  @IsOptional()
  @IsObject()
  includes?: Record<string, string[]>;

  @IsOptional()
  @IsObject()
  requirements?: Record<string, string[]>;

  @IsOptional()
  @IsObject()
  schedule?: Record<string, any>;

  @IsOptional()
  @IsArray()
  languages?: string[];

  @IsOptional()
  @IsArray()
  tags?: string[];

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  minAge?: number;

  @IsOptional()
  @IsString()
  cancellationPolicy?: string;

  @IsOptional()
  @IsBoolean()
  instantBooking?: boolean;

  @IsOptional()
  @IsString()
  status?: string;
}

export class UpdateServiceDto {
  @IsOptional()
  @IsObject()
  title?: Record<string, string>;

  @IsOptional()
  @IsObject()
  description?: Record<string, string>;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  price?: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  pricingType?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  priceChild?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  groupDiscount?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  duration?: number;

  @IsOptional()
  @IsString()
  durationUnit?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  minParticipants?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxParticipants?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  latitude?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  longitude?: number;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  wilaya?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsArray()
  images?: string[];

  @IsOptional()
  @IsObject()
  includes?: Record<string, string[]>;

  @IsOptional()
  @IsObject()
  requirements?: Record<string, string[]>;

  @IsOptional()
  @IsObject()
  schedule?: Record<string, any>;

  @IsOptional()
  @IsArray()
  languages?: string[];

  @IsOptional()
  @IsArray()
  tags?: string[];

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  minAge?: number;

  @IsOptional()
  @IsString()
  cancellationPolicy?: string;

  @IsOptional()
  @IsBoolean()
  instantBooking?: boolean;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}

export class ServiceFiltersDto {
  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsArray()
  categories?: string[];

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  participants?: number;

  @IsOptional()
  @IsString()
  sort?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;
}
