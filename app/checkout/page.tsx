"use client";

import React, { useState, useEffect } from 'react';
import { useCart } from '@/app/context/CartContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '@/components/CheckoutForm';

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const router = useRouter();

  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });
  const [clientSecret, setClientSecret] = useState('');
  const [orderId, setOrderId] = useState<string | null>(null);
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert('Your cart is empty. Please add items before checking out.');
      return;
    }

    try {
      const orderItems = cartItems.map(item => ({
        product: item.product._id,
        name: item.product.name,
        quantity: item.quantity,
        image: item.product.image,
        price: item.product.price,
      }));

      const orderData = {
        orderItems,
        shippingAddress: shippingInfo,
        paymentMethod: 'Stripe', // Placeholder, will be dynamic with actual payment integration
        itemsPrice: cartTotal,
        shippingPrice: 0, // Placeholder
        taxPrice: 0,      // Placeholder
        totalPrice: cartTotal, // For now, total is just cartTotal
      };

      // 1. Create the order
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!orderRes.ok) {
        const errorData = await orderRes.json();
        throw new Error(errorData.message || 'Failed to create order');
      }

      const order = await orderRes.json();
      setOrderId(order._id);

      // 2. Create Payment Intent
      const paymentIntentRes = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: order.totalPrice }),
      });

      if (!paymentIntentRes.ok) {
        const errorData = await paymentIntentRes.json();
        throw new Error(errorData.error || 'Failed to create payment intent');
      }

      const { clientSecret } = await paymentIntentRes.json();
      setClientSecret(clientSecret);

    } catch (error: any) {
      console.error('Error during checkout:', error);
      alert(`Checkout failed: ${error.message}`);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto p-4 md:p-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-lg text-gray-600 mb-8">Please add items to your cart before checking out.</p>
        <Link href="/products" className="bg-[#f7931e] text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-orange-600 transition-colors duration-200">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shipping Information Form */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Shipping Information</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={shippingInfo.fullName}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#f7931e] focus:border-[#f7931e]"
                required
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={shippingInfo.address}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#f7931e] focus:border-[#f7931e]"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={shippingInfo.city}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#f7931e] focus:border-[#f7931e]"
                  required
                />
              </div>
              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">Postal Code</label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={shippingInfo.postalCode}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#f7931e] focus:border-[#f7931e]"
                  required
                />
              </div>
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={shippingInfo.country}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#f7931e] focus:border-[#f7931e]"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-[#f7931e] text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-orange-600 transition-colors duration-200"
            >
              Continue to Payment
            </button>
          </form>

          {clientSecret && orderId && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Payment Information</h2>
              <Elements options={{ clientSecret }} stripe={stripePromise}>
                <CheckoutForm orderId={orderId} />
              </Elements>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-lg p-6 h-fit">
          <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
          {cartItems.map((item) => (
            <div key={item.product._id} className="flex justify-between text-gray-700 mb-2">
              <span>{item.product.name} (x{item.quantity})</span>
              <span>${(item.product.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t border-gray-200 pt-4 mt-4 flex justify-between items-center text-xl font-bold">
            <span>Total:</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
