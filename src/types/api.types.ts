/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │  Unified API Types — synchronized with backend DTOs & entities             │
 * │  Auto-generated mapping · DO NOT manually diverge from backend models      │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// ═══════════════════════════════════════════════════════════════════════════════
// ENUMS & UNION TYPES
// ═══════════════════════════════════════════════════════════════════════════════

/** Role hierarchy: hyper_admin(6) > hyper_manager(5) > admin(4) > manager(3) > user(2) > guest(1) */
export type AppRole = 'hyper_admin' | 'hyper_manager' | 'admin' | 'manager' | 'user' | 'guest';

export type PermissionType =
  | 'create_property' | 'modify_property' | 'delete_property' | 'pause_property'
  | 'archive_property' | 'duplicate_property' | 'modify_prices' | 'modify_photos'
  | 'modify_title' | 'modify_description' | 'manage_availability' | 'manage_amenities'
  | 'view_bookings' | 'accept_bookings' | 'reject_bookings' | 'pause_bookings'
  | 'refund_users' | 'answer_demands' | 'decline_demands' | 'accept_demands'
  | 'reply_chat' | 'reply_reviews' | 'reply_comments' | 'send_messages' | 'contact_guests'
  | 'manage_reactions' | 'manage_likes'
  | 'view_analytics' | 'manage_promotions' | 'modify_offers'
  | 'create_service' | 'modify_service' | 'delete_service' | 'pause_service'
  | 'archive_service' | 'duplicate_service'
  | 'manage_users' | 'manage_admins' | 'manage_managers'
  | 'manage_fee_absorption' | 'manage_cancellation_rules';

export type PropertyType = 'apartment' | 'house' | 'villa' | 'studio' | 'condo' | 'hotel' | 'chalet' | 'riad';
export type PropertyStatus = 'draft' | 'published' | 'archived' | 'suspended';

export type ServiceCategory =
  | 'restaurant' | 'walking_tour' | 'cycling_tour' | 'car_tour' | 'bus_tour'
  | 'horse_tour' | 'boat_tour' | 'beauty_salon' | 'massage' | 'hammam'
  | 'tourist_guide' | 'photography' | 'park_visit' | 'beach_visit' | 'nature_excursion'
  | 'regional_event' | 'cooking_class' | 'art_class' | 'drawing_class' | 'sport_activity'
  | 'spa' | 'shopping_tour' | 'cultural_visit' | 'nightlife'
  | 'silver_jewelry' | 'gold_jewelry' | 'traditional_jewelry' | 'pottery'
  | 'leather_craft' | 'carpet_weaving' | 'woodwork' | 'calligraphy' | 'henna_art'
  | 'other';

export type ServiceStatus = 'draft' | 'published' | 'archived' | 'suspended';
export type PricingType = 'per_person' | 'per_group' | 'per_hour' | 'fixed';
export type DurationUnit = 'minutes' | 'hours' | 'days';

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'rejected';
export type PaymentStatus = 'pending' | 'partial' | 'paid' | 'refunded' | 'failed';
export type PaymentMethod = 'cash' | 'ccp' | 'baridi_mob' | 'bank_transfer' | 'edahabia' | 'cib';

export type ServiceBookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'rejected';
export type ServicePaymentMethod = 'cash' | 'ccp' | 'baridi_mob' | 'bank_transfer' | 'edahabia' | 'cib';

export type ReceiptStatus = 'pending' | 'approved' | 'rejected';
export type AccountType = 'ccp' | 'bna' | 'badr' | 'cib' | 'other';

export type DocumentType = 'national_id' | 'passport' | 'permit' | 'notarized_deed' | 'land_registry' | 'utility_bill' | 'management_declaration';
export type DocumentStatus = 'pending' | 'approved' | 'rejected';

export type ServiceDocumentType = 'national_id' | 'registre_commerce' | 'avis_imposition' | 'certificat_tourisme' | 'certificat_culture' | 'certificat_artisanat' | 'licence_activite';
export type ServiceDocumentStatus = 'pending' | 'approved' | 'rejected';

export type InvitationStatus = 'pending' | 'accepted' | 'expired' | 'cancelled';
export type ReferralStatus = 'pending' | 'signed_up' | 'first_booking' | 'completed' | 'expired';

