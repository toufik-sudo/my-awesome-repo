import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useCreateReview } from '@/modules/reviews/reviews.hooks';
import type { CreateReviewDto } from '@/modules/reviews/reviews.api';

interface StarRatingInputProps {
  value: number;
  onChange: (v: number) => void;
  label: string;
  required?: boolean;
}

const StarRatingInput: React.FC<StarRatingInputProps> = ({ value, onChange, label, required }) => {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center justify-between">
      <Label className="text-sm font-medium text-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="p-0.5 transition-transform hover:scale-110"
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange(star)}
          >
            <Star
              className={cn(
                'h-6 w-6 transition-colors',
                (hovered || value) >= star
                  ? 'fill-accent text-accent'
                  : 'text-muted-foreground/30'
              )}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-muted-foreground w-4">{value || ''}</span>
      </div>
    </div>
  );
};

interface ReviewFormProps {
  propertyId: string;
  bookingId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  propertyId,
  bookingId,
  onSuccess,
  onCancel,
}) => {
  const { t } = useTranslation();
  const { mutate: createReview, isPending } = useCreateReview();

  const [ratings, setRatings] = useState({
    overallRating: 0,
    hostRating: 0,
    cleanlinessRating: 0,
    accuracyRating: 0,
    communicationRating: 0,
    locationRating: 0,
    valueRating: 0,
    checkInRating: 0,
  });
  const [comment, setComment] = useState('');

  const updateRating = (key: keyof typeof ratings, value: number) => {
    setRatings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!ratings.overallRating) return;
    if (!comment.trim()) return;

    const dto: CreateReviewDto = {
      propertyId,
      bookingId,
      overallRating: ratings.overallRating,
      hostRating: ratings.hostRating || undefined,
      cleanlinessRating: ratings.cleanlinessRating || undefined,
      accuracyRating: ratings.accuracyRating || undefined,
      communicationRating: ratings.communicationRating || undefined,
      locationRating: ratings.locationRating || undefined,
      valueRating: ratings.valueRating || undefined,
      checkInRating: ratings.checkInRating || undefined,
      comment: comment.trim(),
    };

    createReview(dto, { onSuccess: () => onSuccess?.() });
  };

  const isValid = ratings.overallRating > 0 && comment.trim().length >= 10;

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-lg font-heading">
          {t('reviews.writeReview', 'Write a Review')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Property Rating */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">
              {t('reviews.propertyRating', 'Property Rating')}
            </h4>
            <StarRatingInput
              label={t('reviews.overall', 'Overall')}
              value={ratings.overallRating}
              onChange={(v) => updateRating('overallRating', v)}
              required
            />
            <StarRatingInput
              label={t('reviews.cleanliness', 'Cleanliness')}
              value={ratings.cleanlinessRating}
              onChange={(v) => updateRating('cleanlinessRating', v)}
            />
            <StarRatingInput
              label={t('reviews.accuracy', 'Accuracy')}
              value={ratings.accuracyRating}
              onChange={(v) => updateRating('accuracyRating', v)}
            />
            <StarRatingInput
              label={t('reviews.location', 'Location')}
              value={ratings.locationRating}
              onChange={(v) => updateRating('locationRating', v)}
            />
            <StarRatingInput
              label={t('reviews.value', 'Value for Money')}
              value={ratings.valueRating}
              onChange={(v) => updateRating('valueRating', v)}
            />
            <StarRatingInput
              label={t('reviews.checkIn', 'Check-in')}
              value={ratings.checkInRating}
              onChange={(v) => updateRating('checkInRating', v)}
            />
          </div>

          <Separator />

          {/* Host Rating */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">
              {t('reviews.hostRating', 'Host Rating')}
            </h4>
            <StarRatingInput
              label={t('reviews.hostOverall', 'Host Experience')}
              value={ratings.hostRating}
              onChange={(v) => updateRating('hostRating', v)}
            />
            <StarRatingInput
              label={t('reviews.communication', 'Communication')}
              value={ratings.communicationRating}
              onChange={(v) => updateRating('communicationRating', v)}
            />
          </div>

          <Separator />

          {/* Comment */}
          <div>
            <Label htmlFor="review-comment" className="text-sm font-semibold text-foreground">
              {t('reviews.comment', 'Your Experience')} <span className="text-destructive">*</span>
            </Label>
            <textarea
              id="review-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t('reviews.commentPlaceholder', 'Share your experience with this property...')}
              className="mt-2 w-full min-h-[120px] rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y"
              minLength={10}
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              {t('reviews.minChars', 'Minimum 10 characters')} ({comment.length}/10)
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" disabled={!isValid || isPending} className="flex-1">
              {isPending
                ? t('reviews.submitting', 'Submitting...')
                : t('reviews.submit', 'Submit Review')}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                {t('common.cancel', 'Cancel')}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReviewForm;
