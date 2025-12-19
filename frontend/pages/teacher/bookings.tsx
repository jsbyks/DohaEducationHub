import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import Toast from '../../components/Toast';

import { bookingsAPI, Booking } from '../../lib/api';

export default function TeacherBookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [updatingBooking, setUpdatingBooking] = useState<number | null>(null);
  const [teacherNotes, setTeacherNotes] = useState<{ [key: number]: string }>({});
  const [toast, setToast] = useState<{ message: string; type?: 'info' | 'success' | 'error' } | null>(null);

  useEffect(() => {
    loadBookings();
  }, [statusFilter]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('Not authenticated');
        return;
      }

      const data = await bookingsAPI.getTeacherBookings(token, statusFilter || undefined);
      setBookings(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: number, newStatus: string, notes?: string) => {
    try {
      setUpdatingBooking(bookingId);
      const token = localStorage.getItem('access_token');
      if (!token) return;

      await bookingsAPI.updateAsTeacher(bookingId, {
        status: newStatus,
        teacher_notes: notes,
      }, token);

      setToast({
        message: `Booking ${newStatus} successfully`,
        type: 'success'
      });
      loadBookings();
    } catch (err: any) {
      setToast({
        message: err.message || 'Failed to update booking',
        type: 'error'
      });
    } finally {
      setUpdatingBooking(null);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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

  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h2 className="text-red-800 font-semibold mb-2">Error Loading Bookings</h2>
              <p className="text-red-700">{error}</p>
              <Button onClick={loadBookings} className="mt-4">
                Try Again
              </Button>
            </div>
          </div>
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
            <p className="mt-2 text-gray-600">Manage your teaching session bookings</p>
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
                All ({bookings.length})
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-4 py-2 rounded-md border transition-colors ${
                  statusFilter === 'pending'
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-primary-600'
                }`}
              >
                Pending ({bookings.filter(b => b.status === 'pending').length})
              </button>
              <button
                onClick={() => setStatusFilter('confirmed')}
                className={`px-4 py-2 rounded-md border transition-colors ${
                  statusFilter === 'confirmed'
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-primary-600'
                }`}
              >
                Confirmed ({bookings.filter(b => b.status === 'confirmed').length})
              </button>
              <button
                onClick={() => setStatusFilter('completed')}
                className={`px-4 py-2 rounded-md border transition-colors ${
                  statusFilter === 'completed'
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-primary-600'
                }`}
              >
                Completed ({bookings.filter(b => b.status === 'completed').length})
              </button>
            </div>
          </div>

          {/* Bookings List */}
          <div className="space-y-6">
            {bookings.length === 0 ? (
              <Card>
                <div className="p-8 text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings found</h3>
                  <p className="text-gray-600">
                    {statusFilter
                      ? `No ${statusFilter} bookings at the moment.`
                      : 'You don\'t have any bookings yet.'
                    }
                  </p>
                </div>
              </Card>
            ) : (
              bookings.map((booking) => (
                <Card key={booking.id}>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {booking.subject}
                        </h3>
                        <p className="text-gray-600">
                          {booking.grade_level && `${booking.grade_level} • `}
                          {booking.session_type === 'online' ? '🖥️ Online' : '📍 In-Person'}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                        <p className="text-lg font-bold text-primary-600 mt-1">
                          {booking.total_amount} QAR
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Session Details</h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p>📅 {formatDate(booking.scheduled_date)}</p>
                          <p>🕐 {booking.start_time} - {booking.end_time}</p>
                          <p>⏱️ {booking.duration_hours} hours</p>
                          {booking.location && <p>📍 {booking.location}</p>}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Parent Information</h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p>👤 Parent ID: {booking.parent_id}</p>
                        </div>
                      </div>
                    </div>

                    {booking.special_requests && (
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Special Requests</h4>
                        <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                          {booking.special_requests}
                        </p>
                      </div>
                    )}

                    {booking.teacher_notes && (
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Your Notes</h4>
                        <p className="text-gray-700 bg-blue-50 p-3 rounded-md">
                          {booking.teacher_notes}
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                      {booking.status === 'pending' && (
                        <>
                          <Button
                            onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                            disabled={updatingBooking === booking.id}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            {updatingBooking === booking.id ? 'Confirming...' : 'Confirm Booking'}
                          </Button>
                          <Button
                            onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                            disabled={updatingBooking === booking.id}
                            variant="outline"
                            className="border-red-300 text-red-600 hover:bg-red-50"
                          >
                            {updatingBooking === booking.id ? 'Cancelling...' : 'Decline'}
                          </Button>
                        </>
                      )}

                      {booking.status === 'confirmed' && (
                        <Button
                          onClick={() => updateBookingStatus(booking.id, 'completed')}
                          disabled={updatingBooking === booking.id}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          {updatingBooking === booking.id ? 'Marking Complete...' : 'Mark as Completed'}
                        </Button>
                      )}

                      {/* Add Notes Button */}
                      <Button
                        onClick={() => {
                          const notes = teacherNotes[booking.id] || booking.teacher_notes || '';
                          const newNotes = prompt('Add notes for this booking:', notes);
                          if (newNotes !== null) {
                            setTeacherNotes(prev => ({ ...prev, [booking.id]: newNotes }));
                            updateBookingStatus(booking.id, booking.status, newNotes);
                          }
                        }}
                        disabled={updatingBooking === booking.id}
                        variant="outline"
                      >
                        {updatingBooking === booking.id ? 'Saving...' : 'Add Notes'}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}