export type SupportThreadStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type SupportCategory = 'technical' | 'booking_issue' | 'payment' | 'property_issue' | 'general' | 'negative_review';

export type CancellationPolicyType = 'flexible' | 'moderate' | 'strict' | 'custom';
export type CancellationScope = 'all' | 'property_group' | 'service_group' | 'property' | 'service';

export type FeeScope = 'global' | 'host' | 'property_group' | 'property' | 'service_group' | 'service';
export type FeeCalculation = 'percentage' | 'fixed' | 'percentage_plus_fixed' | 'fixed_then_percentage';

export type AbsorptionScope = 'all' | 'property_group' | 'service_group' | 'property' | 'service';

export type PointsRuleType = 'earning' | 'conversion';
export type PointsTargetRole = 'guest' | 'manager';

export type AssignmentScope = 'property' | 'property_group' | 'all';

export type AlertFrequency = 'instant' | 'daily' | 'weekly';
export type AlertChannel = 'email' | 'push' | 'sms';

// ═══════════════════════════════════════════════════════════════════════════════
// USER & AUTH ENTITIES
// ═══════════════════════════════════════════════════════════════════════════════

export interface ApiUser {
  id: number;
  email: string;
  phoneNbr: string;
  cardId: string;
  passportId?: string;
  /** Single role per user */
  role: AppRole;
  /** @deprecated Use role instead */
  roles?: string;
  lastName: string;
  firstName: string;
  title?: string;
  city?: string;
  zipcode?: string;
  address?: string;
  country?: string;
  secondPhoneNbr?: string;
  isActive: boolean;
  passwordCreatedAt?: string;
  passwordUpdatedAt?: string;
}

// ─── Hyper Role Restrictions (synced with backend) ──────────────────────────

/**
 * hyper_admin restrictions:
 *  - Cannot invite managers (admin-scoped)
 *  - Cannot create/modify properties or services
 *  - Cannot create absorption fees or cancellation rules
 *  - Cannot accept booking requests
 *  - Cannot make bookings
 *  - Cannot assign permissions to non-hyper_managers
 *  - Cannot create property/service groups
 *
 * hyper_manager restrictions:
 *  - Cannot invite managers
 *  - Cannot make bookings
 *  - All other actions depend on permissions assigned by hyper_admin
 *  - Cannot exceed permissions granted by hyper_admin
 */
export const HYPER_ADMIN_CANNOT = [
  'invite_manager', 'create_property', 'modify_property',
  'create_service', 'modify_service', 'create_absorption_fees',
  'create_cancellation_rules', 'accept_bookings', 'make_booking',
  'assign_permissions_non_hypermanager', 'create_property_groups',
] as const;

export const HYPER_MANAGER_CANNOT = ['invite_manager', 'make_booking'] as const;

export interface ApiUserRole {
  id: string;
  userId: number;
  role: AppRole;
  createdAt: string;
}

export interface ApiManagerAssignment {
  id: string;
  managerId: number;
  assignedByAdminId: number;
  scope: AssignmentScope;
  propertyId?: string;
  propertyGroupId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  manager?: ApiUser;
  assignedByAdmin?: ApiUser;
}

