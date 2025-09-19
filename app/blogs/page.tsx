"use client";

import BlogPageTemplate from '@/components/BlogPageTemplate';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BlogPost, Product, Settings } from '@/lib/interfaces';

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [recentBlogPosts, setRecentBlogPosts] = useState<BlogPost[]>([]);
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [blogCategories, setBlogCategories] = useState<string[]>([]);
  const [heroSettings, setHeroSettings] = useState<Settings | null>(null);
  const postsPerPage = 6; // Display 6 blog posts per page

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get('/api/settings');
        if (response.data && response.data.blogPageHero) {
          setHeroSettings(response.data.blogPageHero);
        }
      } catch (error: any) {
        console.error('Error fetching hero settings:', error);
      }
    };
    fetchSettings();

    const fetchBlogPosts = async () => {
      try {
        const queryParams = new URLSearchParams();
        if (searchTerm) queryParams.append('search', searchTerm);
        if (selectedCategory) queryParams.append('category', selectedCategory);
        queryParams.append('page', currentPage.toString());
        queryParams.append('limit', postsPerPage.toString());

        console.log('Fetching blog posts with query params:', queryParams.toString());
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blog?${queryParams.toString()}`);
        console.log('Blog posts response OK:', response.ok);
        if (!response.ok) {
          throw new Error('Failed to fetch blog posts');
        }
        const data = await response.json();
        console.log('Blog posts API response data:', data);
        setBlogPosts(data.blogPosts || []);
        setTotalPages(data.totalPages);
        console.log('Blog total pages set:', data.totalPages);
      } catch (error: any) {
        console.error('Error fetching blog posts:', error);
      }
    };

    const fetchBlogCategories = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blog/categories`);
        if (!response.ok) {
          throw new Error('Failed to fetch blog categories');
        }
        const data = await response.json();
        setBlogCategories(data);
      } catch (error: any) {
        console.error('Error fetching blog categories:', error);
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

    const fetchRecentProducts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/recent`); // Assuming a /products/recent endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch recent products');
        }
        const data = await response.json();
        setRecentProducts(data);
      } catch (error: any) {
        console.error('Error fetching recent products:', error);
      }
    };

    fetchBlogPosts();
    fetchBlogCategories();
    fetchRecentBlogPosts();
    fetchRecentProducts();
  }, [searchTerm, selectedCategory, currentPage]);

  const stripLocalhostPrefix = (url: string) => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';
    if (backendUrl && url.startsWith(backendUrl)) {
      return url.substring(backendUrl.length);
    }
    return url;
  };

  return (
    <BlogPageTemplate
      title={heroSettings?.blogPageHero?.heading || "Our Blog"}
      heroImage={stripLocalhostPrefix(heroSettings?.blogPageHero?.imageUrl || "/img/black-white-bedroom-with-red-accent.jpg")}
      subheading={heroSettings?.blogPageHero?.subheading || ""}
      buttonUrl={heroSettings?.blogPageHero?.buttonUrl || ""}
    >
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="md:w-1/4">
          <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Blog Categories</h2>
            <ul className="space-y-2 text-gray-700">
              <li>
                <Link 
                  href="#" 
                  className={`block p-2 rounded-lg hover:bg-gray-100 transition-colors ${selectedCategory === '' ? 'bg-gray-200' : ''}`}
                  onClick={() => setSelectedCategory('')}
                >
                  All Categories
                </Link>
              </li>
              {blogCategories.map((category) => (
                <li key={category}>
                  <Link 
                    href="#" 
                    className={`block p-2 rounded-lg hover:bg-gray-100 transition-colors ${selectedCategory === category ? 'bg-gray-200' : ''}`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Recent posts</h2>
            <ul className="space-y-4 text-gray-700">
              {recentBlogPosts.map((post) => (
                <li key={post._id} className="flex items-center gap-3">
                  <Image src={post.image || '/img/blog-placeholder.png'} alt={post.title || 'Recent blog post image'} width={64} height={64} className="w-16 h-16 rounded-lg object-cover" />
                  <div>
                    <Link href={`/blog/${post._id}`} className="text-sm font-medium text-gray-800 hover:text-blue-600">
                      {post.title}
                    </Link>
                    <p className="text-xs text-gray-500">{new Date(post.date).toLocaleDateString()}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Recent Products</h2>
            <ul className="space-y-4 text-gray-700">
              {recentProducts.map((product) => (
                <li key={product._id} className="flex items-center gap-3">
                  <Image src={product.image || '/img/placeholder.jpg'} alt={product.name || 'Recent product image'} width={64} height={64} className="w-16 h-16 rounded-lg object-cover" />
                  <div>
                    <Link href={product.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-gray-800 hover:text-blue-600">
                      {product.name}
                    </Link>
                    <p className="text-xs text-gray-500">€{product.price.toFixed(2)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Blog Post Grid */}
        <main className="md:w-3/4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogPosts.map((blogPost) => (
              <div key={blogPost._id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <Image src={typeof blogPost.image === 'string' && blogPost.image ? blogPost.image : '/img/placeholder.jpg'} alt={blogPost.title || 'Blog post image'} width={400} height={250} className="w-full h-64 object-cover" />
                <div className="p-6">
                  <p className="text-sm text-gray-500 mb-2">{new Date(blogPost.date).toLocaleDateString()}</p>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{blogPost.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{blogPost.excerpt}</p>
                  <Link href={`/blog/${blogPost._id}`} className="inline-block mt-4 text-sm font-semibold text-white bg-orange-500 px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">READ MORE</Link>
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
                className={`px-4 py-2 rounded-lg shadow-md font-bold transition-colors ${currentPage === i + 1 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </main>
      </div>
    </BlogPageTemplate>
  );
}