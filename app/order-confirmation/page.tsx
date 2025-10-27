import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const OrderConfirmationDetails = dynamic(() => import('@/components/OrderConfirmationDetails'), { ssr: false });

export default function OrderConfirmationPage() {
  return (
    <div className="container mx-auto p-4 md:p-8 text-center">
      <h1 className="text-3xl font-bold mb-4 text-green-600">Order Placed Successfully!</h1>
      <p className="text-lg text-gray-800 mb-4">Thank you for your purchase.</p>
      <OrderConfirmationDetails />
    </div>
  );
}