export interface ApiManagerPermission {
  id: string;
  assignmentId: string;
  permission: PermissionType;
  isGranted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiInvitation {
  id: string;
  method: 'email' | 'phone';
  email?: string;
  phone?: string;
  role: string;
  status: InvitationStatus;
  invitedBy: number;
  token?: string;
  message?: string;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
  acceptedAt?: string;
}

export interface ApiReferral {
  id: string;
  referrerId: number;
  referredUserId?: number;
  code: string;
  inviteeContact?: string;
  method: string;
  status: ReferralStatus;
  referrerPointsAwarded: number;
  referredPointsAwarded: number;
  sharedPropertyId?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiPropertyShare {
  id: string;
  userId: number;
  propertyId: string;
  method: string;
  recipient?: string;
  createdAt: string;
}

export interface ApiProfile {
  id: string;
  userId: number;
  displayName?: string;
  avatarUrl?: string;
  bio?: string;
  phoneNumber?: string;
  phoneVerified: boolean;
  city?: string;
  wilaya?: string;
  country: string;
  languages?: string[];
  isHost: boolean;
  isSuperhost: boolean;
  identityVerified: boolean;
  hostSince?: string;
  hostRating: number;
  totalReviews: number;
  preferredLanguage: string;
  preferredCurrency: string;
  createdAt: string;
  updatedAt: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROPERTY ENTITIES
// ═══════════════════════════════════════════════════════════════════════════════

export interface ApiProperty {
  id: string;
  hostId: number;
  title: string;
  description: string;
  propertyType: PropertyType;
  status: PropertyStatus;
  pricePerNight: number;
  currency: string;
  pricePerWeek?: number;
  pricePerMonth?: number;
  weeklyDiscount?: number;
  monthlyDiscount?: number;
  customDiscount?: number;
  customDiscountMinNights?: number;
  cleaningFee?: number;
  serviceFeePercent: number;
  acceptedPaymentMethods?: string[];
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  wilaya: string;
  country: string;
  zipCode?: string;
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
  allowPets: boolean;
  minNights: number;
  maxNights: number;
  createdAt: string;
  updatedAt: string;
  host?: ApiUser;
}

export interface ApiPropertyGroup {
  id: string;
  name: string;
  description?: string;
  adminId: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  admin?: ApiUser;
}

export interface ApiPropertyGroupMembership {
  id: string;
  propertyId: string;
  groupId: string;
  createdAt: string;
}

export interface ApiPropertyAvailability {
  id: string;
  propertyId: string;
  date: string;
  isBlocked: boolean;
  customPrice?: number;
}

export interface ApiPropertyImage {
  id: string;
  propertyId: string;
  url: string;
  caption?: string;
  sortOrder: number;
  isCover: boolean;
  createdAt: string;
}

export interface ApiPropertyPromo {
  id: string;
  propertyId: string;
  startDate: string;
  endDate: string;
  discountPercent: number;
  fixedPrice?: number;
  label?: string;
  isActive: boolean;
  createdAt: string;
}

export interface ApiPromoAlert {
  id: string;
  userId: number;
  propertyId: string;
  notifyEmail: boolean;
  notifyPhone: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface ApiVerificationDocument {
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
}

export interface ApiSavedSearchAlert {
  id: string;
  userId: number;
  name: string;
  criteria: {
    city?: string;
    type?: string;
    minPrice?: number;
    maxPrice?: number;
    guests?: number;
    bedrooms?: number;
    minTrustStars?: number;
    amenities?: string[];
    allowPets?: boolean;
  };
  frequency: AlertFrequency;
  channels: AlertChannel[];
  isActive: boolean;
  lastTriggeredAt?: string;
  matchCount: number;
  createdAt: string;
  updatedAt: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// BOOKING ENTITIES
// ═══════════════════════════════════════════════════════════════════════════════

export interface ApiBooking {
  id: string;
  propertyId: string;
  guestId: number;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  numberOfNights: number;
  pricePerNight: number;
  cleaningFee: number;
  serviceFee: number;
  discountPercent: number;
  discountType?: string;
  effectiveRate: number;
  subtotal: number;
  totalPrice: number;
  currency: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  guestMessage?: string;
  hostResponse?: string;
  confirmedAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
  property?: ApiProperty;
  guest?: ApiUser;
}

// ═══════════════════════════════════════════════════════════════════════════════
// REVIEW ENTITIES
// ═══════════════════════════════════════════════════════════════════════════════

export interface ApiReview {
  id: string;
  propertyId: string;
  guestId: number;
  bookingId: string;
  overallRating: number;
  hostRating?: number;
  cleanlinessRating?: number;
  accuracyRating?: number;
  communicationRating?: number;
  locationRating?: number;
  valueRating?: number;
  checkInRating?: number;
  comment: string;
  hostReply?: string;
  hostReplyAt?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  property?: ApiProperty;
  guest?: ApiUser;
}

// ═══════════════════════════════════════════════════════════════════════════════
// FAVORITES
// ═══════════════════════════════════════════════════════════════════════════════

export interface ApiFavorite {
  id: string;
  userId: number;
  propertyId: string;
  createdAt: string;
  property?: ApiProperty;
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMMENTS & REACTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export interface ApiComment {
  id: string;
  content: string;
  userId: number;
  parentId?: string;
  targetType?: string;
  targetId?: string;
  media?: Array<{ id: string; type: string; url: string; thumbnail?: string }>;
  mentions?: Array<{ userId: string; name: string; startIndex: number; endIndex: number }>;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
  user?: ApiUser;
}

export interface ApiReaction {
  id: string;
  userId: number;
  type: string; // 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry'
  targetType: string;
  targetId: string;
  createdAt: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// TOURISM SERVICE ENTITIES
// ═══════════════════════════════════════════════════════════════════════════════

export interface ApiTourismService {
  id: string;
  providerId: number;
  title: Record<string, string>;
  description: Record<string, string>;
  category: ServiceCategory;
  status: ServiceStatus;
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
  images?: string[];
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
  provider?: ApiUser;
}

export interface ApiServiceBooking {
  id: string;
  serviceId: string;
  customerId: number;
  bookingDate: string;
  startTime?: string;
  participants: number;
  childParticipants: number;
  unitPrice: number;
  childPrice: number;
  discountPercent: number;
  totalPrice: number;
  currency: string;
  status: ServiceBookingStatus;
  paymentStatus: string;
  paymentMethod?: ServicePaymentMethod;
  customerMessage?: string;
  providerResponse?: string;
  participantDetails?: Array<{ name: string; age?: number }>;
  confirmedAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
  service?: ApiTourismService;
  customer?: ApiUser;
}

export interface ApiServiceAvailability {
  id: string;
  serviceId: string;
  date: string;
  isBlocked: boolean;
  customPrice?: number;
  maxSlots?: number;
  bookedSlots: number;
  timeSlots?: string[];
}

export interface ApiServiceGroup {
  id: string;
  name: string;
  description?: string;
  adminId: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  admin?: ApiUser;
}

export interface ApiServiceGroupMembership {
  id: string;
  serviceId: string;
  groupId: string;
  addedAt: string;
}

export interface ApiServiceVerificationDocument {
  id: string;
  serviceId: string;
  type: ServiceDocumentType;
  fileName: string;
  fileUrl: string;
  status: ServiceDocumentStatus;
  reviewNote?: string;
  reviewedBy?: number;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAYMENT ENTITIES
// ═══════════════════════════════════════════════════════════════════════════════

export interface ApiTransferAccount {
  id: string;
  bankName: string;
  accountType: AccountType;
  accountNumber: string;
  accountKey?: string;
  holderName: string;
  agencyName?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiPaymentReceipt {
  id: string;
  bookingId: string;
  uploadedByUserId: number;
  transferAccountId?: string;
  receiptUrl: string;
  originalFileName?: string;
  amount: number;
  currency: string;
  status: ReceiptStatus;
  reviewedByUserId?: number;
  reviewedAt?: string;
  reviewNote?: string;
  guestNote?: string;
  createdAt: string;
  updatedAt: string;
  booking?: ApiBooking;
  uploadedBy?: ApiUser;
  transferAccount?: ApiTransferAccount;
}

// ═══════════════════════════════════════════════════════════════════════════════
// RANKING
// ═══════════════════════════════════════════════════════════════════════════════

export interface ApiRanking {
  id: string;
  userId: number;
  score: number;
  previousRank?: number;
  category?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SUPPORT CHAT
// ═══════════════════════════════════════════════════════════════════════════════

export interface ApiSupportThread {
  id: string;
  subject: string;
  category: SupportCategory;
  status: SupportThreadStatus;
  initiatorId: number;
  assignedAdminId?: number;
  propertyId?: string;
  bookingId?: string;
  reviewId?: string;
  unreadCountAdmin: number;
  unreadCountUser: number;
  createdAt: string;
  updatedAt: string;
  initiator?: ApiUser;
  assignedAdmin?: ApiUser;
}

export interface ApiSupportMessage {
  id: string;
  threadId: string;
  senderId: number;
  senderRole: string;
  content: string;
  isSystemMessage: boolean;
  createdAt: string;
  sender?: ApiUser;
}

// ═══════════════════════════════════════════════════════════════════════════════
// RULES & POLICIES
// ═══════════════════════════════════════════════════════════════════════════════

export interface ApiPointsRule {
  id: string;
  createdByUserId: number;
  ruleType: PointsRuleType;
  targetRole: PointsTargetRole;
  scope: string;
  targetHostId?: number;
  targetPropertyGroupId?: string;
  targetServiceGroupId?: string;
  targetPropertyId?: string;
  targetServiceId?: string;
  action: string;
  pointsAmount: number;
  conversionRate?: number;
  currency: string;
  minPointsForConversion?: number;
  maxPointsPerPeriod: number;
  period?: string;
  multiplier: number;
  minNights?: number;
  validFrom?: string;
  validTo?: string;
  isDefault: boolean;
  isActive: boolean;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiServiceFeeRule {
  id: string;
  createdByUserId: number;
  scope: FeeScope;
  targetHostId?: number;
  targetPropertyGroupId?: string;
  targetPropertyId?: string;
  targetServiceGroupId?: string;
  targetServiceId?: string;
  calculationType: FeeCalculation;
  percentageRate: number;
  fixedAmount: number;
  fixedThreshold?: number;
  minFee?: number;
  maxFee?: number;
  isDefault: boolean;
  isActive: boolean;
  description?: string;
  priority: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiHostFeeAbsorption {
  id: string;
  hostUserId: number;
  scope: AbsorptionScope;
  targetPropertyGroupId?: string;
  targetServiceGroupId?: string;
  targetPropertyId?: string;
  targetServiceId?: string;
  absorptionPercent: number;
  validFrom?: string;
  validTo?: string;
  isActive: boolean;
  description?: string;
  createdAt: string;
  updatedAt: string;
  host?: ApiUser;
}

export interface ApiCancellationRule {
  id: string;
  hostUserId: number;
  policyType: CancellationPolicyType;
  scope: CancellationScope;
  targetPropertyGroupId?: string;
  targetServiceGroupId?: string;
  targetPropertyId?: string;
  targetServiceId?: string;
  fullRefundHours: number;
  partialRefundHours: number;
  partialRefundPercent: number;
  lateCancelPenalty: number;
  noShowPenalty: boolean;
  noShowPenaltyPercent: number;
  isActive: boolean;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DTOs — REQUEST PAYLOADS
// ═══════════════════════════════════════════════════════════════════════════════

/** POST /auth/register */
export interface CreateUserRequestDto {
  phoneNbr: string;
  email: string;
  roles: string[];
  password: string;
  cardId: string;
  passportId: string;
  lastName: string;
  firstName: string;
  title: string;
  city: string;
  zipcode: string;
  address: string;
  country: string;
}

/** POST /auth/activate */
export interface ActivateUserRequestDto {
  phoneNbr?: string;
  email?: string;
  otp: string;
}

/** POST /bookings */
export interface CreateBookingDto {
  propertyId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  paymentMethod: PaymentMethod;
  message?: string;
}

/** POST /service-bookings */
export interface CreateServiceBookingDto {
  serviceId: string;
  bookingDate: string;
  startTime?: string;
  participants: number;
  childParticipants?: number;
  paymentMethod: PaymentMethod;
  message?: string;
  participantDetails?: Array<{ name: string; age?: number }>;
  usePoints?: boolean;
  pointsToUse?: number;
}

/** PUT /service-availability */
export interface ServiceAvailabilityDto {
  date: string;
  isBlocked?: boolean;
  customPrice?: number;
  maxSlots?: number;
  timeSlots?: string[];
}

/** POST /comments */
export interface CreateCommentDto {
  content: string;
  parentId?: string;
  targetType?: string;
  targetId?: string;
}

/** POST /reactions */
export interface CreateReactionDto {
  type: string;
  targetType: string;
  targetId: string;
}

/** PUT /settings/preferences */
export interface UpdatePreferencesDto {
  language?: string;
  theme?: string;
  dateFormat?: string;
  timezone?: string;
  currency?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGINATED RESPONSES
// ═══════════════════════════════════════════════════════════════════════════════

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages?: number;
}

export type PropertyListResponse = PaginatedResponse<ApiProperty>;
export type ServiceListResponse = PaginatedResponse<ApiTourismService>;
export type BookingListResponse = PaginatedResponse<ApiBooking>;

// ═══════════════════════════════════════════════════════════════════════════════
// INCOMPATIBLE ROLES MAP (mirrors backend constant)
// ═══════════════════════════════════════════════════════════════════════════════

export const INCOMPATIBLE_ROLES: Record<AppRole, AppRole[]> = {
  hyper_admin: ['hyper_manager', 'admin', 'manager'],
  hyper_manager: ['hyper_admin', 'admin', 'manager'],
  admin: ['hyper_admin', 'hyper_manager'],
  manager: ['hyper_admin', 'hyper_manager'],
  user: [],
  guest: [],
};
