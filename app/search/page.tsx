import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product, BlogPost, SearchResults } from '@/lib/interfaces';

async function searchAll(query: string): Promise<SearchResults> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/search?q=${query}`, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error('Failed to fetch search results');
    }
    return response.json();
  } catch (error: any) {
    console.error('Error fetching search results:', error);
    return { products: [], blogPosts: [] };
  }
}

export default async function SearchPage({ searchParams }: { searchParams: { q: string } }) {
  const awaitedSearchParams = await searchParams;
  const query = awaitedSearchParams.q || '';
  const results = await searchAll(query);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Search Results for &quot;{query}&quot;</h1>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Products</h2>
        {results.products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {results.products.map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <Image src={typeof product.image === 'string' && product.image ? product.image : '/img/placeholder.jpg'} alt={product.name} width={300} height={200} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                  <p className="text-gray-600 text-sm">{(product.description || '').substring(0, 100)}...</p>
                  <p className="text-lg font-semibold mt-2">${product.price.toFixed(2)}</p>
                  <Link href={`/product/${product._id}`} className="text-blue-500 hover:underline mt-2 inline-block">View Product</Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No products found.</p>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Blog Posts</h2>
        {results.blogPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {results.blogPosts.map((post) => (
              <div key={post._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <Image src={typeof post.image === 'string' && post.image ? post.image : '/img/placeholder.jpg'} alt={post.title} width={300} height={200} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1">{post.title}</h3>
                  <p className="text-gray-600 text-sm">{post.excerpt.substring(0, 100)}...</p>
                  <Link href={`/blog/${post.slug}`} className="text-blue-500 hover:underline mt-2 inline-block">Read More</Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No blog posts found.</p>
        )}
      </div>
    </div>
  );
}
