import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { useAuth } from '../contexts/AuthContext';
import { reviewsAPI, favoritesAPI, schoolsAPI, teachersAPI, Review, Favorite, School, Teacher } from '../lib/api';
import { Button } from '../components/Button';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [favoriteSchools, setFavoriteSchools] = useState<School[]>([]);
  const [teacherProfile, setTeacherProfile] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'reviews' | 'favorites' | 'bookings'>('profile');

  useEffect(() => {
    // Check if onboarding is needed
    const onboardingComplete = localStorage.getItem('onboarding_complete');
    if (!onboardingComplete && user && !user.is_admin) {
      router.push('/onboarding');
      return;
    }

    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      if (!token) return;

      // Fetch reviews, favorites, and teacher profile in parallel
      const [reviewsData, favoritesData, teacherData] = await Promise.all([
        reviewsAPI.getMyReviews(token),
        favoritesAPI.list(token),
        teachersAPI.getMyProfile(token).catch(() => null), // Don't fail if no teacher profile
      ]);

      setReviews(reviewsData);
      setFavorites(favoritesData);
      setTeacherProfile(teacherData);

      // Fetch school details for favorites
      if (favoritesData.length > 0) {
        const schoolPromises = favoritesData.map(fav =>
          schoolsAPI.get(fav.school_id).catch(() => null)
        );
        const schools = await Promise.all(schoolPromises);
        setFavoriteSchools(schools.filter((s): s is School => s !== null));
      }
    } catch (err) {
      console.error('Failed to fetch user data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderStars = (rating: number) => {
    return '⭐'.repeat(rating);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold mb-2">My Dashboard</h1>
            <p className="text-primary-100">Welcome back, {user?.full_name || user?.email}!</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Navigation */}
          <div className="mb-8">
            <Link legacyBehavior href="/" className="text-primary-600 hover:text-primary-800">
              ← Back to Home
            </Link>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-md mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'profile'
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'reviews'
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  My Reviews ({reviews.length})
                </button>
                <button
                  onClick={() => setActiveTab('favorites')}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'favorites'
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Saved Schools ({favorites.length})
                </button>
                <Link href="/dashboard/bookings" className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300`}>
                  My Bookings
                </Link>
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-lg shadow-md p-6">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            ) : (
              <>
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold mb-4">Account Information</h2>
                      {teacherProfile && (
                        <div className="flex items-center space-x-3">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            👨‍🏫 Teacher
                          </span>
                          <Link href="/teacher/dashboard">
                            <Button variant="primary" size="sm">
                              Go to Teacher Dashboard
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <p className="text-gray-900">{user?.email}</p>
                      </div>

                      {user?.full_name && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                          <p className="text-gray-900">{user.full_name}</p>
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
                        <p className="text-gray-900">
                          {user?.is_admin ? 'Administrator' : teacherProfile ? 'Teacher & User' : 'User'}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Account Status</label>
                        <p className="text-gray-900">
                          {user?.is_active ? 'Active' : 'Inactive'}
                        </p>
                      </div>

                      {teacherProfile && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h3 className="font-semibold text-blue-900 mb-2">Teacher Profile</h3>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-blue-700">Rating:</span>
                              <span className="ml-2 font-medium">{teacherProfile.average_rating.toFixed(1)} ⭐</span>
                            </div>
                            <div>
                              <span className="text-blue-700">Sessions:</span>
                              <span className="ml-2 font-medium">{teacherProfile.total_sessions}</span>
                            </div>
                            <div>
                              <span className="text-blue-700">Reviews:</span>
                              <span className="ml-2 font-medium">{teacherProfile.total_reviews}</span>
                            </div>
                            <div>
                              <span className="text-blue-700">Status:</span>
                              <span className={`ml-2 font-medium ${teacherProfile.is_verified ? 'text-green-600' : 'text-yellow-600'}`}>
                                {teacherProfile.is_verified ? 'Verified' : 'Pending Verification'}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-6 border-t border-gray-200 space-y-3">
                      {!teacherProfile && (
                        <Link href="/teacher/create-profile">
                          <Button variant="primary" className="w-full">
                            🎓 Become a Teacher
                          </Button>
                        </Link>
                      )}
                      {teacherProfile && (
                        <div className="space-y-3">
                          <Link href="/teacher/dashboard">
                            <Button variant="primary" className="w-full">
                              👨‍🏫 Manage Teaching Business
                            </Button>
                          </Link>
                          <Link href="/teacher/edit-profile">
                            <Button variant="outline" className="w-full">
                              ✏️ Edit Teacher Profile
                            </Button>
                          </Link>
                        </div>
                      )}
                      <Button onClick={handleLogout} variant="secondary" className="w-full">
                        Logout
                      </Button>
                    </div>
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">My Reviews</h2>

                    {reviews.length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-gray-600 mb-4">You haven't submitted any reviews yet.</p>
                        <Link legacyBehavior href="/schools" className="text-primary-600 hover:text-primary-800 font-medium">
                          Browse Schools →
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {reviews.map((review) => (
                          <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <div className="text-lg">{renderStars(review.rating)}</div>
                                <p className="text-sm text-gray-500">{formatDate(review.created_at)}</p>
                              </div>
                              {getStatusBadge(review.status)}
                            </div>
                            {review.comment && (
                              <p className="text-gray-700 mt-2">{review.comment}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Favorites Tab */}
                {activeTab === 'favorites' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Saved Schools</h2>

                    {favoriteSchools.length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-gray-600 mb-4">You haven't saved any schools yet.</p>
                        <Link legacyBehavior href="/schools" className="text-primary-600 hover:text-primary-800 font-medium">
                          Browse Schools →
                        </Link>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {favoriteSchools.map((school) => (
                          <Link
                            key={school.id}
                            href={`/schools/${school.id}`}
                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                          >
                            <h3 className="font-semibold text-lg text-gray-900 mb-2">{school.name}</h3>
                            <div className="space-y-1 text-sm text-gray-600">
                              {school.curriculum && <p>📚 {school.curriculum}</p>}
                              {school.type && <p>🏫 {school.type}</p>}
                              {school.address && <p>📍 {school.address}</p>}
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
