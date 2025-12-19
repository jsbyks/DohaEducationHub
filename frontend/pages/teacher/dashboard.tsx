import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { useAuth } from '../../contexts/AuthContext';
import { teachersAPI, Teacher, bookingsAPI, Booking } from '../../lib/api';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { UPLOADS_BASE_URL } from '../../lib/api';

export default function TeacherDashboard() {
  const { user, logout } = useAuth();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'earnings' | 'calendar'>('overview');

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('Not authenticated');
        return;
      }

      // Fetch teacher profile and recent bookings in parallel
      const [profile, bookingsData] = await Promise.all([
        teachersAPI.getMyProfile(token),
        bookingsAPI.getMyBookings(token, undefined, 1, 5)
      ]);

      setTeacher(profile);
      setRecentBookings(bookingsData.results || []);
    } catch (err: any) {
      console.error('Failed to fetch dashboard data:', err);
      if (err.response?.status === 404) {
        setError('No teacher profile found. Please create one.');
      } else {
        setError('Failed to load dashboard data');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getImageUrl = (imagePath: string) => {
    if (imagePath.startsWith('/uploads/')) {
      return `${UPLOADS_BASE_URL}${imagePath.substring(8)}`;
    }
    return `${UPLOADS_BASE_URL}${imagePath}`;
  };

  const calculateProfileCompletion = (teacher: Teacher) => {
    let completed = 0;
    let total = 8;

    if (teacher.full_name) completed++;
    if (teacher.bio) completed++;
    if (teacher.profile_image) completed++;
    if (teacher.specializations?.length) completed++;
    if (teacher.hourly_rate_online || teacher.hourly_rate_qatari) completed++;
    if (teacher.city) completed++;
    if (teacher.phone) completed++;
    if (teacher.languages?.length) completed++;

    return Math.round((completed / total) * 100);
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="text-red-600 mb-4 text-6xl">⚠️</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{error}</h2>
              <Link href="/teacher/create-profile">
                <Button size="lg">Create Teacher Profile</Button>
              </Link>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!teacher) return null;

  const profileCompletion = calculateProfileCompletion(teacher);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Modern Header */}
        <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {teacher.profile_image ? (
                    <img
                      src={getImageUrl(teacher.profile_image)}
                      alt={teacher.full_name}
                      className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-primary-500 border-4 border-white shadow-lg flex items-center justify-center">
                      <span className="text-2xl font-bold">{teacher.full_name.charAt(0)}</span>
                    </div>
                  )}
                  <div>
                    <h1 className="text-3xl font-bold">Welcome back, {teacher.full_name}!</h1>
                    <p className="text-primary-100 mt-1">Manage your teaching business</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {teacher.is_verified && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500 text-white">
                      ✓ Verified
                    </span>
                  )}
                  <Link href="/teacher/edit-profile">
                    <Button variant="outline" className="text-white border-white hover:bg-white hover:text-primary-600">
                      ✏️ Edit Profile
                    </Button>
                  </Link>
                  <Button variant="secondary" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-t border-primary-500">
              <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex space-x-8">
                  {[
                    { id: 'overview', label: 'Overview', icon: '📊' },
                    { id: 'bookings', label: 'Bookings', icon: '📅' },
                    { id: 'earnings', label: 'Earnings', icon: '💰' },
                    { id: 'calendar', label: 'Calendar', icon: '🗓️' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-white text-white'
                          : 'border-transparent text-primary-200 hover:text-white hover:border-primary-300'
                      }`}
                    >
                      <span className="mr-2">{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </div>
              </nav>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb Navigation */}
          <div className="mb-6">
            <nav className="flex items-center space-x-2 text-sm text-gray-600">
              <Link href="/dashboard" className="hover:text-primary-600 transition-colors">
                My Dashboard
              </Link>
              <span>/</span>
              <span className="text-gray-900 font-medium">Teacher Dashboard</span>
            </nav>
          </div>
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <span className="text-2xl">📚</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                      <p className="text-2xl font-bold text-gray-900">{teacher.total_sessions}</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-yellow-100 rounded-lg">
                      <span className="text-2xl">⭐</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Average Rating</p>
                      <p className="text-2xl font-bold text-gray-900">{teacher.average_rating.toFixed(1)}</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <span className="text-2xl">💰</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Monthly Earnings</p>
                      <p className="text-2xl font-bold text-gray-900">QAR 0</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <span className="text-2xl">👥</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                      <p className="text-2xl font-bold text-gray-900">{teacher.total_reviews}</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Profile & Settings Section */}
              <Card className="p-6 bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Profile & Settings</h3>
                    <p className="text-sm text-gray-600">Manage your teacher profile and account settings</p>
                  </div>
                  <div className="flex space-x-3">
                    <Link href="/teacher/edit-profile">
                      <Button variant="primary">
                        ✏️ Edit Profile
                      </Button>
                    </Link>
                    <Link href="/dashboard">
                      <Button variant="outline">
                        👤 Account Settings
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>

              {/* Profile Completion & Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Completion */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Status</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Completion</span>
                      <span className="font-medium">{profileCompletion}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${profileCompletion}%` }}
                      ></div>
                    </div>
                    <div className="flex space-x-2">
                      <Link href="/teacher/edit-profile" className="flex-1">
                        <Button size="sm" className="w-full">
                          ✏️ Edit Profile
                        </Button>
                      </Link>
                      {profileCompletion < 100 && (
                        <Link href="/teacher/edit-profile" className="flex-1">
                          <Button size="sm" variant="outline" className="w-full">
                            Complete
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </Card>

                {/* Quick Actions */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Link href="/teacher/bookings">
                      <Button variant="primary" className="w-full">
                        📅 Manage Bookings
                      </Button>
                    </Link>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" className="text-sm">
                        🗓️ Availability
                      </Button>
                      <Button variant="outline" className="text-sm">
                        💬 Messages
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" className="text-sm">
                        💰 Earnings
                      </Button>
                      <Button variant="outline" className="text-sm">
                        📊 Analytics
                      </Button>
                    </div>
                  </div>
                </Card>

                {/* Recent Activity */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {recentBookings.slice(0, 3).map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{booking.subject}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(booking.scheduled_date).toLocaleDateString()} • {booking.start_time}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                    ))}
                    {recentBookings.length === 0 && (
                      <p className="text-gray-500 text-sm">No recent bookings</p>
                    )}
                  </div>
                </Card>
              </div>

              {/* Teaching Details */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Teaching Profile</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Specializations</h4>
                    <div className="flex flex-wrap gap-2">
                      {teacher.specializations?.map((spec, index) => (
                        <span key={index} className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
                          {spec}
                        </span>
                      )) || <span className="text-gray-500">Not set</span>}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Grade Levels</h4>
                    <div className="flex flex-wrap gap-2">
                      {teacher.grade_levels?.map((level, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                          {level}
                        </span>
                      )) || <span className="text-gray-500">Not set</span>}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Pricing</h4>
                    <div className="space-y-1">
                      {teacher.teaches_online && teacher.hourly_rate_online && (
                        <p className="text-sm">Online: {teacher.hourly_rate_online} {teacher.currency}/hr</p>
                      )}
                      {teacher.teaches_in_person && teacher.hourly_rate_qatari && (
                        <p className="text-sm">In-person: {teacher.hourly_rate_qatari} {teacher.currency}/hr</p>
                      )}
                      {!teacher.hourly_rate_online && !teacher.hourly_rate_qatari && (
                        <span className="text-gray-500 text-sm">Not set</span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Recent Bookings</h3>
                <Link href="/teacher/bookings">
                  <Button>View All Bookings</Button>
                </Link>
              </div>
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-900">{booking.subject}</h4>
                        <p className="text-sm text-gray-600">
                          {booking.grade_level} • {booking.session_type === 'online' ? '🖥️ Online' : '📍 In-Person'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(booking.scheduled_date).toLocaleDateString()} at {booking.start_time}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                        <p className="text-lg font-bold text-primary-600 mt-1">
                          {booking.total_amount} {teacher.currency}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {recentBookings.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No bookings yet</p>
                    <p className="text-sm text-gray-400 mt-1">Your bookings will appear here</p>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Earnings Tab */}
          {activeTab === 'earnings' && (
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Earnings Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary-600">QAR 0</p>
                    <p className="text-sm text-gray-600">This Month</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">QAR 0</p>
                    <p className="text-sm text-gray-600">Total Earnings</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-600">QAR 0</p>
                    <p className="text-sm text-gray-600">Pending Payout</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payout History</h3>
                <div className="text-center py-8">
                  <p className="text-gray-500">No payout history available</p>
                  <p className="text-sm text-gray-400 mt-1">Payouts will appear here once processed</p>
                </div>
              </Card>
            </div>
          )}

          {/* Calendar Tab */}
          {activeTab === 'calendar' && (
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Availability Calendar</h3>
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🗓️</div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">Calendar Coming Soon</h4>
                <p className="text-gray-600 mb-6">Manage your availability and view upcoming sessions</p>
                <Button variant="outline">Set Up Availability</Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
