import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/interfaces';

interface RelatedProductsProps {
  items: Product[];
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ items }) => {
  return (
    <section className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-custom-orange text-center mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                
                {items.map((item, index) => (
                <Link href={`/product/${item._id}`} key={index} className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center text-center group relative">

                        {item.isSale && (
                            <div className="absolute top-0 left-0 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-br-lg">
                                SALE!
                            </div>
                        )}

                        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-80 transition-opacity duration-300">
                            <button className="bg-[#f7931e] text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-orange-600 transition-colors">
                                Buy Now
                            </button>
                        </div>
                        
                        <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white cursor-pointer hover:text-red-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <Image src={item.image || '/img/placeholder.jpg'} alt={item.name || 'Product image'} width={200} height={200} className="mb-4 rounded-lg" />
                        <div className="w-full">
                            <p className="text-xs text-gray-500 font-semibold mb-1">{item.category}</p>
                            <h3 className="font-bold text-lg mb-2 text-custom-orange">{item.name}</h3>
                            
                            <div className="flex justify-center mb-2">
                                {Array.from({ length: 5 }, (_, i) => (
                                    <span key={`${item._id}-star-${i}`} className={i < item.rating ? "text-yellow-400" : "text-gray-300"}>★</span>
                                ))}
                            </div>
                            {item.isSale ? (
                                <>
                                    <p className="text-gray-400 line-through text-sm font-medium">${item.originalPrice?.toFixed(2)}</p>
                                    <p className="text-red-600 font-bold text-xl">${item.price.toFixed(2)}</p>
                                </> 
                            ) : (
                                <p className="text-gray-800 font-bold text-xl">${item.price.toFixed(2)}</p>
                            )}
                        </div>
                </Link>
                ))}
            </div>
        </div>
    </section>
  );
};

export default RelatedProducts;