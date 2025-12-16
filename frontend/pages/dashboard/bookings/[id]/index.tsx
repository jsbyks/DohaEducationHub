import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ProtectedRoute } from '../../../../components/ProtectedRoute';
import { useAuth } from '../../../../contexts/AuthContext';
import { Card } from '../../../../components/Card';
import { Button } from '../../../../components/Button';
import Toast from '../../../../components/Toast';
import { bookingsAPI, Booking } from '../../../../lib/api';

export default function BookingDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type?: 'info' | 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (id && user) {
      loadBooking();
    }
  }, [id, user]);

  const loadBooking = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      if (!token) {
        router.push('/login');
        return;
      }

      const bookingId = parseInt(id as string);
      const bookingData = await bookingsAPI.getById(bookingId, token);
      setBooking(bookingData);
    } catch (err: any) {
      console.error('Failed to load booking:', err);
      setToast({
        message: err.response?.data?.detail || 'Failed to load booking',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!booking) return;

    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      await bookingsAPI.cancel(booking.id, token);
      setToast({ message: 'Booking cancelled successfully', type: 'success' });
      setTimeout(() => router.push('/dashboard/bookings'), 2000);
    } catch (err: any) {
      setToast({
        message: err.response?.data?.detail || 'Failed to cancel booking',
        type: 'error'
      });
    }
  };

  const clearToast = () => setToast(null);

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-4 py-2 rounded-full text-base font-medium ${styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      refunded: 'bg-gray-100 text-gray-800',
    };
    return (
      <span className={`px-3 py-2 rounded text-sm font-medium ${styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'}`}>
        Payment: {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
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

  if (!booking) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Card>
            <div className="p-12 text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Booking Not Found</h1>
              <Link href="/dashboard/bookings">
                <Button>Back to Bookings</Button>
              </Link>
            </div>
          </Card>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {toast && <Toast message={toast.message} type={toast.type} onClose={clearToast} />}

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold mb-2">Booking Details</h1>
            <p className="text-blue-100">Booking #{booking.id}</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Link */}
          <div className="mb-6">
            <Link href="/dashboard/bookings" className="text-primary-600 hover:text-primary-800">
              ← Back to Bookings
            </Link>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <div className="p-6 text-center">
                <p className="text-sm text-gray-600 mb-2">Booking Status</p>
                {getStatusBadge(booking.status)}
              </div>
            </Card>
            <Card>
              <div className="p-6 text-center">
                <p className="text-sm text-gray-600 mb-2">Payment Status</p>
                {getPaymentStatusBadge(booking.payment_status)}
              </div>
            </Card>
          </div>

          {/* Session Details */}
          <Card className="mb-6">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Session Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Subject</p>
                  <p className="text-lg font-semibold">{booking.subject}</p>
                </div>

                {booking.grade_level && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Grade Level</p>
                    <p className="text-lg font-semibold">{booking.grade_level}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-600 mb-1">Session Type</p>
                  <p className="text-lg font-semibold capitalize">
                    {booking.session_type === 'online' ? '💻 Online' : '🏫 In-Person'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Duration</p>
                  <p className="text-lg font-semibold">
                    {booking.duration_hours} {booking.duration_hours === 1 ? 'hour' : 'hours'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Date</p>
                  <p className="text-lg font-semibold">
                    {new Date(booking.scheduled_date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Time</p>
                  <p className="text-lg font-semibold">{booking.start_time} - {booking.end_time}</p>
                </div>

                {booking.location && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600 mb-1">Location</p>
                    <p className="text-lg font-semibold">{booking.location}</p>
                  </div>
                )}

                {booking.meeting_link && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600 mb-1">Meeting Link</p>
                    <a
                      href={booking.meeting_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-semibold text-primary-600 hover:text-primary-800"
                    >
                      Join Session →
                    </a>
                  </div>
                )}
              </div>

              {booking.special_requests && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">Your Special Requests</p>
                  <p className="text-gray-900">{booking.special_requests}</p>
                </div>
              )}

              {booking.teacher_notes && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">Teacher Notes</p>
                  <p className="text-gray-900">{booking.teacher_notes}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Payment Details */}
          <Card className="mb-6">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Information</h2>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Hourly Rate</span>
                  <span className="font-medium">{booking.hourly_rate.toFixed(2)} QAR/hr</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium">{booking.duration_hours} {booking.duration_hours === 1 ? 'hour' : 'hours'}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-300">
                  <span className="text-lg font-semibold">Total Amount</span>
                  <span className="text-2xl font-bold text-primary-600">{booking.total_amount.toFixed(2)} QAR</span>
                </div>
                <p className="text-sm text-gray-500">
                  Platform fee: {booking.commission_amount.toFixed(2)} QAR • Teacher receives: {booking.teacher_amount.toFixed(2)} QAR
                </p>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <Card>
            <div className="p-6">
              <div className="flex flex-wrap gap-4">
                {booking.status === 'pending' && booking.payment_status === 'pending' && (
                  <Link href={`/dashboard/bookings/${booking.id}/pay`}>
                    <Button size="lg">
                      Complete Payment
                    </Button>
                  </Link>
                )}

                {(booking.status === 'pending' || booking.status === 'confirmed') && (
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleCancelBooking}
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    Cancel Booking
                  </Button>
                )}

                <Link href="/dashboard/bookings">
                  <Button variant="outline" size="lg">
                    Back to All Bookings
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
