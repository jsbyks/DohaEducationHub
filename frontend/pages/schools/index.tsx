import React, { useState, useEffect, useCallback } from 'react';
import SEO from '../../components/SEO';
import { schoolsAPI, SchoolListResponse, SchoolFilters } from '../../lib/api';
import { SchoolCard } from '../../components/SchoolCard';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { Button } from '../../components/Button';

const CURRICULUM_OPTIONS = [
  { value: '', label: 'All Curricula' },
  { value: 'British', label: 'British' },
  { value: 'American', label: 'American' },
  { value: 'IB', label: 'IB (International Baccalaureate)' },
  { value: 'Arabic', label: 'Arabic' },
  { value: 'Indian', label: 'Indian' },
  { value: 'French', label: 'French' },
];

const TYPE_OPTIONS = [
  { value: '', label: 'All Types' },
  { value: 'Primary', label: 'Primary' },
  { value: 'Secondary', label: 'Secondary' },
  { value: 'All-through', label: 'All-through' },
];

export default function SchoolsPage() {
  const [data, setData] = useState<SchoolListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SchoolFilters>({
    page: 1,
    page_size: 12,
  });

  const fetchSchools = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await schoolsAPI.list(filters);
      setData(response);
    } catch (err: any) {
      setError(err.message || 'Failed to load schools');
      console.error('Error fetching schools:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch schools when filters change
  useEffect(() => {
    fetchSchools();
  }, [fetchSchools]);

  const handleFilterChange = (key: keyof SchoolFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
      page: 1, // Reset to first page when filters change
    }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Filters are already applied via handleFilterChange
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPages = data ? Math.ceil(data.total / data.page_size) : 0;

  return (
    <>
      <SEO
        title="Find Schools in Doha"
        description="Search and compare schools in Doha, Qatar. Find the perfect school for your child with our comprehensive directory."
        path="/schools"
      />

      <div className="min-h-screen bg-gray-50">

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Search & Filter</h2>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search by name */}
                <Input
                  label="School Name"
                  placeholder="Search by school name..."
                  value={filters.search || ''}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />

                {/* Curriculum filter */}
                <Select
                  label="Curriculum"
                  options={CURRICULUM_OPTIONS}
                  value={filters.curriculum || ''}
                  onChange={(e) =>
                    handleFilterChange('curriculum', e.target.value)
                  }
                />

                {/* Type filter */}
                <Select
                  label="School Type"
                  options={TYPE_OPTIONS}
                  value={filters.type || ''}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                />

                {/* Location filter */}
                <Input
                  label="Location"
                  placeholder="Search by location..."
                  value={filters.location || ''}
                  onChange={(e) =>
                    handleFilterChange('location', e.target.value)
                  }
                />
              </div>

              {/* Clear Filters Button */}
              {(filters.search ||
                filters.curriculum ||
                filters.type ||
                filters.location) && (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    setFilters({ page: 1, page_size: filters.page_size })
                  }
                >
                  Clear Filters
                </Button>
              )}
            </form>
          </div>

          {/* Results Count */}
          {data && (
            <div className="mb-6">
              <p className="text-gray-700">
                Found <span className="font-semibold">{data.total}</span>{' '}
                {data.total === 1 ? 'school' : 'schools'}
              </p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              <p className="mt-4 text-gray-600">Loading schools...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">{error}</p>
              <Button
                variant="secondary"
                size="sm"
                className="mt-2"
                onClick={fetchSchools}
              >
                Try Again
              </Button>
            </div>
          )}

          {/* Schools Grid */}
          {!loading && data && data.results.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {data.results.map((school) => (
                <SchoolCard key={school.id} school={school} />
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && data && data.results.length === 0 && (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                No schools found
              </h3>
              <p className="mt-1 text-gray-500">
                Try adjusting your filters or search terms
              </p>
            </div>
          )}

          {/* Pagination */}
          {data && totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handlePageChange(data.page - 1)}
                disabled={data.page === 1}
              >
                Previous
              </Button>

              <div className="flex space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 rounded ${
                        page === data.page
                          ? 'bg-primary-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => handlePageChange(data.page + 1)}
                disabled={data.page === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </main>


      </div>
    </>
  );
}
