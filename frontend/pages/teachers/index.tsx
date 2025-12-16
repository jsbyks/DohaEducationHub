import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ModernHero } from '../../components/ModernHero';
import { teachersAPI, Teacher, TeacherSearchFilters } from '../../lib/api';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { imageApi } from '../../lib/imageApi';
import SEO from '../../components/SEO';

export default function TeachersPage() {
  const router = useRouter();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState<TeacherSearchFilters>({
    subject: '',
    grade_level: '',
    curriculum: '',
    city: '',
    teaches_online: undefined,
    teaches_in_person: undefined,
    min_rating: undefined,
    max_hourly_rate: undefined,
    language: '',
    is_verified: undefined,
  });

  const subjects = [
    'Mathematics', 'English', 'Science', 'Arabic', 'Physics', 'Chemistry',
    'Biology', 'History', 'Geography', 'Art', 'Music', 'Physical Education'
  ];

  const gradeLevels = ['KG', 'Primary', 'Secondary'];
  const curricula = ['British', 'American', 'IB', 'CBSE', 'Canadian', 'Filipino', 'French'];
  const cities = ['Doha', 'Al Wakrah', 'Lusail', 'Al Khor', 'Al Shamal'];

  useEffect(() => {
    searchTeachers();
  }, [currentPage]);

  const searchTeachers = async () => {
    try {
      setLoading(true);
      setError(null);

      const searchParams = {
        ...filters,
        page: currentPage,
        page_size: 12,
      };

      Object.keys(searchParams).forEach(key => {
        if (searchParams[key] === undefined || searchParams[key] === '') {
          delete searchParams[key];
        }
      });

      const response = await teachersAPI.search(searchParams);
      setTeachers(response.results);
      setTotalPages(Math.ceil(response.total / 12));
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load teachers');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof TeacherSearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      subject: '',
      grade_level: '',
      curriculum: '',
      city: '',
      teaches_online: undefined,
      teaches_in_person: undefined,
      min_rating: undefined,
      max_hourly_rate: undefined,
      language: '',
      is_verified: undefined,
    });
    setCurrentPage(1);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`text-lg ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== '' && v !== undefined);

  return (
    <>
      <SEO
        title="Find Expert Tutors in Doha, Qatar"
        description="Connect with 200+ qualified private tutors in Doha. Book sessions for Mathematics, English, Science, and more. Online and in-person tutoring available."
        path="/teachers"
      />

      <div className="min-h-screen">
        <ModernHero
          title="Find Your Perfect Tutor in Doha"
          subtitle="Connect with 200+ qualified teachers across all subjects. Get personalized learning with flexible online and in-person sessions."
          primaryCta={{ text: 'Browse Teachers', href: '#filters' }}
          secondaryCta={{ text: 'Become a Teacher', href: '/teacher/create-profile' }}
          theme="teacher"
        />

        <div className="container-responsive py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:col-span-1">
              <div id="filters" className="card card-glass p-6 sticky top-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-blue-600 hover:text-blue-800 font-semibold"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                    <select
                      value={filters.subject || ''}
                      onChange={(e) => handleFilterChange('subject', e.target.value || undefined)}
                      className="input-field"
                    >
                      <option value="">All Subjects</option>
                      {subjects.map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                  </div>

                  {/* Grade Level */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Grade Level</label>
                    <select
                      value={filters.grade_level || ''}
                      onChange={(e) => handleFilterChange('grade_level', e.target.value || undefined)}
                      className="input-field"
                    >
                      <option value="">All Levels</option>
                      {gradeLevels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>

                  {/* Curriculum */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Curriculum</label>
                    <select
                      value={filters.curriculum || ''}
                      onChange={(e) => handleFilterChange('curriculum', e.target.value || undefined)}
                      className="input-field"
                    >
                      <option value="">All Curricula</option>
                      {curricula.map(curriculum => (
                        <option key={curriculum} value={curriculum}>{curriculum}</option>
                      ))}
                    </select>
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                    <select
                      value={filters.city || ''}
                      onChange={(e) => handleFilterChange('city', e.target.value || undefined)}
                      className="input-field"
                    >
                      <option value="">All Cities</option>
                      {cities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>

                  {/* Teaching Mode */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Teaching Mode</label>
                    <div className="space-y-2">
                      <label className="flex items-center cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={filters.teaches_online === true}
                          onChange={(e) => handleFilterChange('teaches_online', e.target.checked || undefined)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">Online Sessions</span>
                      </label>
                      <label className="flex items-center cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={filters.teaches_in_person === true}
                          onChange={(e) => handleFilterChange('teaches_in_person', e.target.checked || undefined)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">In-Person Sessions</span>
                      </label>
                    </div>
                  </div>

                  {/* Minimum Rating */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Minimum Rating</label>
                    <select
                      value={filters.min_rating || ''}
                      onChange={(e) => handleFilterChange('min_rating', e.target.value ? parseFloat(e.target.value) : undefined)}
                      className="input-field"
                    >
                      <option value="">Any Rating</option>
                      <option value="4.5">4.5+ ⭐</option>
                      <option value="4.0">4.0+ ⭐</option>
                      <option value="3.5">3.5+ ⭐</option>
                    </select>
                  </div>

                  {/* Max Hourly Rate */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Max Rate (QAR/hr)</label>
                    <select
                      value={filters.max_hourly_rate || ''}
                      onChange={(e) => handleFilterChange('max_hourly_rate', e.target.value ? parseFloat(e.target.value) : undefined)}
                      className="input-field"
                    >
                      <option value="">Any Price</option>
                      <option value="50">Under 50 QAR</option>
                      <option value="100">Under 100 QAR</option>
                      <option value="150">Under 150 QAR</option>
                      <option value="200">Under 200 QAR</option>
                    </select>
                  </div>

                  {/* Verified Only */}
                  <div>
                    <label className="flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={filters.is_verified === true}
                        onChange={(e) => handleFilterChange('is_verified', e.target.checked || undefined)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-3 text-sm font-semibold text-gray-700 group-hover:text-gray-900">Verified Teachers Only</span>
                    </label>
                  </div>
                </div>

                <button onClick={searchTeachers} className="btn btn-primary w-full mt-6">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Apply Filters
                </button>
              </div>
            </aside>

            {/* Results */}
            <main className="lg:col-span-3">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <LoadingSkeleton.TeacherCard key={i} />
                  ))}
                </div>
              ) : error ? (
                <div className="card bg-red-50 border-2 border-red-200 p-8 text-center">
                  <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <h3 className="text-xl font-bold text-red-800 mb-2">Failed to Load Teachers</h3>
                  <p className="text-red-700 mb-4">{error}</p>
                  <button onClick={searchTeachers} className="btn btn-accent">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Try Again
                  </button>
                </div>
              ) : (
                <>
                  {/* Results Counter */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <p className="text-lg font-semibold text-gray-900">
                        {teachers.length} teachers found
                        {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
                      </p>
                    </div>
                    {hasActiveFilters && (
                      <span className="badge badge-warning">Filtered</span>
                    )}
                  </div>

                  {/* Teachers Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                    {teachers.map((teacher) => (
                      <Link key={teacher.id} href={`/teachers/${teacher.id}`}>
                        <article className="card card-hover group cursor-pointer h-full flex flex-col">
                          <div className="p-6 flex flex-col flex-grow">
                            {/* Header with Badges */}
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                                  {teacher.full_name}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                  {teacher.is_verified && (
                                    <span className="badge badge-success">
                                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                      </svg>
                                      Verified
                                    </span>
                                  )}
                                  {teacher.is_featured && (
                                    <span className="badge badge-warning">
                                      ⭐ Featured
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Rating */}
                            <div className="flex items-center gap-2 mb-4">
                              <div className="flex items-center">
                                {renderStars(Math.round(teacher.average_rating))}
                              </div>
                              <span className="text-sm font-semibold text-gray-700">
                                {teacher.average_rating.toFixed(1)}
                              </span>
                              <span className="text-sm text-gray-500">
                                ({teacher.total_reviews} reviews)
                              </span>
                            </div>

                            {/* Experience */}
                            {teacher.years_experience && (
                              <div className="flex items-center text-sm text-gray-600 mb-3">
                                <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                </svg>
                                {teacher.years_experience} years experience
                              </div>
                            )}

                            {/* Specializations */}
                            {teacher.specializations && teacher.specializations.length > 0 && (
                              <div className="mb-4">
                                <p className="text-sm font-semibold text-gray-700 mb-2">Subjects:</p>
                                <div className="flex flex-wrap gap-2">
                                  {teacher.specializations.slice(0, 3).map((subject, index) => (
                                    <span key={index} className="badge badge-primary">
                                      {subject}
                                    </span>
                                  ))}
                                  {teacher.specializations.length > 3 && (
                                    <span className="badge badge-purple">
                                      +{teacher.specializations.length - 3} more
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Teaching Modes */}
                            <div className="flex gap-2 mb-4">
                              {teacher.teaches_online && (
                                <span className="badge badge-success">
                                  🖥️ Online
                                </span>
                              )}
                              {teacher.teaches_in_person && (
                                <span className="badge badge-purple">
                                  📍 In-Person
                                </span>
                              )}
                            </div>

                            {/* Pricing */}
                            <div className="mb-4 p-3 bg-gray-50 rounded-xl">
                              <p className="text-sm font-semibold text-gray-700 mb-2">Hourly Rates:</p>
                              <div className="space-y-1 text-sm">
                                {teacher.hourly_rate_online && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Online:</span>
                                    <span className="font-semibold text-blue-600">{teacher.hourly_rate_online} QAR</span>
                                  </div>
                                )}
                                {teacher.hourly_rate_qatari && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">In-person:</span>
                                    <span className="font-semibold text-blue-600">{teacher.hourly_rate_qatari} QAR</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Location */}
                            {teacher.city && (
                              <div className="flex items-center text-sm text-gray-600 mb-4">
                                <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                </svg>
                                {teacher.city}
                                {teacher.areas_served && teacher.areas_served.length > 0 && (
                                  <span> + {teacher.areas_served.length} areas</span>
                                )}
                              </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-2 mt-auto">
                              <button className="btn btn-secondary flex-1 group">
                                View Profile
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </article>
                      </Link>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2">
                      <button
                        onClick={() => {
                          setCurrentPage(Math.max(1, currentPage - 1));
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        disabled={currentPage === 1}
                        className="btn btn-secondary disabled:opacity-50"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Previous
                      </button>

                      <div className="flex gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                          if (pageNum > totalPages) return null;

                          return (
                            <button
                              key={pageNum}
                              onClick={() => {
                                setCurrentPage(pageNum);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                                pageNum === currentPage
                                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                                  : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        onClick={() => {
                          setCurrentPage(Math.min(totalPages, currentPage + 1));
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        disabled={currentPage === totalPages}
                        className="btn btn-secondary disabled:opacity-50"
                      >
                        Next
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  )}
                </>
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
