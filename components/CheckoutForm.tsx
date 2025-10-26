"use client";

import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCart } from '@/app/context/CartContext';
import { useRouter } from 'next/navigation';

interface CheckoutFormProps {
  orderId: string;
}

export default function CheckoutForm({ orderId }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { clearCart } = useCart();
  const router = useRouter();

  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded. Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: `${window.location.origin}/order-confirmation?orderId=${orderId}`,
      },
      redirect: 'if_required',
    });

    // This point will only be reached if there is an immediate error when confirming the payment.
    // Otherwise, your customer will be redirected to your `return_url`.
    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message);
      } else {
        setMessage("An unexpected error occurred.");
      }
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      // Payment succeeded, update order status in your backend
      try {
        const res = await fetch('/api/orders/update-payment-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ orderId: orderId, paymentStatus: 'paid', paymentIntentId: paymentIntent.id }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to update order payment status');
        }

        clearCart();
        router.push(`/order-confirmation?orderId=${orderId}`);
      } catch (updateError: any) {
        console.error('Error updating order payment status:', updateError);
        setMessage(`Payment succeeded, but failed to update order status: ${updateError.message}`);
      }
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
      <button disabled={isLoading || !stripe || !elements} id="submit"
        className="mt-6 w-full bg-[#f7931e] text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-orange-600 transition-colors duration-200"
      >
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
        </span>
      </button>
      {/* Show any error or success messages */}
      {message && <div id="payment-message" className="text-red-500 mt-4">{message}</div>}
    </form>
  );
}
