import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { favoritesAPI } from '../lib/api';

interface FavoriteButtonProps {
  schoolId: number;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({ schoolId }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  const checkFavoriteStatus = useCallback(async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      const status = await favoritesAPI.check(schoolId, token);
      setIsFavorited(status);
    } catch (err) {
      console.error('Failed to check favorite status:', err);
    } finally {
      setCheckingStatus(false);
    }
  }, [schoolId]);

  useEffect(() => {
    if (user) {
      checkFavoriteStatus();
    } else {
      setCheckingStatus(false);
    }
  }, [user, checkFavoriteStatus]);

  const handleToggle = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        router.push('/login');
        return;
      }

      if (isFavorited) {
        await favoritesAPI.remove(schoolId, token);
        setIsFavorited(false);
      } else {
        await favoritesAPI.add(schoolId, token);
        setIsFavorited(true);
      }
    } catch (err: any) {
      console.error('Failed to toggle favorite:', err);
      alert(err.response?.data?.detail || 'Failed to update favorite. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (checkingStatus) {
    return (
      <button
        disabled
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
      >
        <span className="text-xl">♡</span>
        <span>Loading...</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
        isFavorited
          ? 'bg-red-50 border-red-300 text-red-600 hover:bg-red-100'
          : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
      } ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}`}
    >
      <span className="text-xl">{isFavorited ? '❤️' : '♡'}</span>
      <span className="font-medium">
        {loading ? 'Updating...' : isFavorited ? 'Saved' : 'Save School'}
      </span>
    </button>
  );
};
