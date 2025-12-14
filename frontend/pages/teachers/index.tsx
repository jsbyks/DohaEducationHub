import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { teachersAPI, Teacher, TeacherSearchFilters } from '../../lib/api';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';

export default function TeachersPage() {
  const router = useRouter();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Search filters
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

  // Filter options
  const subjects = [
    'Mathematics', 'English', 'Science', 'Arabic', 'Physics', 'Chemistry',
    'Biology', 'History', 'Geography', 'Art', 'Music', 'Physical Education'
  ];

  const gradeLevels = [
    'KG', 'Primary', 'Secondary'
  ];

  const curricula = [
    'British', 'American', 'IB', 'CBSE', 'Canadian', 'Filipino', 'French'
  ];

  const cities = [
    'Doha', 'Al Wakrah', 'Lusail', 'Al Khor', 'Al Shamal'
  ];

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

      // Remove undefined values
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
    setCurrentPage(1); // Reset to first page when filtering
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
        <span key={i} className={`text-sm ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Find Private Tutors in Doha</h1>
            <p className="mt-2 text-lg text-gray-600">
              Connect with qualified teachers for personalized learning
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary-600 hover:text-primary-800"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-4">
                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <select
                    value={filters.subject || ''}
                    onChange={(e) => handleFilterChange('subject', e.target.value || undefined)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">All Subjects</option>
                    {subjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>

                {/* Grade Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Grade Level</label>
                  <select
                    value={filters.grade_level || ''}
                    onChange={(e) => handleFilterChange('grade_level', e.target.value || undefined)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">All Levels</option>
                    {gradeLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                {/* Curriculum */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Curriculum</label>
                  <select
                    value={filters.curriculum || ''}
                    onChange={(e) => handleFilterChange('curriculum', e.target.value || undefined)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">All Curricula</option>
                    {curricula.map(curriculum => (
                      <option key={curriculum} value={curriculum}>{curriculum}</option>
                    ))}
                  </select>
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <select
                    value={filters.city || ''}
                    onChange={(e) => handleFilterChange('city', e.target.value || undefined)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">All Cities</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                {/* Teaching Mode */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Teaching Mode</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.teaches_online === true}
                        onChange={(e) => handleFilterChange('teaches_online', e.target.checked || undefined)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Online</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.teaches_in_person === true}
                        onChange={(e) => handleFilterChange('teaches_in_person', e.target.checked || undefined)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">In-Person</span>
                    </label>
                  </div>
                </div>

                {/* Minimum Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Rating</label>
                  <select
                    value={filters.min_rating || ''}
                    onChange={(e) => handleFilterChange('min_rating', e.target.value ? parseFloat(e.target.value) : undefined)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Any Rating</option>
                    <option value="4.5">4.5+ Stars</option>
                    <option value="4.0">4.0+ Stars</option>
                    <option value="3.5">3.5+ Stars</option>
                  </select>
                </div>

                {/* Max Hourly Rate */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Hourly Rate (QAR)</label>
                  <select
                    value={filters.max_hourly_rate || ''}
                    onChange={(e) => handleFilterChange('max_hourly_rate', e.target.value ? parseFloat(e.target.value) : undefined)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.is_verified === true}
                      onChange={(e) => handleFilterChange('is_verified', e.target.checked || undefined)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Verified Teachers Only</span>
                  </label>
                </div>
              </div>

              <div className="mt-6">
                <Button onClick={searchTeachers} className="w-full">
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Finding the best teachers for you...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-500 text-lg font-semibold">Error</div>
                <p className="mt-2 text-gray-600">{error}</p>
                <Button onClick={searchTeachers} className="mt-4">
                  Try Again
                </Button>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <p className="text-gray-600">
                    Found {teachers.length} teachers
                    {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {teachers.map((teacher) => (
                    <Card key={teacher.id} className="hover:shadow-lg transition-shadow">
                      <div className="p-6">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">{teacher.full_name}</h3>
                            {teacher.is_verified && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                                ✓ Verified
                              </span>
                            )}
                          </div>
                          {teacher.is_featured && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              ⭐ Featured
                            </span>
                          )}
                        </div>

                        {/* Rating */}
                        <div className="flex items-center mb-3">
                          <div className="flex items-center">
                            {renderStars(Math.round(teacher.average_rating))}
                          </div>
                          <span className="ml-2 text-sm text-gray-600">
                            {teacher.average_rating.toFixed(1)} ({teacher.total_reviews} reviews)
                          </span>
                        </div>

                        {/* Experience */}
                        {teacher.years_experience && (
                          <p className="text-sm text-gray-600 mb-2">
                            {teacher.years_experience} years experience
                          </p>
                        )}

                        {/* Specializations */}
                        {teacher.specializations && teacher.specializations.length > 0 && (
                          <div className="mb-3">
                            <p className="text-sm text-gray-700 font-medium mb-1">Subjects:</p>
                            <div className="flex flex-wrap gap-1">
                              {teacher.specializations.slice(0, 3).map((subject, index) => (
                                <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                  {subject}
                                </span>
                              ))}
                              {teacher.specializations.length > 3 && (
                                <span className="text-xs text-gray-500">+{teacher.specializations.length - 3} more</span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Teaching Modes */}
                        <div className="mb-3">
                          <div className="flex gap-2">
                            {teacher.teaches_online && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                🖥️ Online
                              </span>
                            )}
                            {teacher.teaches_in_person && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                                📍 In-Person
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Pricing */}
                        <div className="mb-4">
                          <p className="text-sm text-gray-700 font-medium">Hourly Rates:</p>
                          <div className="flex gap-4 text-sm">
                            {teacher.hourly_rate_online && (
                              <span className="text-gray-600">
                                Online: {teacher.hourly_rate_online} QAR
                              </span>
                            )}
                            {teacher.hourly_rate_qatari && (
                              <span className="text-gray-600">
                                In-person: {teacher.hourly_rate_qatari} QAR
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Location */}
                        {teacher.city && (
                          <p className="text-sm text-gray-600 mb-4">
                            📍 {teacher.city}
                            {teacher.areas_served && teacher.areas_served.length > 0 && (
                              <span> + {teacher.areas_served.length} areas</span>
                            )}
                          </p>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Link href={`/teachers/${teacher.id}`}>
                            <Button variant="outline" size="sm" className="flex-1">
                              View Profile
                            </Button>
                          </Link>
                          <Button size="sm" className="flex-1">
                            Book Session
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>

                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                        if (pageNum > totalPages) return null;

                        return (
                          <Button
                            key={pageNum}
                            variant={pageNum === currentPage ? "primary" : "outline"}
                            onClick={() => setCurrentPage(pageNum)}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}

                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
