export type DocumentType = 
  | 'national_id'
  | 'passport'
  | 'permit'
  | 'notarized_deed'
  | 'land_registry'
  | 'utility_bill'
  | 'management_declaration';

export type DocumentStatus = 'pending' | 'approved' | 'rejected';

export interface AIAnalysisResult {
  isValid: boolean;
  confidence: number;
  reason: string;
  detectedIssues: string[];
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
  createdAt: string;
  updatedAt: string;
  // AI Analysis fields
  aiAnalyzed?: boolean;
  aiValidationResult?: boolean;
  aiConfidence?: number;
  aiReason?: string;
  aiDetectedIssues?: string[];
  aiAnalyzedAt?: string;
  // Relations
  property?: {
    id: string;
    title: string;
    propertyType: string;
    city: string;
    wilaya: string;
    hostId: number;
  };
}

export interface PropertyVerification {
  hasIdentity: boolean;
  hasNotarizedDeed: boolean;
  hasLandRegistry: boolean;
  hasUtilityBill: boolean;
  hasManagementDeclaration: boolean;
  documents: VerificationDocument[];
  trustStars: number;
  isVerified: boolean;
}

export interface PendingVerification {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyType: string;
  location: { city: string; wilaya: string };
  hostName: string;
  hostEmail: string;
  submittedAt: string;
  documents: VerificationDocument[];
  currentTrustStars: number;
  overallStatus: 'pending' | 'partial' | 'approved' | 'rejected';
}

export interface DocumentValidationResponse {
  document: VerificationDocument;
  aiResult?: AIAnalysisResult;
  autoApproved: boolean;
}

export interface TrustRecalculationResponse {
  propertyId: string;
  trustStars: number;
  isVerified: boolean;
}

/**
 * Trust star scoring logic:
 * - No ID provided → 0 stars (not verified, placed at end)
 * - ID only → 1 star
 * - ID + utility bill (no deed) → 2 stars
 * - ID + notarized deed or land registry (no utility) → 3 stars
 * - ID + deed + utility bill → 5 stars
 */
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
