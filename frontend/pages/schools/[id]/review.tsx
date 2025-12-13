import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { reviewsAPI } from '../../../lib/api';
import { useAuth } from '../../../contexts/AuthContext';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';

const ReviewPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      window.location.href = '/login';
      return;
    }
    setError(null);
    try {
      const token = localStorage.getItem('access_token') || '';
      await reviewsAPI.submit({ school_id: Number(id), rating, comment }, token);
      router.push(`/schools/${id}`);
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to submit review');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 px-4">
      <h2 className="text-xl font-semibold mb-4">Write a review</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label htmlFor="rating-select" className="block text-sm">Rating</label>
        <select
          id="rating-select"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="input-field"
        >
          {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} stars</option>)}
        </select>
        <Input label="Comment" value={comment} onChange={(e) => setComment(e.target.value)} />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex justify-end">
          <Button type="submit">Submit review</Button>
        </div>
      </form>
    </div>
  );
};

export default ReviewPage;
