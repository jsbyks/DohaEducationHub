import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import Toast from '../../components/Toast';

interface Booking {
  id: number;
  teacher_id: number;
  parent_id: number;
  subject: string;
  grade_level?: string;
  session_type: string;
  duration_hours: number;
  scheduled_date: string;
  start_time: string;
  end_time: string;
  location?: string;
  meeting_link?: string;
  status: string;
  payment_status: string;
  total_amount: number;
  currency?: string;
  special_requests?: string;
  teacher_notes?: string;
  created_at: string;
  teacher?: {
    id: number;
    full_name: string;
    profile_image?: string;
  };
}

export default function BookingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [toast, setToast] = useState<{ message: string; type?: 'info' | 'success' | 'error' } | null>(null);

  useEffect(() => {
    loadBookings();
  }, [statusFilter]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      if (!token) {
        router.push('/login');
        return;
      }

      const base = process.env.NEXT_PUBLIC_BASE_URL || '';
      const url = statusFilter
        ? `${base}/api/proxy/api/bookings/?status_filter=${statusFilter}`
        : `${base}/api/proxy/api/bookings/`;

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to load bookings');
      }

      const data = await response.json();
      setBookings(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getPaymentStatusBadge = (paymentStatus: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-purple-100 text-purple-800',
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${styles[paymentStatus as keyof typeof styles] || 'bg-gray-100 text-gray-800'}`}>
        Payment: {paymentStatus}
      </span>
    );
  };

  const handleCancelBooking = async (bookingId: number) => {
    if (!confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      const base = process.env.NEXT_PUBLIC_BASE_URL || '';
      const response = await fetch(`${base}/api/proxy/api/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Failed to cancel booking');
      }

      setToast({ message: 'Booking cancelled successfully', type: 'success' });
      loadBookings();
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to cancel booking', type: 'error' });
    }
  };

  const clearToast = () => setToast(null);

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
      <div className="min-h-screen bg-gray-50 py-8">
        {toast && <Toast message={toast.message} type={toast.type} onClose={clearToast} />}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
            <p className="mt-2 text-gray-600">View and manage your teacher session bookings</p>
          </div>

          {/* Filters */}
          <div className="mb-6">
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setStatusFilter('')}
                className={`px-4 py-2 rounded-md border transition-colors ${
                  statusFilter === ''
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-primary-600'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-4 py-2 rounded-md border transition-colors ${
                  statusFilter === 'pending'
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-primary-600'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setStatusFilter('confirmed')}
                className={`px-4 py-2 rounded-md border transition-colors ${
                  statusFilter === 'confirmed'
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-primary-600'
                }`}
              >
                Confirmed
              </button>
              <button
                onClick={() => setStatusFilter('completed')}
                className={`px-4 py-2 rounded-md border transition-colors ${
                  statusFilter === 'completed'
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-primary-600'
                }`}
              >
                Completed
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {bookings.length === 0 ? (
            <Card>
              <div className="p-12 text-center">
                <div className="text-6xl mb-4">📅</div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">No bookings yet</h2>
                <p className="text-gray-600 mb-6">
                  {statusFilter
                    ? `You don't have any ${statusFilter} bookings.`
                    : "You haven't booked any sessions yet. Find a teacher to get started!"
                  }
                </p>
                <Link href="/teachers">
                  <Button>Browse Teachers</Button>
                </Link>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <Card key={booking.id}>
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {booking.subject}
                          </h3>
                          {getStatusBadge(booking.status)}
                          {getPaymentStatusBadge(booking.payment_status)}
                        </div>

                        {booking.teacher && (
                          <div className="mb-3">
                            <Link
                              href={`/teachers/${booking.teacher_id}`}
                              className="text-primary-600 hover:text-primary-800 font-medium"
                            >
                              Teacher: {booking.teacher.full_name}
                            </Link>
                          </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                          <div>
                            <span className="font-medium">Date:</span>{' '}
                            {new Date(booking.scheduled_date).toLocaleDateString()}
                          </div>
                          <div>
                            <span className="font-medium">Time:</span>{' '}
                            {booking.start_time} - {booking.end_time}
                          </div>
                          <div>
                            <span className="font-medium">Duration:</span>{' '}
                            {booking.duration_hours} hours
                          </div>
                          <div>
                            <span className="font-medium">Type:</span>{' '}
                            {booking.session_type === 'online' ? '🖥️ Online' : '📍 In-Person'}
                          </div>
                          {booking.grade_level && (
                            <div>
                              <span className="font-medium">Grade:</span> {booking.grade_level}
                            </div>
                          )}
                          {booking.location && (
                            <div>
                              <span className="font-medium">Location:</span> {booking.location}
                            </div>
                          )}
                        </div>

                        {booking.meeting_link && booking.session_type === 'online' && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                            <p className="text-sm text-blue-800 font-medium mb-1">Online Meeting Link:</p>
                            <a
                              href={booking.meeting_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-sm underline"
                            >
                              {booking.meeting_link}
                            </a>
                          </div>
                        )}

                        {booking.special_requests && (
                          <div className="bg-gray-50 rounded-lg p-3 mb-3">
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">Special Requests:</span> {booking.special_requests}
                            </p>
                          </div>
                        )}

                        {booking.teacher_notes && (
                          <div className="bg-green-50 rounded-lg p-3 mb-3">
                            <p className="text-sm text-green-800">
                              <span className="font-medium">Teacher Notes:</span> {booking.teacher_notes}
                            </p>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                          <div>
                            <span className="text-2xl font-bold text-gray-900">
                              {booking.total_amount} {booking.currency || 'QAR'}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            Booked on {new Date(booking.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <div className="flex sm:flex-col gap-2">
                        {booking.payment_status === 'pending' && booking.status === 'pending' && (
                          <Link href={`/bookings/${booking.id}/pay`}>
                            <Button size="sm" className="w-full">
                              Pay Now
                            </Button>
                          </Link>
                        )}

                        {booking.status === 'pending' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCancelBooking(booking.id)}
                            className="w-full text-red-600 border-red-300 hover:bg-red-50"
                          >
                            Cancel
                          </Button>
                        )}

                        {booking.status === 'confirmed' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCancelBooking(booking.id)}
                            className="w-full text-red-600 border-red-300 hover:bg-red-50"
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
