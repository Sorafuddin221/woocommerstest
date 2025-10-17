"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/interfaces';

interface NewArrivalsProps {
  items: Product[];
}

const NewArrivals: React.FC<NewArrivalsProps> = ({ items }) => {
  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <h2 className="text-3xl font-bold mb-4 md:mb-0 text-custom-orange">New Arrivals</h2>
        </div>

        <div id="product-list" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {items.map((product) => (
            <Link href={`/product/${product._id}`} key={product._id} className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center text-center group relative">
              {product.isSale && (
                <div className="absolute top-0 left-0 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-br-lg">
                  SALE!
                </div>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-80 transition-opacity duration-300">
                <Link href={product.url} target="_blank" rel="noopener noreferrer" className="bg-[#f7931e] text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-orange-600 transition-colors">
                  Buy Now
                </Link>
              </div>
              <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white cursor-pointer hover:text-red-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <Image src={product.image} alt={product.name || 'Product image'} width={200} height={200} className="mb-4 rounded-lg" />
              <div className="w-full">
                <p className="text-xs text-gray-500 font-semibold mb-1">{product.category.toUpperCase()}</p>
                <h3 className="font-bold text-lg mb-2 text-custom-orange">{product.name}</h3>
                <div className="flex justify-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < product.rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                  ))}
                </div>
                {product.originalPrice && (
                  <p className="text-gray-400 line-through text-sm font-medium">${product.originalPrice.toFixed(2)}</p>
                )}
                <p className="text-gray-800 font-bold text-xl">${product.price.toFixed(2)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;
