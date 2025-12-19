import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import SEO from '../../components/SEO';
import { ModernHero } from '../../components/ModernHero';
import { schoolsAPI, SchoolListResponse, SchoolFilters, School } from '../../lib/api';
import { SchoolCard } from '../../components/SchoolCard';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';

// Dynamically import map to avoid SSR issues
const SchoolMap = dynamic(() => import('../../components/SchoolMap').then(mod => mod.SchoolMap), {
  ssr: false,
  loading: () => <div className="w-full h-[600px] bg-gray-100 rounded-lg flex items-center justify-center">Loading map...</div>
});

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
  { value: 'Kindergarten', label: 'Kindergarten' },
  { value: 'Primary', label: 'Primary' },
  { value: 'Secondary', label: 'Secondary' },
  { value: 'All-through', label: 'All-through' },
];

export default function SchoolsPage() {
  const router = useRouter();
  const [data, setData] = useState<SchoolListResponse | null>(null);
  const [allSchools, setAllSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMap, setLoadingMap] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [filters, setFilters] = useState<SchoolFilters>({
    page: 1,
    page_size: 12,
  });

  // Initialize filters from URL query parameters on mount
  useEffect(() => {
    if (router.isReady) {
      const { search, curriculum, type, location } = router.query;

      // Only update if there are query parameters
      const hasQueryParams = search || curriculum || type || location;

      if (hasQueryParams) {
        setFilters((prev) => ({
          ...prev,
          search: typeof search === 'string' ? search : undefined,
          curriculum: typeof curriculum === 'string' ? curriculum : undefined,
          type: typeof type === 'string' ? type : undefined,
          location: typeof location === 'string' ? location : undefined,
        }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

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

  // Fetch all schools for map view (without pagination)
  const fetchAllSchoolsForMap = useCallback(async () => {
    try {
      setLoadingMap(true);
      // Create filters for fetching all schools (page_size: 500 to get all)
      const mapFilters = {
        ...filters,
        page: 1,
        page_size: 500, // Fetch all schools (backend max is 500)
      };
      const response = await schoolsAPI.list(mapFilters);
      setAllSchools(response.results);
    } catch (err: any) {
      console.error('Error fetching schools for map:', err);
    } finally {
      setLoadingMap(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchSchools();
  }, [fetchSchools]);

  // Fetch all schools when switching to map view
  useEffect(() => {
    if (viewMode === 'map' && allSchools.length === 0) {
      fetchAllSchoolsForMap();
    }
  }, [viewMode, allSchools.length, fetchAllSchoolsForMap]);

  // Refetch all schools when filters change and in map view
  useEffect(() => {
    if (viewMode === 'map') {
      fetchAllSchoolsForMap();
    }
  }, [filters.search, filters.curriculum, filters.type, filters.location, viewMode, fetchAllSchoolsForMap]);

  const handleFilterChange = (key: keyof SchoolFilters, value: string) => {
    const newFilters = {
      ...filters,
      [key]: value || undefined,
      page: 1,
    };

    setFilters(newFilters);

    // Update URL with new filters
    const query: any = {};
    if (newFilters.search) query.search = newFilters.search;
    if (newFilters.curriculum) query.curriculum = newFilters.curriculum;
    if (newFilters.type) query.type = newFilters.type;
    if (newFilters.location) query.location = newFilters.location;

    router.push({ pathname: '/schools', query }, undefined, { shallow: true });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
    // Scroll to filters section instead of top
    const filtersElement = document.getElementById('filters');
    if (filtersElement) {
      const yOffset = -20; // Small offset from top
      const y = filtersElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const totalPages = data ? Math.ceil(data.total / data.page_size) : 0;

  const hasActiveFilters = filters.search || filters.curriculum || filters.type || filters.location;

  // Generate pagination numbers with ellipsis
  const getPaginationNumbers = () => {
    const currentPage = data?.page || 1;
    const pages: (number | string)[] = [];
    const maxVisible = 7; // Maximum number of page buttons to show

    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Always show first page
    pages.push(1);

    if (currentPage > 3) {
      pages.push('...');
    }

    // Show pages around current page
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push('...');
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <>
      <SEO
        title="Discover Schools in Doha, Qatar"
        description="Browse 98+ international schools in Doha. Compare curricula, facilities, fees, and find your perfect educational match. British, American, IB, and more."
        path="/schools"
      />

      <div className="min-h-screen">
        {/* Modern Hero Section */}
        <ModernHero
          title="Discover Your Ideal School"
          subtitle="Browse 98+ international schools in Doha. Compare curricula, facilities, and fees to find the perfect educational environment for your child."
          primaryCta={{ text: 'Start Searching', href: '#filters' }}
          secondaryCta={{ text: 'Compare Fees', href: '/fees' }}
          theme="school"
        />

        {/* Main Content */}
        <main className="container-responsive py-12">
          {/* Modern Filters Section */}
          <div id="filters" className="card card-glass p-8 mb-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Find Your Perfect School</h2>
                <p className="text-gray-600">Use filters below to narrow down your search</p>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={() => {
                    setFilters({ page: 1, page_size: filters.page_size });
                    router.push('/schools', undefined, { shallow: true });
                  }}
                  className="btn btn-secondary"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear All Filters
                </button>
              )}
            </div>

            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Input
                  label="School Name"
                  placeholder="Search by name..."
                  value={filters.search || ''}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />

                <Select
                  label="Curriculum"
                  options={CURRICULUM_OPTIONS}
                  value={filters.curriculum || ''}
                  onChange={(e) => handleFilterChange('curriculum', e.target.value)}
                />

                <Select
                  label="School Type"
                  options={TYPE_OPTIONS}
                  value={filters.type || ''}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                />

                <Input
                  label="Location"
                  placeholder="Search by area..."
                  value={filters.location || ''}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                />
              </div>
            </form>

            {/* Active Filters Tags */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-600 font-medium">Active Filters:</span>
                {filters.search && (
                  <span className="badge badge-primary">
                    Name: {filters.search}
                    <button
                      onClick={() => handleFilterChange('search', '')}
                      className="ml-2 hover:text-red-600"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.curriculum && (
                  <span className="badge badge-primary">
                    {filters.curriculum}
                    <button
                      onClick={() => handleFilterChange('curriculum', '')}
                      className="ml-2 hover:text-red-600"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.type && (
                  <span className="badge badge-success">
                    {filters.type}
                    <button
                      onClick={() => handleFilterChange('type', '')}
                      className="ml-2 hover:text-red-600"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.location && (
                  <span className="badge badge-purple">
                    Location: {filters.location}
                    <button
                      onClick={() => handleFilterChange('location', '')}
                      className="ml-2 hover:text-red-600"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Results Count and View Toggle */}
          {data && (
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="text-lg font-semibold text-gray-900">
                    {data.total} {data.total === 1 ? 'school' : 'schools'} found
                  </p>
                </div>
                {hasActiveFilters && (
                  <span className="badge badge-warning">Filtered</span>
                )}
              </div>

              <div className="flex gap-2 flex-wrap">
                <Link href="/fees">
                  <button className="px-4 py-2 rounded-xl font-medium transition-all bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:scale-105">
                    <span className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Compare All Fees
                    </span>
                  </button>
                </Link>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    viewMode === 'grid'
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    Grid
                  </span>
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    viewMode === 'map'
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    Map
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <LoadingSkeleton.SchoolCard key={i} />
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="card bg-red-50 border-2 border-red-200 p-6 text-center">
              <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-xl font-bold text-red-800 mb-2">Oops! Something went wrong</h3>
              <p className="text-red-700 mb-4">{error}</p>
              <button
                onClick={fetchSchools}
                className="btn btn-accent"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Try Again
              </button>
            </div>
          )}

          {/* Schools Grid or Map */}
          {!loading && data && data.results.length > 0 && (
            <>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                  {data.results.map((school) => (
                    <SchoolCard key={school.id} school={school} />
                  ))}
                </div>
              ) : (
                <div className="mb-10">
                  {loadingMap ? (
                    <div className="card p-12 text-center">
                      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-600 font-medium">Loading all schools on map...</p>
                      <p className="text-gray-500 text-sm mt-2">Fetching {data.total} schools with location data</p>
                    </div>
                  ) : (
                    <>
                      {/* Map Stats Card */}
                      <div className="card p-4 mb-4 bg-gradient-to-r from-blue-50 to-cyan-50">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-gray-900">
                                Showing {allSchools.filter(s => s.latitude && s.longitude).length} schools on map
                              </h3>
                              <p className="text-sm text-gray-600">
                                {data.total} total schools match your filters
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-green-700 bg-green-100 px-4 py-2 rounded-lg font-medium">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            Interactive Map
                          </div>
                        </div>
                      </div>
                      {/* Map Container */}
                      <div className="card overflow-hidden">
                        <div className="h-[600px] w-full">
                          <SchoolMap schools={allSchools} />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </>
          )}

          {/* No Results */}
          {!loading && data && data.results.length === 0 && (
            <div className="card p-12 text-center">
              <div className="max-w-md mx-auto">
                <svg
                  className="w-24 h-24 text-gray-300 mx-auto mb-6"
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
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  No schools found
                </h3>
                <p className="text-gray-600 mb-6">
                  We couldn't find any schools matching your criteria. Try adjusting your filters or search terms.
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={() => {
                      setFilters({ page: 1, page_size: filters.page_size });
                      router.push('/schools', undefined, { shallow: true });
                    }}
                    className="btn btn-primary"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Pagination */}
          {viewMode === 'grid' && data && totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 flex-wrap">
              <button
                onClick={() => handlePageChange(data.page - 1)}
                disabled={data.page === 1}
                className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>

              <div className="flex gap-2 flex-wrap justify-center">
                {getPaginationNumbers().map((page, index) => (
                  page === '...' ? (
                    <span
                      key={`ellipsis-${index}`}
                      className="px-4 py-2 text-gray-500 font-semibold"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page as number)}
                      className={`px-4 py-2 rounded-xl font-semibold transition-all min-w-[44px] ${
                        page === data.page
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg scale-110'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      {page}
                    </button>
                  )
                ))}
              </div>

              <button
                onClick={() => handlePageChange(data.page + 1)}
                disabled={data.page === totalPages}
                className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
