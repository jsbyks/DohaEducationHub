import React, { useState, useEffect, useCallback } from 'react';
import { schoolsAPI, School } from '../lib/api';
import SEO from '../components/SEO';
import Link from 'next/link';
import { ModernHero } from '../components/ModernHero';
import { LoadingSkeleton } from '../components/LoadingSkeleton';

export default function FeesComparisonPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [curriculumFilter, setCurriculumFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'avgFee'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    fetchAllSchools();
  }, []);

  const fetchAllSchools = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all schools by paginating (backend max page_size is 100)
      let allSchools: School[] = [];
      let currentPage = 1;
      let hasMore = true;

      while (hasMore) {
        const response = await schoolsAPI.list({ page: currentPage, page_size: 100 });
        allSchools = [...allSchools, ...response.results];

        // Check if there are more pages
        const totalPages = Math.ceil(response.total / response.page_size);
        hasMore = currentPage < totalPages;
        currentPage++;
      }

      setSchools(allSchools);
      setFilteredSchools(allSchools);
    } catch (err: any) {
      setError(err.message || 'Failed to load schools');
      console.error('Error fetching schools:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate average fee from fee_structure
  const calculateAverageFee = (feeStructure: any): number => {
    if (!feeStructure || typeof feeStructure !== 'object') return 0;

    const fees: number[] = [];
    Object.values(feeStructure).forEach((value: any) => {
      if (typeof value === 'string') {
        // Extract number from strings like "QR 36,000/year"
        const match = value.match(/[\d,]+/);
        if (match) {
          const numStr = match[0].replace(/,/g, '');
          const num = parseInt(numStr);
          if (!isNaN(num)) fees.push(num);
        }
      } else if (typeof value === 'number') {
        fees.push(value);
      }
    });

    if (fees.length === 0) return 0;
    return Math.round(fees.reduce((a, b) => a + b, 0) / fees.length);
  };

  // Extract fee for specific grade
  const getFeeForGrade = (feeStructure: any, gradeName: string): string => {
    if (!feeStructure || typeof feeStructure !== 'object') return '-';

    // Try exact match first
    if (feeStructure[gradeName]) {
      const fee = feeStructure[gradeName];
      if (typeof fee === 'string') return fee;
      if (typeof fee === 'number') return `QR ${fee.toLocaleString()}`;
    }

    // Try partial matches for grade names
    const key = Object.keys(feeStructure).find(k =>
      k.toLowerCase().includes(gradeName.toLowerCase()) ||
      gradeName.toLowerCase().includes(k.toLowerCase())
    );

    if (key) {
      const fee = feeStructure[key];
      if (typeof fee === 'string') return fee;
      if (typeof fee === 'number') return `QR ${fee.toLocaleString()}`;
    }

    return '-';
  };

  // Get unique curricula
  const getCurricula = () => {
    const curricula = new Set(schools.map(s => s.curriculum).filter(Boolean));
    return Array.from(curricula).sort();
  };

  // Get unique types
  const getTypes = () => {
    const types = new Set(schools.map(s => s.type).filter(Boolean));
    return Array.from(types).sort();
  };

  // Apply filters
  useEffect(() => {
    let result = [...schools];

    // Search filter
    if (searchTerm) {
      result = result.filter(school =>
        school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.address?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Curriculum filter
    if (curriculumFilter) {
      result = result.filter(school => school.curriculum === curriculumFilter);
    }

    // Type filter
    if (typeFilter) {
      result = result.filter(school => school.type === typeFilter);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else {
        const avgA = calculateAverageFee(a.fee_structure);
        const avgB = calculateAverageFee(b.fee_structure);
        return sortOrder === 'asc' ? avgA - avgB : avgB - avgA;
      }
    });

    setFilteredSchools(result);
    setCurrentPage(1); // Reset to page 1 when filters change
  }, [searchTerm, curriculumFilter, typeFilter, sortBy, sortOrder, schools]);

  const handleSort = (column: 'name' | 'avgFee') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredSchools.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSchools = filteredSchools.slice(startIndex, endIndex);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
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
    }

    return pages;
  };

  return (
    <>
      <SEO
        title="School Fees Comparison - Compare Tuition Costs in Doha"
        description="Compare school fees and tuition costs across all schools in Doha, Qatar. View detailed fee structures by grade level for kindergartens, primary and secondary schools."
        path="/fees"
      />

      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-50">
        {/* Hero Section */}
        <ModernHero
          title="School Fees Comparison"
          subtitle="Compare tuition costs across all schools in Doha. View detailed fee structures by grade level to find the best value for your child's education."
          primaryCta={{ text: 'View All Schools', href: '/schools' }}
          secondaryCta={{ text: 'Compare Schools', href: '/schools/compare' }}
          theme="education"
        />

        {/* Main Content */}
        <main className="container-responsive py-12">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card card-gradient p-6 text-center">
              <div className="text-4xl font-bold gradient-text-ocean mb-2">{schools.length}</div>
              <div className="text-gray-600 font-medium">Total Schools</div>
            </div>
            <div className="card card-gradient p-6 text-center">
              <div className="text-4xl font-bold gradient-text-sunset mb-2">{getCurricula().length}</div>
              <div className="text-gray-600 font-medium">Curricula Available</div>
            </div>
            <div className="card card-gradient p-6 text-center">
              <div className="text-4xl font-bold gradient-text-ocean mb-2">{filteredSchools.length}</div>
              <div className="text-gray-600 font-medium">Schools Shown</div>
            </div>
          </div>

          {/* Filters Section */}
          <div className="card card-glass p-6 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Filter & Search</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Schools
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="School name or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field pl-10"
                  />
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Curriculum Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Curriculum
                </label>
                <select
                  value={curriculumFilter}
                  onChange={(e) => setCurriculumFilter(e.target.value)}
                  className="input-field"
                >
                  <option value="">All Curricula</option>
                  {getCurricula().map(curriculum => (
                    <option key={curriculum} value={curriculum}>{curriculum}</option>
                  ))}
                </select>
              </div>

              {/* Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  School Type
                </label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="input-field"
                >
                  <option value="">All Types</option>
                  {getTypes().map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [col, order] = e.target.value.split('-');
                    setSortBy(col as 'name' | 'avgFee');
                    setSortOrder(order as 'asc' | 'desc');
                  }}
                  className="input-field"
                >
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="avgFee-asc">Fee (Low to High)</option>
                  <option value="avgFee-desc">Fee (High to Low)</option>
                </select>
              </div>
            </div>

            {/* Active Filters */}
            {(searchTerm || curriculumFilter || typeFilter) && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-600 font-medium">Active Filters:</span>
                {searchTerm && (
                  <span className="badge badge-primary">
                    Search: {searchTerm}
                    <button onClick={() => setSearchTerm('')} className="ml-2">×</button>
                  </span>
                )}
                {curriculumFilter && (
                  <span className="badge badge-primary">
                    {curriculumFilter}
                    <button onClick={() => setCurriculumFilter('')} className="ml-2">×</button>
                  </span>
                )}
                {typeFilter && (
                  <span className="badge badge-success">
                    {typeFilter}
                    <button onClick={() => setTypeFilter('')} className="ml-2">×</button>
                  </span>
                )}
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setCurriculumFilter('');
                    setTypeFilter('');
                  }}
                  className="text-sm text-red-600 hover:text-red-800 font-medium"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 gap-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="card p-6">
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="card bg-red-50 border-2 border-red-200 p-8 text-center">
              <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-xl font-bold text-red-800 mb-2">Failed to Load Schools</h3>
              <p className="text-red-700 mb-4">{error}</p>
              <button onClick={fetchAllSchools} className="btn btn-accent">
                Try Again
              </button>
            </div>
          )}

          {/* Fees Table */}
          {!loading && !error && (
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600">
                    <tr>
                      <th className="sticky left-0 z-10 bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider min-w-[250px]">
                        School Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                        Curriculum
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                        Location
                      </th>
                      <th
                        className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider cursor-pointer hover:bg-white/10"
                        onClick={() => handleSort('avgFee')}
                      >
                        <div className="flex items-center gap-2">
                          Avg Fee/Year
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                          </svg>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedSchools.map((school, index) => {
                      const avgFee = calculateAverageFee(school.fee_structure);
                      return (
                        <tr
                          key={school.id}
                          className={`hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all ${
                            index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                          }`}
                        >
                          <td className="sticky left-0 z-10 px-6 py-4 whitespace-nowrap bg-inherit">
                            <div className="flex items-center">
                              <div>
                                <div className="text-sm font-bold text-gray-900 hover:text-blue-600">
                                  <Link href={`/schools/${school.id}`}>
                                    {school.name}
                                  </Link>
                                </div>
                                <div className="text-xs text-gray-500">ID: {school.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="badge badge-primary text-xs">
                              {school.curriculum || 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="badge badge-success text-xs">
                              {school.type || 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-700 max-w-[200px] truncate" title={school.address || ''}>
                              {school.address || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {avgFee > 0 ? (
                              <div className="text-sm font-bold gradient-text-ocean">
                                QR {avgFee.toLocaleString()}
                              </div>
                            ) : (
                              <span className="text-sm text-gray-400">No data</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <Link href={`/schools/${school.id}`}>
                              <button className="btn btn-secondary text-xs px-3 py-1">
                                View Details
                              </button>
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {filteredSchools.length === 0 && !loading && (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No schools found</h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your filters to see more results.
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setCurriculumFilter('');
                      setTypeFilter('');
                    }}
                    className="btn btn-primary"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Pagination */}
          {!loading && !error && filteredSchools.length > 0 && totalPages > 1 && (
            <div className="card p-6 mt-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Results info */}
                <div className="text-sm text-gray-600">
                  Showing <span className="font-semibold">{startIndex + 1}</span> to{' '}
                  <span className="font-semibold">{Math.min(endIndex, filteredSchools.length)}</span> of{' '}
                  <span className="font-semibold">{filteredSchools.length}</span> schools
                </div>

                {/* Page buttons */}
                <div className="flex items-center gap-2">
                  {/* Previous button */}
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-600 hover:text-white'
                    }`}
                  >
                    Previous
                  </button>

                  {/* Page numbers */}
                  <div className="hidden sm:flex items-center gap-1">
                    {getPageNumbers().map((page, index) => {
                      if (page === '...') {
                        return (
                          <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-400">
                            ...
                          </span>
                        );
                      }

                      const pageNum = page as number;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`min-w-[40px] px-3 py-2 rounded-lg font-medium transition-all ${
                            currentPage === pageNum
                              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
                              : 'bg-white text-gray-700 border border-gray-300 hover:bg-blue-50 hover:border-blue-300'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  {/* Mobile: just show current page */}
                  <div className="sm:hidden text-sm font-medium text-gray-700">
                    Page {currentPage} of {totalPages}
                  </div>

                  {/* Next button */}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:opacity-90'
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Info Card */}
          <div className="card hero-gradient p-8 mt-8 text-center">
            <div className="max-w-3xl mx-auto">
              <svg className="w-16 h-16 text-white mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-2xl font-bold text-white mb-4">
                Need More Detailed Fee Information?
              </h3>
              <p className="text-blue-100 text-lg mb-6">
                Click "View Details" on any school to see their complete fee structure broken down by grade level, registration fees, and additional costs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/schools">
                  <button className="btn bg-white text-blue-600 hover:bg-gray-100">
                    Browse All Schools
                  </button>
                </Link>
                <Link href="/schools/compare">
                  <button className="btn btn-secondary">
                    Compare Schools
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
