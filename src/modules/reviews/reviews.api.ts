import { api } from '@/lib/axios';

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

export const reviewsApi = {
  getByProperty: (propertyId: string) =>
    api.get<ReviewResponse[]>(`/reviews/property/${propertyId}`).then(r => r.data),

  getOne: (id: string) =>
    api.get<ReviewResponse>(`/reviews/${id}`).then(r => r.data),

  create: (data: CreateReviewDto) =>
    api.post<ReviewResponse>('/reviews', data).then(r => r.data),

  replyToReview: (reviewId: string, propertyId: string, reply: string) =>
    api.post<ReviewResponse>(`/reviews/${reviewId}/reply`, { propertyId, reply }).then(r => r.data),
};
