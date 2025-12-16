import React, { useState, useEffect } from 'react';
import Toast from '../../components/Toast';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { teachersAPI, Teacher, bookingsAPI, BookingCreate } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { StripeCheckout } from '../../components/StripeCheckout';

export default function TeacherProfilePage() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();

  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type?: 'info' | 'success' | 'error' } | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingStep, setBookingStep] = useState<'details' | 'payment'>('details');
  const [createdBookingId, setCreatedBookingId] = useState<number | null>(null);

  // Booking form state
  const [bookingData, setBookingData] = useState<BookingCreate>({
    teacher_id: 0,
    subject: '',
    grade_level: '',
    session_type: 'online',
    duration_hours: 1,
    scheduled_date: '',
    start_time: '',
    location: '',
    special_requests: '',
  });

  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchTeacherData();
    }
  }, [id]);

  const fetchTeacherData = async () => {
    try {
      setLoading(true);
      setError(null);

      const teacherId = parseInt(id as string);
      const [teacherData, reviewsData] = await Promise.all([
        teachersAPI.getById(teacherId),
        teachersAPI.getReviews(teacherId),
      ]);

      setTeacher(teacherData);
      setReviews(reviewsData);
      setBookingData(prev => ({ ...prev, teacher_id: teacherId }));
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load teacher profile');
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      router.push('/login');
      return;
    }

    setBookingLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await bookingsAPI.create(bookingData, token);
      // Redirect to dedicated payment page for the created booking
      router.push(`/bookings/${response.id}/pay`);
    } catch (err: any) {
      setToast({ message: err.response?.data?.detail || 'Failed to submit booking request. Please try again.', type: 'error' })
    } finally {
      setBookingLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentIntent: any) => {
    try {
      // Confirm payment with backend
      const token = localStorage.getItem('access_token');
      if (!token) return;
      const base = process.env.NEXT_PUBLIC_BASE_URL || ''
      await fetch(`${base}/api/payments/confirm-payment/${encodeURIComponent(paymentIntent.id)}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      setToast({ message: 'Payment successful! Your booking is confirmed.', type: 'success' })
      setShowBookingForm(false);
      setBookingStep('details');

      // Reset form
      setBookingData({
        teacher_id: teacher?.id || 0,
        subject: '',
        grade_level: '',
        session_type: 'online',
        duration_hours: 1,
        scheduled_date: '',
        start_time: '',
        location: '',
        special_requests: '',
      });
      setCreatedBookingId(null);
    } catch (err: any) {
      setToast({ message: 'Payment confirmation failed. Please contact support.', type: 'error' })
    }
  };

  const handlePaymentError = (error: string) => {
    setToast({ message: 'Payment failed: ' + error, type: 'error' })
  };

  const clearToast = () => setToast(null)

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !teacher) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Teacher Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/teachers">
            <Button>Back to Teachers</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {toast && <Toast message={toast.message} type={toast.type} onClose={clearToast} />}
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/teachers" className="text-primary-600 hover:text-primary-800">
                ← Back to Teachers
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 mt-2">{teacher.full_name}</h1>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowBookingForm(true)}
                className="hidden sm:inline-flex"
              >
                Book Session
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Header */}
            <Card>
              <div className="p-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {teacher.profile_image ? (
                      <img
                        src={teacher.profile_image}
                        alt={teacher.full_name}
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-2xl font-bold text-primary-600">
                          {teacher.full_name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold text-gray-900">{teacher.full_name}</h2>
                      {teacher.is_verified && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          ✓ Verified
                        </span>
                      )}
                      {teacher.is_featured && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                          ⭐ Featured
                        </span>
                      )}
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center">
                        {renderStars(Math.round(teacher.average_rating))}
                      </div>
                      <span className="text-lg font-semibold text-gray-900">
                        {teacher.average_rating.toFixed(1)}
                      </span>
                      <span className="text-gray-600">
                        ({teacher.total_reviews} reviews, {teacher.total_sessions} sessions)
                      </span>
                    </div>

                    {/* Experience */}
                    {teacher.years_experience && (
                      <p className="text-gray-700 mb-2">
                        🎓 {teacher.years_experience} years of teaching experience
                      </p>
                    )}

                    {/* Bio */}
                    {teacher.bio && (
                      <p className="text-gray-700 mb-4">{teacher.bio}</p>
                    )}

                    {/* Teaching Modes */}
                    <div className="flex gap-2 mb-4">
                      {teacher.teaches_online && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                          🖥️ Online Teaching
                        </span>
                      )}
                      {teacher.teaches_in_person && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                          📍 In-Person Teaching
                        </span>
                      )}
                    </div>

                    {/* Pricing */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Hourly Rates</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {teacher.hourly_rate_online && (
                          <div>
                            <p className="text-sm text-gray-600">Online Sessions</p>
                            <p className="text-lg font-bold text-primary-600">
                              {teacher.hourly_rate_online} {teacher.currency}
                            </p>
                          </div>
                        )}
                        {teacher.hourly_rate_qatari && (
                          <div>
                            <p className="text-sm text-gray-600">In-Person Sessions</p>
                            <p className="text-lg font-bold text-primary-600">
                              {teacher.hourly_rate_qatari} {teacher.currency}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Specializations */}
            {teacher.specializations && teacher.specializations.length > 0 && (
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Subjects Taught</h3>
                  <div className="flex flex-wrap gap-2">
                    {teacher.specializations.map((subject, index) => (
                      <span key={index} className="inline-flex items-center px-3 py-2 rounded-full text-sm bg-blue-100 text-blue-800">
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {/* Grade Levels */}
            {teacher.grade_levels && teacher.grade_levels.length > 0 && (
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Grade Levels</h3>
                  <div className="flex flex-wrap gap-2">
                    {teacher.grade_levels.map((level, index) => (
                      <span key={index} className="inline-flex items-center px-3 py-2 rounded-full text-sm bg-green-100 text-green-800">
                        {level}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {/* Curriculum Expertise */}
            {teacher.curricula_expertise && teacher.curricula_expertise.length > 0 && (
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Curriculum Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {teacher.curricula_expertise.map((curriculum, index) => (
                      <span key={index} className="inline-flex items-center px-3 py-2 rounded-full text-sm bg-purple-100 text-purple-800">
                        {curriculum}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {/* Qualifications */}
            {teacher.qualifications && teacher.qualifications.length > 0 && (
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Qualifications</h3>
                  <ul className="space-y-2">
                    {teacher.qualifications.map((qualification, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-primary-600 mr-2">•</span>
                        <span className="text-gray-700">{qualification}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            )}

            {/* Languages */}
            {teacher.languages && teacher.languages.length > 0 && (
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {teacher.languages.map((language, index) => (
                      <span key={index} className="inline-flex items-center px-3 py-2 rounded-full text-sm bg-orange-100 text-orange-800">
                        {language}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {/* Reviews */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Reviews ({teacher.total_reviews})</h3>
                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.slice(0, 5).map((review, index) => (
                      <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center">
                            {renderStars(review.rating)}
                          </div>
                          <span className="text-sm text-gray-600">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        {review.comment && (
                          <p className="text-gray-700 mb-2">{review.comment}</p>
                        )}
                        {review.session_type && (
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {review.session_type === 'online' ? '🖥️ Online' : '📍 In-Person'}
                          </span>
                        )}
                      </div>
                    ))}
                    {teacher.total_reviews > 5 && (
                      <p className="text-center text-gray-600">
                        And {teacher.total_reviews - 5} more reviews...
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-600">No reviews yet.</p>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Contact Info */}
            <Card className="mb-6">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-3">
                  {teacher.city && (
                    <div className="flex items-start">
                      <span className="text-gray-400 mr-3 mt-0.5">📍</span>
                      <div>
                        <p className="font-medium text-gray-900">{teacher.city}</p>
                        {teacher.areas_served && teacher.areas_served.length > 0 && (
                          <p className="text-sm text-gray-600">
                            Serves: {teacher.areas_served.join(', ')}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {teacher.email && (
                    <div className="flex items-center">
                      <span className="text-gray-400 mr-3">✉️</span>
                      <p className="text-gray-700">{teacher.email}</p>
                    </div>
                  )}

                  {teacher.phone && (
                    <div className="flex items-center">
                      <span className="text-gray-400 mr-3">📞</span>
                      <p className="text-gray-700">{teacher.phone}</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Book Session Button */}
            <Card>
              <div className="p-6">
                <Button
                  onClick={() => setShowBookingForm(true)}
                  className="w-full mb-4"
                  size="lg"
                >
                  Book a Session
                </Button>
                <p className="text-sm text-gray-600 text-center">
                  Sessions are confirmed by the teacher within 24 hours
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>

        {/* Booking Modal */}
        {showBookingForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {bookingStep === 'details' ? 'Book a Session' : 'Complete Payment'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowBookingForm(false);
                      setBookingStep('details');
                      setCreatedBookingId(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                {/* Progress Indicator */}
                <div className="flex items-center mb-6">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    bookingStep === 'details' ? 'bg-primary-600 text-white' : 'bg-primary-100 text-primary-600'
                  }`}>
                    1
                  </div>
                  <div className={`flex-1 h-1 mx-2 ${
                    bookingStep === 'payment' ? 'bg-primary-600' : 'bg-gray-200'
                  }`}></div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    bookingStep === 'payment' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    2
                  </div>
                </div>

                {bookingStep === 'details' ? (
                  <form onSubmit={handleBookingSubmit} className="space-y-4">
                <Input
                  label="Subject"
                  value={bookingData.subject}
                  onChange={(e) => setBookingData(prev => ({ ...prev, subject: e.target.value }))}
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Grade Level</label>
                  <select
                    value={bookingData.grade_level}
                    onChange={(e) => setBookingData(prev => ({ ...prev, grade_level: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  >
                    <option value="">Select Grade Level</option>
                    <option value="KG">KG</option>
                    <option value="Primary">Primary</option>
                    <option value="Secondary">Secondary</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Session Type</label>
                  <select
                    value={bookingData.session_type}
                    onChange={(e) => setBookingData(prev => ({ ...prev, session_type: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {teacher.teaches_online && <option value="online">Online</option>}
                    {teacher.teaches_in_person && <option value="in_person">In-Person</option>}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Date"
                    type="date"
                    value={bookingData.scheduled_date}
                    onChange={(e) => setBookingData(prev => ({ ...prev, scheduled_date: e.target.value }))}
                    required
                  />

                  <Input
                    label="Start Time"
                    type="time"
                    value={bookingData.start_time}
                    onChange={(e) => setBookingData(prev => ({ ...prev, start_time: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (hours)</label>
                  <select
                    value={bookingData.duration_hours}
                    onChange={(e) => setBookingData(prev => ({ ...prev, duration_hours: parseFloat(e.target.value) }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value={1}>1 hour</option>
                    <option value={1.5}>1.5 hours</option>
                    <option value={2}>2 hours</option>
                  </select>
                </div>

                {bookingData.session_type === 'in_person' && (
                  <Input
                    label="Location"
                    value={bookingData.location}
                    onChange={(e) => setBookingData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g., Al Dafna, Doha"
                    required
                  />
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests (Optional)</label>
                  <textarea
                    value={bookingData.special_requests}
                    onChange={(e) => setBookingData(prev => ({ ...prev, special_requests: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows={3}
                    placeholder="Any specific topics or requirements..."
                  />
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Session Summary</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Teacher: {teacher.full_name}</p>
                    <p>Duration: {bookingData.duration_hours} hours</p>
                    <p>Type: {bookingData.session_type === 'online' ? 'Online' : 'In-Person'}</p>
                    {bookingData.scheduled_date && (
                      <p>Date: {new Date(bookingData.scheduled_date).toLocaleDateString()}</p>
                    )}
                    {bookingData.start_time && (
                      <p>Time: {bookingData.start_time}</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowBookingForm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={bookingLoading}
                    className="flex-1"
                  >
                    {bookingLoading ? 'Submitting...' : 'Continue to Payment'}
                  </Button>
                </div>
                </form>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-green-800 mb-2">Booking Created!</h3>
                      <p className="text-green-700">
                        Your booking request has been created. Now complete the secure payment to confirm your session.
                      </p>
                    </div>

                    {createdBookingId && (
                      <StripeCheckout
                        bookingId={createdBookingId}
                        amount={(() => {
                          // Calculate amount based on session type and teacher rates
                          if (bookingData.session_type === 'online' && teacher.hourly_rate_online) {
                            return teacher.hourly_rate_online * bookingData.duration_hours;
                          } else if (bookingData.session_type === 'in_person' && teacher.hourly_rate_qatari) {
                            return teacher.hourly_rate_qatari * bookingData.duration_hours;
                          }
                          return 0;
                        })()}
                        currency={teacher.currency || 'QAR'}
                        onSuccess={handlePaymentSuccess}
                        onError={handlePaymentError}
                      />
                    )}

                    <div className="flex gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setBookingStep('details')}
                        className="flex-1"
                      >
                        Back to Details
                      </Button>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
