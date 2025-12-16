import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ProtectedRoute } from '../../../../components/ProtectedRoute';
import { useAuth } from '../../../../contexts/AuthContext';
import { Card } from '../../../../components/Card';
import { Button } from '../../../../components/Button';
import Toast from '../../../../components/Toast';
import { StripeCheckout } from '../../../../components/StripeCheckout';
import { bookingsAPI, Booking } from '../../../../lib/api';

export default function BookingPaymentPage() {
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

      // Check if already paid
      if (bookingData.payment_status === 'paid') {
        setToast({ message: 'This booking has already been paid', type: 'info' });
        setTimeout(() => router.push('/dashboard/bookings'), 2000);
      }
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

  const handlePaymentSuccess = () => {
    setToast({ message: 'Payment successful! Redirecting...', type: 'success' });
    setTimeout(() => {
      router.push('/dashboard/bookings');
    }, 2000);
  };

  const handlePaymentError = (error: string) => {
    setToast({ message: error, type: 'error' });
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
        <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold mb-2">Complete Payment</h1>
            <p className="text-green-100">Secure payment powered by Stripe</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Link */}
          <div className="mb-6">
            <Link href="/dashboard/bookings" className="text-primary-600 hover:text-primary-800">
              ← Back to Bookings
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Booking Summary */}
            <div className="lg:col-span-1">
              <Card>
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Booking Summary</h2>

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Subject</p>
                      <p className="font-medium">{booking.subject}</p>
                    </div>

                    {booking.grade_level && (
                      <div>
                        <p className="text-sm text-gray-600">Grade Level</p>
                        <p className="font-medium">{booking.grade_level}</p>
                      </div>
                    )}

                    <div>
                      <p className="text-sm text-gray-600">Session Type</p>
                      <p className="font-medium capitalize">{booking.session_type}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="font-medium">{new Date(booking.scheduled_date).toLocaleDateString()}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Time</p>
                      <p className="font-medium">{booking.start_time} - {booking.end_time}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Duration</p>
                      <p className="font-medium">{booking.duration_hours} {booking.duration_hours === 1 ? 'hour' : 'hours'}</p>
                    </div>

                    <div className="pt-3 border-t border-gray-200">
                      <p className="text-sm text-gray-600">Hourly Rate</p>
                      <p className="font-medium">{booking.hourly_rate.toFixed(2)} QAR/hr</p>
                    </div>

                    <div className="pt-3 border-t border-gray-200">
                      <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                      <p className="text-3xl font-bold text-primary-600">{booking.total_amount.toFixed(2)} QAR</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Payment Form */}
            <div className="lg:col-span-2">
              <Card>
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Information</h2>

                  {booking.payment_status === 'paid' ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                      <div className="text-6xl mb-4">✅</div>
                      <h3 className="text-xl font-bold text-green-800 mb-2">Payment Completed</h3>
                      <p className="text-green-700">This booking has already been paid.</p>
                    </div>
                  ) : (
                    <>
                      <div className="mb-6">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm text-blue-700">
                                Your payment is secure and encrypted. We use Stripe to process payments.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <StripeCheckout
                        bookingId={booking.id}
                        amount={booking.total_amount}
                        onSuccess={handlePaymentSuccess}
                        onError={handlePaymentError}
                      />
                    </>
                  )}
                </div>
              </Card>

              {/* Security Notice */}
              <div className="mt-6 text-center text-sm text-gray-500">
                <p>🔒 Secure payment processing powered by Stripe</p>
                <p className="mt-1">Your payment information is encrypted and secure</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
