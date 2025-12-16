import React, { useEffect, useState } from 'react'
import Toast from '../../../components/Toast'
import { useRouter } from 'next/router'
import { StripeCheckout } from '../../../components/StripeCheckout'
import { Button } from '../../../components/Button'

export default function BookingPayPage() {
  const router = useRouter()
  const { id } = router.query

  const [booking, setBooking] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type?: 'info' | 'success' | 'error' } | null>(null)

  useEffect(() => {
    if (!id) return
    const token = localStorage.getItem('access_token')
    if (!token) {
      setToast({ message: 'Please sign in to continue', type: 'error' })
      setLoading(false)
      return
    }

    const base = process.env.NEXT_PUBLIC_BASE_URL || ''
    fetch(`${base}/api/bookings/${encodeURIComponent(String(id))}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (r) => {
        if (!r.ok) {
          const body = await r.json().catch(() => ({}))
          throw new Error(body.detail || 'Failed to load booking')
        }
        return r.json()
      })
      .then((data) => setBooking(data))
        .catch((e) => setToast({ message: e.message || 'Failed to load booking', type: 'error' }))
      .finally(() => setLoading(false))
  }, [id])

  const handleSuccess = async (paymentIntent: any) => {
    const token = localStorage.getItem('access_token')
    const base = process.env.NEXT_PUBLIC_BASE_URL || ''
    if (!token) {
      setError('Authentication required')
      return
    }

    try {
      const res = await fetch(`${base}/api/payments/confirm-payment/${encodeURIComponent(paymentIntent.id)}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      const body = await res.json()
      if (!res.ok) throw new Error(body.detail || 'Payment confirmation failed')
      // Redirect to bookings list
      setToast({ message: 'Payment confirmed — booking is now confirmed.', type: 'success' })
      setTimeout(() => router.push('/bookings'), 800)
    } catch (err: any) {
      setToast({ message: err.message || 'Payment confirmation failed', type: 'error' })
    }
  }

  const handleError = (msg: string) => {
    setToast({ message: msg, type: 'error' })
  }

  const clearToast = () => setToast(null)

  if (loading) return <div className="p-8">Loading...</div>
  if (toast && !booking) return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <p className="text-red-600">{toast.message}</p>
      <div className="mt-4">
        <Button onClick={() => router.push('/bookings')}>Back to bookings</Button>
      </div>
    </div>
  )

  if (!booking) return <div className="p-8">Booking not found.</div>

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      {toast && <Toast message={toast.message} type={toast.type} onClose={clearToast} />}
      <h1 className="text-2xl font-semibold mb-4">Pay for booking #{booking.id}</h1>
      <div className="mb-6">
        <div className="text-sm text-gray-700">Teacher: {booking.teacher?.full_name}</div>
        <div className="text-sm text-gray-700">Subject: {booking.subject}</div>
        <div className="text-sm text-gray-700">Scheduled: {booking.scheduled_date} {booking.start_time}</div>
      </div>

      <StripeCheckout
        bookingId={Number(booking.id)}
        amount={booking.total_amount}
        currency={booking.currency || 'QAR'}
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </div>
  )
}
