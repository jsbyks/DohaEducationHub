import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { useAuth } from '../../contexts/AuthContext';
import { teachersAPI, Teacher } from '../../lib/api';
import { Button } from '../../components/Button';

export default function TeacherDashboard() {
  const { user, logout } = useAuth();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchTeacherProfile();
    }
  }, [user]);

  const fetchTeacherProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('Not authenticated');
        return;
      }

      const profile = await teachersAPI.getMyProfile(token);
      setTeacher(profile);
    } catch (err: any) {
      console.error('Failed to fetch teacher profile:', err);
      if (err.response?.status === 404) {
        setError('No teacher profile found. Please create one.');
      } else {
        setError('Failed to load teacher profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold mb-2">Teacher Dashboard</h1>
            <p className="text-primary-100">Welcome, {teacher?.full_name || user?.full_name || user?.email}!</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Navigation */}
          <div className="mb-8">
            <Link href="/" className="text-primary-600 hover:text-primary-800">
              ← Back to Home
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : error ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center py-12">
                <div className="text-red-600 mb-4">⚠️ {error}</div>
                <Link href="/teacher/create-profile" className="text-primary-600 hover:text-primary-800 font-medium">
                  Create Teacher Profile →
                </Link>
              </div>
            </div>
          ) : teacher ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Overview */}
              <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{teacher.full_name}</h2>
                    {teacher.is_verified && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        ✓ Verified Teacher
                      </span>
                    )}
                  </div>
                  <Link href="/teacher/edit-profile">
                    <Button variant="secondary">Edit Profile</Button>
                  </Link>
                </div>

                {teacher.bio && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Bio</h3>
                    <p className="text-gray-900">{teacher.bio}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-1">Experience</h3>
                    <p className="text-gray-900">{teacher.years_experience || 0} years</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-1">Rating</h3>
                    <p className="text-gray-900">⭐ {teacher.average_rating.toFixed(1)} ({teacher.total_reviews} reviews)</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-1">Total Sessions</h3>
                    <p className="text-gray-900">{teacher.total_sessions}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-1">City</h3>
                    <p className="text-gray-900">{teacher.city || 'Not specified'}</p>
                  </div>
                </div>

                {/* Teaching Details */}
                <div className="space-y-4">
                  {teacher.specializations && teacher.specializations.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Specializations</h3>
                      <div className="flex flex-wrap gap-2">
                        {teacher.specializations.map((spec, index) => (
                          <span key={index} className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {teacher.grade_levels && teacher.grade_levels.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Grade Levels</h3>
                      <div className="flex flex-wrap gap-2">
                        {teacher.grade_levels.map((level, index) => (
                          <span key={index} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                            {level}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {teacher.curricula_expertise && teacher.curricula_expertise.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Curricula</h3>
                      <div className="flex flex-wrap gap-2">
                        {teacher.curricula_expertise.map((curriculum, index) => (
                          <span key={index} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                            {curriculum}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {teacher.languages && teacher.languages.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Languages</h3>
                      <div className="flex flex-wrap gap-2">
                        {teacher.languages.map((lang, index) => (
                          <span key={index} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Pricing */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4">Pricing</h3>
                  <div className="space-y-3">
                    {teacher.teaches_in_person && teacher.hourly_rate_qatari && (
                      <div>
                        <p className="text-sm text-gray-600">In-Person Rate</p>
                        <p className="text-2xl font-bold text-primary-600">{teacher.hourly_rate_qatari} {teacher.currency}/hr</p>
                      </div>
                    )}
                    {teacher.teaches_online && teacher.hourly_rate_online && (
                      <div>
                        <p className="text-sm text-gray-600">Online Rate</p>
                        <p className="text-2xl font-bold text-primary-600">{teacher.hourly_rate_online} {teacher.currency}/hr</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Teaching Mode */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4">Teaching Mode</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <span className={`w-3 h-3 rounded-full mr-2 ${teacher.teaches_online ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      <span className={teacher.teaches_online ? 'text-gray-900' : 'text-gray-500'}>Online Sessions</span>
                    </div>
                    <div className="flex items-center">
                      <span className={`w-3 h-3 rounded-full mr-2 ${teacher.teaches_in_person ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      <span className={teacher.teaches_in_person ? 'text-gray-900' : 'text-gray-500'}>In-Person Sessions</span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    <Button variant="primary" className="w-full">
                      View Bookings
                    </Button>
                    <Button variant="secondary" className="w-full">
                      View Reviews
                    </Button>
                    <Button variant="secondary" className="w-full">
                      Manage Availability
                    </Button>
                    <Button onClick={handleLogout} variant="secondary" className="w-full">
                      Logout
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </ProtectedRoute>
  );
}
