export type PropertyType = 'apartment' | 'house' | 'villa' | 'studio' | 'condo' | 'hotel' | 'chalet' | 'riad';
export type PropertyStatus = 'draft' | 'published' | 'archived' | 'suspended';

export type DocumentType =
  | 'national_id'
  | 'passport'
  | 'permit'
  | 'notarized_deed'
  | 'land_registry'
  | 'utility_bill'
  | 'management_declaration';

export type DocumentStatus = 'pending' | 'approved' | 'rejected';

export interface Property {
  id: string;
  hostId: number;
  title: string;
  description: string;
  propertyType: PropertyType;
  status: PropertyStatus;
  pricePerNight: number;
  currency: string;
  weeklyDiscount?: number;
  monthlyDiscount?: number;
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  wilaya: string;
  country: string;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  beds: number;
  images: string[];
  amenities: string[];
  checkInTime: string;
  checkOutTime: string;
  houseRules?: string[];
  cancellationPolicy: string;
  averageRating: number;
  reviewCount: number;
  bookingCount: number;
  isAvailable: boolean;
  trustStars: number;
  isVerified: boolean;
  instantBooking: boolean;
  minNights: number;
  maxNights: number;
  createdAt: string;
  updatedAt: string;
}

export interface VerificationDocument {
  id: string;
  propertyId: string;
  type: DocumentType;
  fileName: string;
  fileUrl: string;
  status: DocumentStatus;
  reviewNote?: string;
  reviewedBy?: number;
  reviewedAt?: string;
  aiAnalyzed?: boolean;
  aiValidationResult?: boolean;
  aiConfidence?: number;
  aiReason?: string;
  aiDetectedIssues?: string[];
  aiAnalyzedAt?: string;
  createdAt: string;
  updatedAt: string;
  property?: Property;
}

export interface AIValidationResult {
  isValid: boolean;
  confidence: number;
  reason: string;
  detectedIssues: string[];
}

export interface DocumentValidationResponse {
  document: VerificationDocument;
  aiResult?: AIValidationResult;
  autoApproved: boolean;
}

export interface TrustRecalculationResponse {
  propertyId: string;
  trustStars: number;
  isVerified: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PropertyFilters {
  city?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  guests?: number;
  bedrooms?: number;
  checkIn?: string;
  checkOut?: string;
  minTrustStars?: number;
  sort?: string;
  page?: number;
  limit?: number;
}

export const DOCUMENT_LABELS: Record<DocumentType, string> = {
  national_id: 'National ID Card',
  passport: 'Passport',
  permit: 'Residence Permit',
  notarized_deed: 'Notarized Property Deed',
  land_registry: 'Land Registry Document',
  utility_bill: 'Utility Bill (last 3 months)',
  management_declaration: 'Property Management Declaration',
};

export const IDENTITY_DOCUMENTS: DocumentType[] = ['national_id', 'passport', 'permit'];
export const PROPERTY_DOCUMENTS: DocumentType[] = ['notarized_deed', 'land_registry', 'utility_bill', 'management_declaration'];

export function calculateTrustStars(docs: {
  hasIdentity: boolean;
  hasNotarizedDeed: boolean;
  hasLandRegistry: boolean;
  hasUtilityBill: boolean;
}): number {
  if (!docs.hasIdentity) return 0;
  const hasDeed = docs.hasNotarizedDeed || docs.hasLandRegistry;
  const hasUtility = docs.hasUtilityBill;
  if (hasDeed && hasUtility) return 5;
  if (hasDeed) return 3;
  if (hasUtility) return 2;
  return 1;
}
