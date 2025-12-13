import { useEffect, useState, useCallback } from 'react';
import { reviewsAPI, Review } from '../lib/api';

interface ReviewListProps {
  schoolId: number;
}

export const ReviewList: React.FC<ReviewListProps> = ({ schoolId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const data = await reviewsAPI.getForSchool(schoolId);
      setReviews(data);
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  }, [schoolId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const renderStars = (rating: number) => {
    return '⭐'.repeat(rating);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <p className="text-gray-600">No reviews yet. Be the first to review this school!</p>
      </div>
    );
  }

  const averageRating =
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-700">
              {averageRating.toFixed(1)}
            </div>
            <div className="text-2xl">{renderStars(Math.round(averageRating))}</div>
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900">
              {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
            </p>
            <p className="text-gray-600">Average rating from users</p>
          </div>
        </div>
      </div>

      {/* Individual Reviews */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-xl mb-1">{renderStars(review.rating)}</div>
                <p className="text-sm text-gray-500">{formatDate(review.created_at)}</p>
              </div>
              <div className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                {review.rating}/5
              </div>
            </div>

            {review.comment && (
              <p className="text-gray-700 leading-relaxed">{review.comment}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
