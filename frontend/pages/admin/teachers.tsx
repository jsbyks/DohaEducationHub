import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { teachersAPI, Teacher } from '../../lib/api';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';

export default function AdminTeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'unverified' | 'pending'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('Authentication required');
        return;
      }

      // For admin, we'll need to add an admin endpoint to get all teachers
      // For now, we'll use the search API (without auth for demo)
      const response = await teachersAPI.search({});
      setTeachers(response.results);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load teachers');
    } finally {
      setLoading(false);
    }
  };

  const updateTeacherVerification = async (teacherId: number, isVerified: boolean, backgroundStatus?: string) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      // This would need an admin API endpoint
      // For now, we'll show a placeholder
      alert(`Teacher verification update: ${isVerified ? 'Verified' : 'Unverified'}`);
      await fetchTeachers(); // Refresh the list
    } catch (err) {
      console.error('Failed to update teacher verification:', err);
      alert('Failed to update teacher verification');
    }
  };

  const toggleFeaturedStatus = async (teacherId: number, isFeatured: boolean) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      // This would need an admin API endpoint
      alert(`Teacher featured status: ${isFeatured ? 'Featured' : 'Unfeatured'}`);
      await fetchTeachers(); // Refresh the list
    } catch (err) {
      console.error('Failed to update featured status:', err);
      alert('Failed to update featured status');
    }
  };

  const filteredTeachers = teachers.filter(teacher => {
    // Status filter
    if (statusFilter === 'verified' && !teacher.is_verified) return false;
    if (statusFilter === 'unverified' && teacher.is_verified) return false;
    if (statusFilter === 'pending' && teacher.background_check_status !== 'pending') return false;

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesName = teacher.full_name.toLowerCase().includes(searchLower);
      const matchesCity = teacher.city?.toLowerCase().includes(searchLower);
      const matchesSubjects = teacher.specializations?.some(subject =>
        subject.toLowerCase().includes(searchLower)
      );
      if (!matchesName && !matchesCity && !matchesSubjects) return false;
    }

    return true;
  });

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

  const getStatusColor = (teacher: Teacher) => {
    if (!teacher.is_verified) return 'bg-red-100 text-red-800';
    if (teacher.background_check_status === 'pending') return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getStatusText = (teacher: Teacher) => {
    if (!teacher.is_verified) return 'Unverified';
    if (teacher.background_check_status === 'pending') return 'Pending Check';
    return 'Verified';
  };

  return (
    <ProtectedRoute adminOnly={true}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <Link href="/admin" className="text-primary-600 hover:text-primary-800">
                  ← Back to Admin Dashboard
                </Link>
                <h1 className="text-3xl font-bold text-gray-900 mt-2">Teacher Management</h1>
                <p className="text-gray-600 mt-1">Verify and manage teacher profiles on the platform</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{filteredTeachers.length}</div>
                <div className="text-sm text-gray-600">Total Teachers</div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters */}
          <Card className="mb-8">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <input
                    type="text"
                    placeholder="Search by name, city, or subject..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="all">All Teachers</option>
                    <option value="verified">Verified Only</option>
                    <option value="unverified">Unverified Only</option>
                    <option value="pending">Pending Review</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <Button onClick={fetchTeachers} className="w-full">
                    Refresh List
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Teachers List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading teachers...</p>
            </div>
          ) : error ? (
            <Card>
              <div className="p-6 text-center">
                <div className="text-red-500 text-lg font-semibold">Error</div>
                <p className="mt-2 text-gray-600">{error}</p>
                <Button onClick={fetchTeachers} className="mt-4">
                  Try Again
                </Button>
              </div>
            </Card>
          ) : (
            <div className="space-y-6">
              {filteredTeachers.map((teacher) => (
                <Card key={teacher.id} className="hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-xl font-semibold text-gray-900">{teacher.full_name}</h3>
                          {teacher.is_verified && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              ✓ Verified
                            </span>
                          )}
                          {teacher.is_featured && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              ⭐ Featured
                            </span>
                          )}
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(teacher)}`}>
                            {getStatusText(teacher)}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">Rating</p>
                            <div className="flex items-center gap-1">
                              {renderStars(Math.round(teacher.average_rating))}
                              <span className="text-sm font-medium ml-1">
                                {teacher.average_rating.toFixed(1)} ({teacher.total_reviews})
                              </span>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Experience</p>
                            <p className="font-medium">{teacher.years_experience || 0} years</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Location</p>
                            <p className="font-medium">{teacher.city || 'Not specified'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Sessions</p>
                            <p className="font-medium">{teacher.total_sessions}</p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-1">Subjects:</p>
                          <div className="flex flex-wrap gap-1">
                            {teacher.specializations?.slice(0, 4).map((subject, index) => (
                              <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                {subject}
                              </span>
                            ))}
                            {teacher.specializations && teacher.specializations.length > 4 && (
                              <span className="text-xs text-gray-500">+{teacher.specializations.length - 4} more</span>
                            )}
                          </div>
                        </div>

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

                      <div className="ml-6 flex flex-col gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedTeacher(teacher);
                            setShowDetailsModal(true);
                          }}
                        >
                          View Details
                        </Button>

                        {!teacher.is_verified ? (
                          <Button
                            size="sm"
                            onClick={() => updateTeacherVerification(teacher.id, true)}
                          >
                            Verify Teacher
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateTeacherVerification(teacher.id, false)}
                          >
                            Unverify
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant={teacher.is_featured ? "secondary" : "outline"}
                          onClick={() => toggleFeaturedStatus(teacher.id, !teacher.is_featured)}
                        >
                          {teacher.is_featured ? 'Unfeature' : 'Feature'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}

              {filteredTeachers.length === 0 && (
                <Card>
                  <div className="p-6 text-center">
                    <p className="text-gray-600">No teachers found matching your criteria.</p>
                  </div>
                </Card>
              )}
            </div>
          )}
        </div>

        {/* Teacher Details Modal */}
        {showDetailsModal && selectedTeacher && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">{selectedTeacher.full_name}</h2>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium">{selectedTeacher.email || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-medium">{selectedTeacher.phone || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">City</p>
                        <p className="font-medium">{selectedTeacher.city || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Experience</p>
                        <p className="font-medium">{selectedTeacher.years_experience || 0} years</p>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold mt-6 mb-4">Qualifications</h3>
                    <div className="space-y-2">
                      {selectedTeacher.qualifications && selectedTeacher.qualifications.length > 0 ? (
                        selectedTeacher.qualifications.map((qual, index) => (
                          <div key={index} className="flex items-start">
                            <span className="text-primary-600 mr-2">•</span>
                            <span className="text-gray-700">{qual}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-600">No qualifications listed</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Teaching Information</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">Grade Levels</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedTeacher.grade_levels?.map((level, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                              {level}
                            </span>
                          )) || <span className="text-gray-600">Not specified</span>}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600">Curriculum Expertise</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedTeacher.curricula_expertise?.map((curriculum, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                              {curriculum}
                            </span>
                          )) || <span className="text-gray-600">Not specified</span>}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600">Languages</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedTeacher.languages?.map((language, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                              {language}
                            </span>
                          )) || <span className="text-gray-600">Not specified</span>}
                        </div>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold mt-6 mb-4">Pricing</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      {selectedTeacher.hourly_rate_online && (
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">Online Sessions:</span>
                          <span className="font-medium">{selectedTeacher.hourly_rate_online} {selectedTeacher.currency}</span>
                        </div>
                      )}
                      {selectedTeacher.hourly_rate_qatari && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">In-Person Sessions:</span>
                          <span className="font-medium">{selectedTeacher.hourly_rate_qatari} {selectedTeacher.currency}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setShowDetailsModal(false)}>
                    Close
                  </Button>
                  <Link href={`/teachers/${selectedTeacher.id}`}>
                    <Button>View Public Profile</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
