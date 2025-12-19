import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { School } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { useComparison } from '../contexts/ComparisonContext';
import { favoritesAPI } from '../lib/api';
import { imageApi } from '../lib/imageApi';

interface SchoolCardProps {
  school: School;
}

export const SchoolCard: React.FC<SchoolCardProps> = ({ school }) => {
  const { user } = useAuth();
  const { isSelected, addSchool, removeSchool, maxReached } = useComparison();
  const [isFavorited, setIsFavorited] = useState(false);
  const [loadingFav, setLoadingFav] = useState(false);
  const [featuredImage, setFeaturedImage] = useState<string>('');
  const selected = isSelected(school.id);

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

  useEffect(() => {
    // Fetch featured image based on school type and curriculum
    if (school.type === 'Kindergarten') {
      // Use children images for kindergartens
      imageApi.getKindergartenImage().then(setFeaturedImage);
    } else if (school.curriculum) {
      imageApi.getCurriculumImage(school.curriculum).then(setFeaturedImage);
    } else {
      imageApi.getFeaturedImage('school').then(setFeaturedImage);
    }
  }, [school.type, school.curriculum]);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
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

  const handleCompareToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (selected) {
      removeSchool(school.id);
    } else {
      if (!maxReached) {
        addSchool(school);
      }
    }
  };

  return (
    <Link legacyBehavior href={`/schools/${school.id}`}>
      <div
        className={`card card-hover group cursor-pointer overflow-hidden ${
          selected ? 'ring-2 ring-blue-500' : ''
        }`}
        data-testid="school-card"
      >
        {/* Featured Image */}
        <div className="image-card group h-48 relative">
          <img
            src={featuredImage || imageApi.getPlaceholderImage()}
            alt={school.name}
            className="w-full h-full object-cover"
          />
          <div className="image-overlay"></div>

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex gap-2 z-10">
            <button
              onClick={handleCompareToggle}
              aria-label={selected ? 'Remove from comparison' : 'Add to comparison'}
              className={`glass p-2 rounded-full hover:scale-110 transition-transform ${
                selected ? 'bg-blue-500 text-white' : 'text-white'
              } ${!selected && maxReached ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!selected && maxReached}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </button>
            <button
              onClick={toggleFavorite}
              aria-label={isFavorited ? 'Remove favorite' : 'Add favorite'}
              className="glass p-2 rounded-full hover:scale-110 transition-transform"
            >
              {isFavorited ? (
                <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.54 0 3.04.99 3.57 2.36h1.87C14.46 4.99 15.96 4 17.5 4 20 4 22 6 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.54 0 3.04.99 3.57 2.36h1.87C14.46 4.99 15.96 4 17.5 4 20 4 22 6 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              )}
            </button>
          </div>

          {/* School Name Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
            <h3 className="text-xl font-bold text-white mb-1 group-hover:scale-105 transition-transform">
              {school.name}
            </h3>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6">
          {/* Curriculum & Type Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            {school.curriculum && (
              <span className="badge badge-primary">
                {school.curriculum}
              </span>
            )}
            {school.type && (
              <span className="badge badge-success">
                {school.type}
              </span>
            )}
          </div>

          {/* Address */}
          {school.address && (
            <div className="flex items-start text-sm text-gray-600 mb-3">
              <svg
                className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-blue-500"
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
            </div>
          )}

          {/* Contact */}
          {school.contact && (
            <div className="flex items-center text-sm text-gray-600 mb-3">
              <svg
                className="w-4 h-4 mr-2 flex-shrink-0 text-blue-500"
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
            </div>
          )}

          {/* Website */}
          {school.website && (
            <div className="flex items-center text-sm text-blue-600 hover:text-blue-800 mb-4">
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
            </div>
          )}

          {/* View Details Button */}
          <button className="btn btn-secondary w-full group mt-auto">
            View Full Details
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>
    </Link>
  );
};
