import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Button } from './Button';
import { bookingsAPI } from '../lib/api';

// Initialize Stripe (replace with your publishable key)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_...');

interface StripeCheckoutProps {
  bookingId: number;
  amount: number;
  currency: string;
  onSuccess: (paymentIntent: any) => void;
  onError: (error: string) => void;
}

function CheckoutForm({ bookingId, amount, currency, onSuccess, onError }: StripeCheckoutProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  // Create payment intent when component mounts
  React.useEffect(() => {
    createPaymentIntent();
  }, []);

  const createPaymentIntent = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        onError('Authentication required');
        return;
      }

      const response = await fetch('/api/payments/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ booking_id: bookingId }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Failed to create payment intent');
      }

      setClientSecret(data.clientSecret);
    } catch (err: any) {
      onError(err.message || 'Failed to initialize payment');
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      onError('Stripe not initialized');
      return;
    }

    setLoading(true);

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (error) {
        onError(error.message || 'Payment failed');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent);
      } else {
        onError('Payment processing incomplete');
      }
    } catch (err: any) {
      onError(err.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const cardStyle = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  if (!clientSecret) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Initializing payment...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Information
        </label>
        <div className="border border-gray-300 rounded-md p-3 focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500">
          <CardElement options={cardStyle} />
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-700">Total Amount:</span>
          <span className="text-2xl font-bold text-gray-900">
            {amount} {currency.toUpperCase()}
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          This includes a 15% platform fee. The teacher receives {Math.round(amount * 0.85)} {currency.toUpperCase()}.
        </p>
      </div>

      <Button
        type="submit"
        disabled={!stripe || loading}
        className="w-full"
        size="lg"
      >
        {loading ? 'Processing...' : `Pay ${amount} ${currency.toUpperCase()}`}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        Your payment information is secure and encrypted.
        You can cancel this booking up to 24 hours before the session.
      </p>
    </form>
  );
}

export function StripeCheckout(props: StripeCheckoutProps) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm {...props} />
    </Elements>
  );
}

