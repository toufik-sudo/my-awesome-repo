import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewsApi, type CreateReviewDto } from './reviews.api';
import { swalAlert } from '@/modules/shared/services/alert.service';

export function usePropertyReviews(propertyId: string) {
  return useQuery({
    queryKey: ['reviews', 'property', propertyId],
    queryFn: () => reviewsApi.getByProperty(propertyId),
    enabled: !!propertyId,
    staleTime: 1000 * 60 * 5,
  });
}

export function usePropertyReviewsPaginated(
  propertyId: string,
  params: { page?: number; limit?: number } = {},
) {
  const page = params.page ?? 1;
  const limit = params.limit ?? 10;
  return useQuery({
    queryKey: ['reviews', 'property', propertyId, 'paginated', page, limit],
    queryFn: () => reviewsApi.getByPropertyPaginated(propertyId, { page, limit }),
    enabled: !!propertyId,
    staleTime: 1000 * 60 * 5,
    placeholderData: (prev) => prev,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReviewDto) => reviewsApi.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', 'property', variables.propertyId] });
      swalAlert.success('Review submitted', 'Thank you for your feedback!');
    },
    onError: () => {
      swalAlert.error('Error', 'Failed to submit review. Please try again.');
    },
  });
}
