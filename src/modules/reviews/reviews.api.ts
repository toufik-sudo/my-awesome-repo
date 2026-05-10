import { api } from '@/lib/axios';
import { rbac } from '@/lib/api-rbac';

export interface ReviewResponse {
  id: string;
  propertyId: string;
  guestId: number;
  bookingId: string;
  overallRating: number;
  hostRating: number | null;
  cleanlinessRating: number | null;
  accuracyRating: number | null;
  communicationRating: number | null;
  locationRating: number | null;
  valueRating: number | null;
  checkInRating: number | null;
  comment: string;
  hostReply: string | null;
  hostReplyAt: string | null;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  guest?: {
    id: number;
    firstName?: string;
    lastName?: string;
    email: string;
    avatar?: string;
  };
}

export interface CreateReviewDto {
  propertyId: string;
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
}

export interface PaginatedReviews {
  data: ReviewResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const reviewsApi = {
  /** @deprecated Use getByPropertyPaginated for server-side pagination. */
  getByProperty: (propertyId: string) =>
    api.get<PaginatedReviews>(`/reviews/property/${propertyId}`, {
      ...rbac('reviewsApi.getByProperty.GET'),
      params: { page: 1, limit: 1000 },
    }).then(r => r.data.data),

  getByPropertyPaginated: (propertyId: string, params: { page?: number; limit?: number } = {}) =>
    api.get<PaginatedReviews>(`/reviews/property/${propertyId}`, {
      ...rbac('reviewsApi.getByProperty.GET'),
      params: { page: params.page ?? 1, limit: params.limit ?? 10 },
    }).then(r => r.data),

  getOne: (id: string) =>
    api.get<ReviewResponse>(`/reviews/${id}`, rbac('reviewsApi.getOne.GET')).then(r => r.data),

  create: (data: CreateReviewDto) =>
    api.post<ReviewResponse>('/reviews', data, rbac('reviewsApi.create.POST')).then(r => r.data),

  replyToReview: (reviewId: string, propertyId: string, reply: string) =>
    api.post<ReviewResponse>(`/reviews/${reviewId}/reply`, { propertyId, reply }, rbac('reviewsApi.replyToReview.POST')).then(r => r.data),
};
