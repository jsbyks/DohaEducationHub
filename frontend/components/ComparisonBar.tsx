import React from 'react';
import Link from 'next/link';
import { useComparison } from '../contexts/ComparisonContext';
import { Button } from './Button';

export const ComparisonBar: React.FC = () => {
  const { selectedSchools, removeSchool, clearAll } = useComparison();

  if (selectedSchools.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-primary-500 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="flex-shrink-0">
              <p className="text-sm font-medium text-gray-900">
                Compare Schools ({selectedSchools.length}/5)
              </p>
            </div>

            <div className="flex gap-2 overflow-x-auto flex-1 min-w-0">
              {selectedSchools.map((school) => (
                <div
                  key={school.id}
                  className="flex items-center gap-2 bg-primary-100 text-primary-800 px-3 py-1.5 rounded-full text-sm whitespace-nowrap"
                >
                  <span className="truncate max-w-[150px]">{school.name}</span>
                  <button
                    onClick={() => removeSchool(school.id)}
                    className="hover:text-primary-900"
                    aria-label={`Remove ${school.name}`}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Button variant="outline" size="sm" onClick={clearAll}>
              Clear All
            </Button>
            <Link href="/schools/compare">
              <Button size="sm" disabled={selectedSchools.length < 2}>
                Compare Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
