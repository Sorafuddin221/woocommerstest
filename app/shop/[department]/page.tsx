
"use client"

import ProductPageTemplate from '@/components/ProductPageTemplate';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { Product, BlogPost } from '@/lib/interfaces';

export default function ShopDepartmentPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [sortBy, setSortBy] = useState<string>('createdAtDesc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [recentBlogPosts, setRecentBlogPosts] = useState<BlogPost[]>([]);
  const productsPerPage = 9;
  const params = useParams();
  const department = params.department as string;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const queryParams = new URLSearchParams();
        if (searchTerm) queryParams.append('search', searchTerm);
        if (minPrice) queryParams.append('minPrice', minPrice.toString());
        if (maxPrice) queryParams.append('maxPrice', maxPrice.toString());
        if (sortBy) queryParams.append('sortBy', sortBy);
        if (department) queryParams.append('department', department);
        queryParams.append('page', currentPage.toString());
        queryParams.append('limit', productsPerPage.toString());

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products?${queryParams.toString()}`, { cache: 'no-store' });
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data.products || []);
        setTotalPages(data.totalPages);
      } catch (error: any) {
        console.error('Error fetching products:', error);
      }
    };

    const fetchRecentBlogPosts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blog/recent`);
        if (!response.ok) {
          throw new Error('Failed to fetch recent blog posts');
        }
        const data = await response.json();
        setRecentBlogPosts(data);
      } catch (error: any) {
        console.error('Error fetching recent blog posts:', error);
      }
    };

    fetchProducts();
    fetchRecentBlogPosts();
  }, [searchTerm, minPrice, maxPrice, sortBy, currentPage, department]);

  const breadcrumbs = (
    <nav className="text-sm mb-6 text-gray-600">
      <Link href="/" className="hover:underline">Home</Link> &gt; <Link href="/products" className="hover:underline">Shop</Link> &gt; <span>{department}</span>
    </nav>
  );

  const stripLocalhostPrefix = (url: string) => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';
    if (backendUrl && url.startsWith(backendUrl)) {
      return url.substring(backendUrl.length);
    }
    return url;
  };

  return (
    <ProductPageTemplate
      title={department}
      heroImage={stripLocalhostPrefix("/img/black-white-bedroom-with-red-accent.jpg")}
      subheading={`Browse our collection of ${department}`}
      buttonUrl={"/"}
      breadcrumbs={breadcrumbs}
    >
      {/* Top section with breadcrumbs, search, and sorting */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <input 
          type="text" 
          placeholder="Search products..." 
          className="w-full md:w-1/3 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>Showing {products && products.length > 0 ? `${(currentPage - 1) * productsPerPage + 1}-${(currentPage - 1) * productsPerPage + products.length}` : '0'} of {products ? products.length : '0'} results</span>
          <select 
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="createdAtDesc">Default sorting</option>
            <option value="priceAsc">Sort by price: low to high</option>
            <option value="priceDesc">Sort by price: high to low</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="md:w-1/4">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            {/* Filter by Price */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Filter by price</h2>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  placeholder="Min Price" 
                  className="w-1/2 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  value={minPrice}
                  onChange={(e) => setMinPrice(parseFloat(e.target.value))}
                />
                <input 
                  type="number" 
                  placeholder="Max Price" 
                  className="w-1/2 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(parseFloat(e.target.value))}
                />
              </div>
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>Price: ${minPrice} - ${maxPrice}</span>
              </div>
            </div>

            {/* Recent Blog Posts */}
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Recent Blog Posts</h2>
              <ul className="space-y-4">
                {recentBlogPosts.map((post) => (
                  <li key={post._id} className="flex items-center space-x-3">
                    <Image src={post.image || '/img/blog-placeholder.png'} alt={post.title} width={60} height={60} className="rounded-lg object-cover" />
                    <div>
                      <Link href={`/blog/${post.slug}`} className="text-gray-800 hover:text-blue-600 font-medium text-sm">
                        {post.title}
                      </Link>
                      <p className="text-xs text-gray-500">{new Date(post.date).toLocaleDateString()}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="md:w-3/4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center text-center group relative">
                {/* Hover overlay with button and icons */}
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Link href={product.url} target="_blank" rel="noopener noreferrer" className="bg-[#f7931e] text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-orange-600 transition-colors">
                    Buy Now
                  </Link>
                  <Link href={`/product/${product._id}`} className="bg-gray-700 text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-gray-600 transition-colors">
                    Details
                  </Link>
                </div>
                {/* Wishlist Icon */}
                <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white cursor-pointer hover:text-red-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <Image src={typeof product.image === 'string' && product.image ? product.image : '/img/placeholder.jpg'} alt={product.name || 'Product image'} width={200} height={200} className="mb-4 rounded-lg" />
                <div className="w-full">
                  <p className="text-xs text-gray-500 font-semibold mb-1">{product.category}</p>
                  <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                  {/* Star Rating */}
                  <div className="flex justify-center mb-2">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span key={i} className={i < product.rating ? "text-yellow-400" : "text-gray-300"}>★</span>
                    ))}
                  </div>
                  {/* Wrap the conditional rendering in a fragment */}
                  <>
                    {product.isSale ? (
                      <>
                        <p className="text-gray-400 line-through text-sm font-medium">${product.originalPrice}</p>
                        <p className="text-red-600 font-bold text-xl">${product.price}</p>
                      </>
                    ) : (
                      <p className="text-gray-800 font-bold text-xl">${product.price}</p>
                    )}
                  </>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Section */}
          <div className="flex justify-center items-center mt-8 space-x-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button 
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded-lg shadow-md font-bold transition-colors ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </main>
      </div>
    </ProductPageTemplate>
  );
}
