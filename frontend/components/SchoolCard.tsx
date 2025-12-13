import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { School } from '../lib/api';
import { Card } from './Card';
import { useAuth } from '../contexts/AuthContext';
import { favoritesAPI } from '../lib/api';

interface SchoolCardProps {
  school: School;
}

export const SchoolCard: React.FC<SchoolCardProps> = ({ school }) => {
  const { user } = useAuth();
  const [isFavorited, setIsFavorited] = useState(false);
  const [loadingFav, setLoadingFav] = useState(false);

  useEffect(() => {
    let mounted = true;
    const check = async () => {
      if (!user) return;
      try {
        const token = localStorage.getItem('access_token') || '';
        const fav = await favoritesAPI.check(school.id, token);
        if (mounted) setIsFavorited(fav);
      } catch (e) {
        // ignore
      }
    };
    check();
    return () => {
      mounted = false;
    };
  }, [user, school.id]);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      // Optionally redirect to login
      window.location.href = '/login';
      return;
    }

    setLoadingFav(true);
    try {
      const token = localStorage.getItem('access_token') || '';
      if (isFavorited) {
        await favoritesAPI.remove(school.id, token);
        setIsFavorited(false);
      } else {
        await favoritesAPI.add(school.id, token);
        setIsFavorited(true);
      }
    } catch (err) {
      console.error('Favorite toggle failed', err);
    } finally {
      setLoadingFav(false);
    }
  };

  return (
    <Link legacyBehavior href={`/schools/${school.id}`}>
      <Card className="hover:border-primary-300 border border-transparent relative" data-testid="school-card">
        <button
          onClick={toggleFavorite}
          aria-label={isFavorited ? 'Remove favorite' : 'Add favorite'}
          className="absolute top-3 right-3 bg-white rounded-full p-1 shadow-sm"
        >
          {isFavorited ? (
            <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.54 0 3.04.99 3.57 2.36h1.87C14.46 4.99 15.96 4 17.5 4 20 4 22 6 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.54 0 3.04.99 3.57 2.36h1.87C14.46 4.99 15.96 4 17.5 4 20 4 22 6 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          )}
        </button>

        <div className="flex flex-col h-full">
          {/* School Name */}
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {school.name}
          </h3>

          {/* Curriculum & Type */}
          <div className="flex flex-wrap gap-2 mb-3">
            {school.curriculum && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                {school.curriculum}
              </span>
            )}
            {school.type && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                {school.type}
              </span>
            )}
          </div>

          {/* Address */}
          {school.address && (
            <p className="text-sm text-gray-600 mb-3 flex items-start">
              <svg
                className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {school.address}
            </p>
          )}

          {/* Contact */}
          {school.contact && (
            <p className="text-sm text-gray-600 mb-3 flex items-center">
              <svg
                className="w-4 h-4 mr-2 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              {school.contact}
            </p>
          )}

          {/* Website */}
          {school.website && (
            <p className="text-sm text-primary-600 hover:text-primary-800 flex items-center mt-auto">
              <svg
                className="w-4 h-4 mr-2 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                />
              </svg>
              Visit Website
            </p>
          )}

          {/* View Details Link */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <span className="text-primary-600 font-medium text-sm hover:text-primary-800">
              View Details →
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
};
