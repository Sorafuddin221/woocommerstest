"use client";

import React from 'react';
import { useCart } from '@/app/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';

export default function CartPage() {
  const { cartItems, removeItem, updateItemQuantity, cartTotal } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto p-4 md:p-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-lg text-gray-600 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link href="/products" className="bg-[#f7931e] text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-orange-600 transition-colors duration-200">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
          {cartItems.map((item) => (
            <div key={item.product._id} className="flex items-center border-b border-gray-200 py-4 last:border-b-0">
              <div className="flex-shrink-0 w-24 h-24 relative">
                <Image
                  src={item.product.image ? (item.product.image.startsWith('http') ? item.product.image : `${process.env.NEXT_PUBLIC_BACKEND_URL}${item.product.image}`) : '/img/placeholder.jpg'}
                  alt={item.product.name}
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-md"
                />
              </div>
              <div className="ml-4 flex-grow">
                <Link href={`/product/${item.product._id}`} className="text-lg font-semibold text-gray-800 hover:text-[#f7931e]">
                  {item.product.name}
                </Link>
                <p className="text-gray-600">${item.product.price.toFixed(2)}</p>
                <div className="flex items-center mt-2">
                  <button
                    onClick={() => updateItemQuantity(item.product._id, item.quantity - 1)}
                    className="bg-gray-200 text-gray-700 px-3 py-1 rounded-l-md hover:bg-gray-300"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItemQuantity(item.product._id, parseInt(e.target.value) || 0)}
                    className="w-16 text-center border-t border-b border-gray-200 focus:outline-none"
                    min="0"
                  />
                  <button
                    onClick={() => updateItemQuantity(item.product._id, item.quantity + 1)}
                    className="bg-gray-200 text-gray-700 px-3 py-1 rounded-r-md hover:bg-gray-300"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeItem(item.product._id)}
                    className="ml-4 text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div className="text-lg font-semibold text-gray-800">
                ${(item.product.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-lg p-6 h-fit">
          <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
          <div className="flex justify-between text-gray-700 mb-2">
            <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} items):</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-700 mb-4">
            <span>Shipping:</span>
            <span>Free</span> {/* Placeholder for now */}
          </div>
          <div className="border-t border-gray-200 pt-4 flex justify-between items-center text-xl font-bold">
            <span>Total:</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <Link href="/checkout" className="mt-6 w-full block text-center bg-[#f7931e] text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-orange-600 transition-colors duration-200">
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
