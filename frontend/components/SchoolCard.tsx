import React from 'react';
import Link from 'next/link';
import { School } from '../lib/api';
import { Card } from './Card';

interface SchoolCardProps {
  school: School;
}

export const SchoolCard: React.FC<SchoolCardProps> = ({ school }) => {
  return (
    <Link href={`/schools/${school.id}`}>
      <Card className="hover:border-primary-300 border border-transparent">
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
