import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { reviewsAPI, ReviewCreate } from '../lib/api';
import { Input } from './Input';
import { Select } from './Select';
import { Button } from './Button';

interface ReviewFormProps {
  schoolId: number;
  onSuccess?: () => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ schoolId, onSuccess }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState('5');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!user) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <p className="text-gray-600">
          Please{' '}
          <Link href="/login" className="text-primary-600 hover:text-primary-800 font-medium">
            log in
          </Link>{' '}
          to submit a review
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('Please log in to submit a review');
        return;
      }

      const reviewData: ReviewCreate = {
        school_id: schoolId,
        rating: parseInt(rating),
        comment: comment.trim() || undefined,
      };

      await reviewsAPI.submit(reviewData, token);

      // Success
      setSuccess(true);
      setComment('');
      setRating('5');

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-green-800 mb-2">Review Submitted!</h3>
        <p className="text-green-700 mb-4">
          Thank you for your review. It will be visible once approved by our moderators.
        </p>
        <Button onClick={() => setSuccess(false)} variant="secondary" size="sm">
          Submit Another Review
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4">Write a Review</h3>

      <div className="mb-4">
        <Select
          label="Rating"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          options={[
            { value: '5', label: '⭐⭐⭐⭐⭐ Excellent' },
            { value: '4', label: '⭐⭐⭐⭐ Good' },
            { value: '3', label: '⭐⭐⭐ Average' },
            { value: '2', label: '⭐⭐ Below Average' },
            { value: '1', label: '⭐ Poor' },
          ]}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Your Review (Optional)
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this school..."
          className="input-field"
          rows={4}
          maxLength={1000}
        />
        {comment && (
          <p className="text-xs text-gray-500 mt-1">
            {comment.length}/1000 characters
          </p>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <Button type="submit" variant="primary" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Review'}
      </Button>
    </form>
  );
};
