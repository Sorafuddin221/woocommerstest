'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import BlogPageTemplate from '@/components/BlogPageTemplate';
import { BlogPost } from '@/lib/interfaces';

const BlogCategoryPage: React.FC = () => {
  const params = useParams();
  const { category } = params;

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogPostsByCategory = async () => {
      if (!category) return;
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blog?category=${category}`);
        if (!response.ok) {
          throw new Error('Failed to fetch blog posts by category');
        }
        const data: { blogPosts: BlogPost[]; currentPage: number; totalPages: number; totalBlogPosts: number } = await response.json();
        setBlogPosts(data.blogPosts);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPostsByCategory();
  }, [category]);

  if (loading) {
    return <p>Loading blog posts...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <BlogPageTemplate>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Blog Posts in {category}</h1>
        {blogPosts.length === 0 ? (
          <p>No blog posts found in this category.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <div key={post._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <Image src={post.image || '/img/placeholder.jpg'} alt={post.title} width={400} height={250} className="w-full h-auto object-cover" />
                <div className="p-4">
                  <p className="text-sm text-gray-500 mb-2">{new Date(post.date).toLocaleDateString()}</p>
                  <h2 className="text-xl font-bold mb-2">{post.title}</h2>
                  <p className="text-gray-700 text-sm mb-4">{post.excerpt}</p>
                  <Link href={`/blog/${post.slug}`} className="text-blue-600 hover:underline">Read More</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </BlogPageTemplate>
  );
};

export default BlogCategoryPage;
