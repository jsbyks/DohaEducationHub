import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import Toast from '../../components/Toast';
import { bookingsAPI, Booking } from '../../lib/api';

export default function BookingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('');
  const [toast, setToast] = useState<{ message: string; type?: 'info' | 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (user) {
      loadBookings();
    }
  }, [user, filter]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      if (!token) return;

      const response = await bookingsAPI.getMyBookings(token, filter || undefined);
      setBookings(response.results || []);
    } catch (err) {
      console.error('Failed to load bookings:', err);
      setToast({ message: 'Failed to load bookings', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: number) => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      await bookingsAPI.cancel(bookingId, token);
      setToast({ message: 'Booking cancelled successfully', type: 'success' });
      loadBookings();
    } catch (err: any) {
      setToast({
        message: err.response?.data?.detail || 'Failed to cancel booking',
        type: 'error'
      });
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

  const getPaymentStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      refunded: 'bg-gray-100 text-gray-800',
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'}`}>
        Payment: {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
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
      <div className="min-h-screen bg-gray-50">
        {toast && <Toast message={toast.message} type={toast.type} onClose={clearToast} />}

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
            <p className="text-blue-100">View and manage your tutoring sessions</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Link */}
          <div className="mb-6">
            <Link href="/dashboard" className="text-primary-600 hover:text-primary-800">
              ← Back to Dashboard
            </Link>
          </div>

          {/* Filter Tabs */}
          <div className="bg-white rounded-lg shadow-md mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                {['', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
                  <button
                    key={status || 'all'}
                    onClick={() => setFilter(status)}
                    className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                      filter === status
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {status === '' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Bookings List */}
          {bookings.length === 0 ? (
            <Card>
              <div className="p-12 text-center">
                <div className="text-6xl mb-4">📚</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">No bookings yet</h2>
                <p className="text-gray-600 mb-6">
                  {filter ? `No ${filter} bookings found.` : 'Start by finding a teacher and booking your first session!'}
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
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">{booking.subject}</h3>
                          {getStatusBadge(booking.status)}
                          {getPaymentStatusBadge(booking.payment_status)}
                        </div>
                        {booking.grade_level && (
                          <p className="text-sm text-gray-600">Grade: {booking.grade_level}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary-600">{booking.total_amount.toFixed(2)} QAR</p>
                        <p className="text-sm text-gray-500">{booking.duration_hours} {booking.duration_hours === 1 ? 'hour' : 'hours'}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">
                          <strong>Date:</strong> {new Date(booking.scheduled_date).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Time:</strong> {booking.start_time} - {booking.end_time}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Type:</strong> {booking.session_type === 'online' ? '💻 Online' : '🏫 In-Person'}
                        </p>
                      </div>
                      <div>
                        {booking.location && (
                          <p className="text-sm text-gray-600">
                            <strong>Location:</strong> {booking.location}
                          </p>
                        )}
                        {booking.meeting_link && (
                          <p className="text-sm text-gray-600">
                            <strong>Meeting Link:</strong>{' '}
                            <a href={booking.meeting_link} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-800">
                              Join Session
                            </a>
                          </p>
                        )}
                        <p className="text-sm text-gray-600">
                          <strong>Booking ID:</strong> #{booking.id}
                        </p>
                      </div>
                    </div>

                    {booking.special_requests && (
                      <div className="mb-4 p-3 bg-gray-50 rounded">
                        <p className="text-sm text-gray-600">
                          <strong>Your Notes:</strong> {booking.special_requests}
                        </p>
                      </div>
                    )}

                    {booking.teacher_notes && (
                      <div className="mb-4 p-3 bg-blue-50 rounded">
                        <p className="text-sm text-gray-600">
                          <strong>Teacher Notes:</strong> {booking.teacher_notes}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-4 border-t border-gray-200">
                      <Link href={`/dashboard/bookings/${booking.id}`}>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </Link>

                      {booking.status === 'pending' && booking.payment_status === 'pending' && (
                        <Link href={`/dashboard/bookings/${booking.id}/pay`}>
                          <Button size="sm">
                            Pay Now
                          </Button>
                        </Link>
                      )}

                      {(booking.status === 'pending' || booking.status === 'confirmed') && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCancelBooking(booking.id)}
                          className="text-red-600 border-red-300 hover:bg-red-50"
                        >
                          Cancel Booking
                        </Button>
                      )}
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
