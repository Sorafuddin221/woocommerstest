"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export const dynamic = 'force-dynamic'; // Force dynamic rendering

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="container mx-auto p-4 md:p-8 text-center">
      <h1 className="text-3xl font-bold mb-4 text-green-600">Order Placed Successfully!</h1>
      <p className="text-lg text-gray-800 mb-4">Thank you for your purchase.</p>
      {orderId && (
        <p className="text-md text-gray-700 mb-6">Your order ID is: <span className="font-semibold">{orderId}</span></p>
      )}
      <div className="flex flex-col items-center space-y-4">
        <Link href="/products" className="bg-[#f7931e] text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-orange-600 transition-colors duration-200">
          Continue Shopping
        </Link>
        {orderId && (
          <Link href={`/dashboard/orders/${orderId}`} className="text-blue-600 hover:underline">
            View Order Details
          </Link>
        )}
      </div>
    </div>
  );
}
