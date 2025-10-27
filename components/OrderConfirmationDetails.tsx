
'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function OrderConfirmationDetails() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <>
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
    </>
  );
}
