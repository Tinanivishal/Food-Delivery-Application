import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Loader2, CreditCard, IndianRupee } from 'lucide-react';
import { motion } from 'framer-motion';

const stripePromise = loadStripe('pk_test_YourPublicKeyHere');

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetch('/api/payments/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 500, paymentMethodType: 'card' })
    })
      .then(res => res.json())
      .then(data => setClientSecret(data.clientSecret));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setMessage(null);

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: 'Vishal Deveops',
        },
      },
    });

    setLoading(false);
    if (result.error) {
      setMessage(result.error.message);
    } else if (result.paymentIntent.status === 'succeeded') {
      setMessage('✅ Payment successful!');
    }
  };

  return (
    <motion.div
      className="w-full max-w-md mx-auto p-6 bg-white shadow-xl rounded-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <CreditCard className="w-6 h-6" /> Secure Payment
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="border rounded p-3">
          <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
        </div>
        <button
          type="submit"
          disabled={!stripe || loading}
          className="w-full flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-xl transition duration-300"
        >
          {loading ? (
            <Loader2 className="animate-spin w-5 h-5" />
          ) : (
            <IndianRupee className="w-5 h-5" />
          )}
          Pay ₹500
        </button>
        {message && (
          <p className="text-center text-sm text-green-600 mt-2">{message}</p>
        )}
      </form>
    </motion.div>
  );
};

const StripePaymentPage = () => {
  return (
    <div className="flex-grow flex items-center justify-center bg-gradient-to-r from-purple-200 via-pink-200 to-red-200 px-4 py-8">
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </div>
  );
};

export default StripePaymentPage;
