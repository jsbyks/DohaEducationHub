import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import Toast from '../../components/Toast';

interface Review {
  id: number;
  school_id: number;
  user_id: number;
  rating: number;
  comment?: string;
  status: string;
  created_at: string;
  school?: {
    name: string;
  };
  user?: {
    email: string;
    full_name?: string;
  };
}

interface Teacher {
  id: number;
  user_id: number;
  full_name: string;
  email?: string;
  is_verified: boolean;
  is_featured: boolean;
  is_active: boolean;
  specializations?: string[];
  average_rating: number;
  total_reviews: number;
  created_at: string;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'teachers'>('overview');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type?: 'info' | 'success' | 'error' } | null>(null);

  // Data states
  const [pendingReviews, setPendingReviews] = useState<Review[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [stats, setStats] = useState({
    total_schools: 0,
    total_teachers: 0,
    pending_reviews: 0,
  });

  useEffect(() => {
    // Check if user is admin
    if (user && !user.is_admin) {
      router.push('/dashboard');
      return;
    }

    if (user && user.is_admin) {
      loadAdminData();
    }
  }, [user]);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      if (!token) return;

      const base = process.env.NEXT_PUBLIC_BASE_URL || '';

      // Load pending reviews
      const reviewsRes = await fetch(`${base}/api/proxy/api/reviews/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (reviewsRes.ok) {
        const reviewsData = await reviewsRes.json();
        setPendingReviews(reviewsData);
        setStats(prev => ({ ...prev, pending_reviews: reviewsData.length }));
      }

      // Load teachers
      const teachersRes = await fetch(`${base}/api/proxy/api/teachers/?page=1&page_size=100`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (teachersRes.ok) {
        const teachersData = await teachersRes.json();
        setTeachers(teachersData.results || teachersData);
        setStats(prev => ({ ...prev, total_teachers: teachersData.total || teachersData.length }));
      }

      // Load schools count
      const schoolsRes = await fetch(`${base}/api/proxy/api/schools/?page=1&page_size=1`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (schoolsRes.ok) {
        const schoolsData = await schoolsRes.json();
        setStats(prev => ({ ...prev, total_schools: schoolsData.total || 0 }));
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewAction = async (reviewId: number, status: 'approved' | 'rejected') => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      const base = process.env.NEXT_PUBLIC_BASE_URL || '';
      const response = await fetch(`${base}/api/proxy/api/reviews/${reviewId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update review status');
      }

      setToast({ message: `Review ${status} successfully`, type: 'success' });
      loadAdminData();
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to update review', type: 'error' });
    }
  };

  const handleTeacherVerification = async (teacherId: number, verified: boolean) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      const base = process.env.NEXT_PUBLIC_BASE_URL || '';
      const response = await fetch(`${base}/api/proxy/api/teachers/${teacherId}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ is_verified: verified }),
      });

      if (!response.ok) {
        throw new Error('Failed to update teacher verification');
      }

      setToast({ message: `Teacher ${verified ? 'verified' : 'unverified'} successfully`, type: 'success' });
      loadAdminData();
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to update teacher', type: 'error' });
    }
  };

  const handleTeacherFeatured = async (teacherId: number, featured: boolean) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      const base = process.env.NEXT_PUBLIC_BASE_URL || '';
      const response = await fetch(`${base}/api/proxy/api/teachers/${teacherId}/feature`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ is_featured: featured }),
      });

      if (!response.ok) {
        throw new Error('Failed to update teacher featured status');
      }

      setToast({ message: `Teacher ${featured ? 'featured' : 'unfeatured'} successfully`, type: 'success' });
      loadAdminData();
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to update teacher', type: 'error' });
    }
  };

  const clearToast = () => setToast(null);

  const renderStars = (rating: number) => {
    return '⭐'.repeat(Math.round(rating));
  };

  if (!user?.is_admin) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Card>
            <div className="p-12 text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
              <p className="text-gray-600 mb-6">You need administrator privileges to access this page.</p>
              <Link href="/dashboard">
                <Button>Go to Dashboard</Button>
              </Link>
            </div>
          </Card>
        </div>
      </ProtectedRoute>
    );
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {toast && <Toast message={toast.message} type={toast.type} onClose={clearToast} />}

        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-purple-100">Manage platform content and users</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <div className="p-6">
                  <div className="text-sm font-medium text-gray-600 mb-1">Total Schools</div>
                  <div className="text-3xl font-bold text-gray-900">{stats.total_schools}</div>
                </div>
              </Card>
              <Card>
                <div className="p-6">
                  <div className="text-sm font-medium text-gray-600 mb-1">Total Teachers</div>
                  <div className="text-3xl font-bold text-gray-900">{stats.total_teachers}</div>
                </div>
              </Card>
              <Card>
                <div className="p-6">
                  <div className="text-sm font-medium text-gray-600 mb-1">Pending Reviews</div>
                  <div className="text-3xl font-bold text-yellow-600">{stats.pending_reviews}</div>
                </div>
              </Card>
            </div>
          )}

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-md mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'overview'
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'reviews'
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Pending Reviews ({pendingReviews.length})
                </button>
                <button
                  onClick={() => setActiveTab('teachers')}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'teachers'
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Teachers ({teachers.length})
                </button>
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <Card>
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <Link href="/schools">
                        <Button variant="outline" className="w-full">
                          Manage Schools
                        </Button>
                      </Link>
                      <Button variant="outline" onClick={() => setActiveTab('teachers')} className="w-full">
                        Manage Teachers
                      </Button>
                      <Button variant="outline" onClick={() => setActiveTab('reviews')} className="w-full">
                        Review Moderation
                      </Button>
                      <Link href="/admin/posts">
                        <Button variant="outline" className="w-full">
                          Blog Management
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>

                {pendingReviews.length > 0 && (
                  <Card>
                    <div className="p-6">
                      <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Pending Reviews</h2>
                      <div className="space-y-4">
                        {pendingReviews.slice(0, 3).map((review) => (
                          <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="text-lg mb-1">{renderStars(review.rating)}</div>
                                <p className="text-gray-700">{review.comment}</p>
                                <p className="text-sm text-gray-500 mt-1">
                                  By {review.user?.full_name || review.user?.email} on{' '}
                                  {new Date(review.created_at).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="primary"
                                  onClick={() => handleReviewAction(review.id, 'approved')}
                                >
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleReviewAction(review.id, 'rejected')}
                                  className="text-red-600 border-red-300 hover:bg-red-50"
                                >
                                  Reject
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {pendingReviews.length > 3 && (
                        <Button
                          variant="outline"
                          onClick={() => setActiveTab('reviews')}
                          className="w-full mt-4"
                        >
                          View All {pendingReviews.length} Pending Reviews
                        </Button>
                      )}
                    </div>
                  </Card>
                )}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <Card>
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Review Moderation</h2>
                  {pendingReviews.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-600">No pending reviews to moderate.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {pendingReviews.map((review) => (
                        <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="text-2xl">{renderStars(review.rating)}</div>
                                <span className="text-sm text-gray-500">
                                  #{review.id}
                                </span>
                              </div>
                              <p className="text-gray-700 mb-3">{review.comment || 'No comment provided'}</p>
                              <div className="text-sm text-gray-600 space-y-1">
                                <p>
                                  <span className="font-medium">Reviewer:</span>{' '}
                                  {review.user?.full_name || review.user?.email}
                                </p>
                                <p>
                                  <span className="font-medium">School:</span> {review.school?.name || `School #${review.school_id}`}
                                </p>
                                <p>
                                  <span className="font-medium">Submitted:</span>{' '}
                                  {new Date(review.created_at).toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <Button
                                size="sm"
                                variant="primary"
                                onClick={() => handleReviewAction(review.id, 'approved')}
                              >
                                ✓ Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleReviewAction(review.id, 'rejected')}
                                className="text-red-600 border-red-300 hover:bg-red-50"
                              >
                                ✕ Reject
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Teachers Tab */}
            {activeTab === 'teachers' && (
              <Card>
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Teacher Management</h2>
                  <div className="space-y-4">
                    {teachers.map((teacher) => (
                      <div key={teacher.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{teacher.full_name}</h3>
                              {teacher.is_verified && (
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                                  ✓ Verified
                                </span>
                              )}
                              {teacher.is_featured && (
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                                  ⭐ Featured
                                </span>
                              )}
                              {!teacher.is_active && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded">
                                  Inactive
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-600 space-y-1">
                              {teacher.email && <p>📧 {teacher.email}</p>}
                              {teacher.specializations && teacher.specializations.length > 0 && (
                                <p>📚 {teacher.specializations.join(', ')}</p>
                              )}
                              <p>
                                ⭐ {teacher.average_rating.toFixed(1)} ({teacher.total_reviews} reviews)
                              </p>
                              <p className="text-xs text-gray-500">
                                Joined {new Date(teacher.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Link href={`/teachers/${teacher.id}`}>
                              <Button size="sm" variant="outline" className="w-full">
                                View Profile
                              </Button>
                            </Link>
                            <Button
                              size="sm"
                              variant={teacher.is_verified ? 'outline' : 'primary'}
                              onClick={() => handleTeacherVerification(teacher.id, !teacher.is_verified)}
                            >
                              {teacher.is_verified ? 'Unverify' : 'Verify'}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleTeacherFeatured(teacher.id, !teacher.is_featured)}
                              className={teacher.is_featured ? 'text-gray-600' : 'text-yellow-600 border-yellow-300'}
                            >
                              {teacher.is_featured ? 'Unfeature' : 'Feature'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
