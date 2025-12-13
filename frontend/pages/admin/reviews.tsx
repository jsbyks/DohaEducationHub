import { useState, useEffect } from 'react';
import Link from 'next/link';
import SEO from '../../components/SEO';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { reviewsAPI, Review } from '../../lib/api';
import { Button } from '../../components/Button';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState<number | null>(null);

  useEffect(() => {
    fetchPendingReviews();
  }, []);

  const fetchPendingReviews = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      if (!token) return;

      const data = await reviewsAPI.getPending(token);
      setReviews(data);
    } catch (err: any) {
      console.error('Failed to fetch pending reviews:', err);
      setError('Failed to load pending reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (reviewId: number) => {
    try {
      setProcessing(reviewId);
      const token = localStorage.getItem('access_token');
      if (!token) return;

      await reviewsAPI.updateStatus(reviewId, 'approved', token);

      // Remove from list
      setReviews(reviews.filter(r => r.id !== reviewId));
    } catch (err: any) {
      console.error('Failed to approve review:', err);
      alert('Failed to approve review');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (reviewId: number) => {
    try {
      setProcessing(reviewId);
      const token = localStorage.getItem('access_token');
      if (!token) return;

      await reviewsAPI.updateStatus(reviewId, 'rejected', token);

      // Remove from list
      setReviews(reviews.filter(r => r.id !== reviewId));
    } catch (err: any) {
      console.error('Failed to reject review:', err);
      alert('Failed to reject review');
    } finally {
      setProcessing(null);
    }
  };

  const renderStars = (rating: number) => {
    return '⭐'.repeat(rating);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <ProtectedRoute adminOnly={true}>
      <SEO
        title="Admin - Review Moderation"
        description="Admin panel for moderating pending school reviews."
        path="/admin/reviews"
      />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold mb-2">Review Moderation</h1>
            <p className="text-primary-100">Approve or reject pending reviews</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Navigation */}
          <div className="mb-8">
            <Link href="/admin" className="text-primary-600 hover:text-primary-800">
              ← Back to Admin Dashboard
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading reviews...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-red-600">{error}</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">All Caught Up!</h2>
              <p className="text-gray-600">There are no pending reviews to moderate.</p>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold">
                  {reviews.length} Pending {reviews.length === 1 ? 'Review' : 'Reviews'}
                </h2>
              </div>

              <div className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-400"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="text-2xl mb-1">{renderStars(review.rating)}</div>
                        <p className="text-sm text-gray-500">
                          Submitted on {formatDate(review.created_at)}
                        </p>
                        <p className="text-sm text-gray-500">
                          School ID: {review.school_id} | User ID: {review.user_id}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleApprove(review.id)}
                          disabled={processing === review.id}
                          variant="primary"
                          size="sm"
                        >
                          {processing === review.id ? 'Processing...' : '✓ Approve'}
                        </Button>
                        <Button
                          onClick={() => handleReject(review.id)}
                          disabled={processing === review.id}
                          variant="secondary"
                          size="sm"
                        >
                          {processing === review.id ? 'Processing...' : '✗ Reject'}
                        </Button>
                      </div>
                    </div>

                    {review.comment && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
