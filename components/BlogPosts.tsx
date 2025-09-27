"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/lib/interfaces';

interface BlogPostsProps {
  items: BlogPost[];
}

const BlogPosts: React.FC<BlogPostsProps> = ({ items }) => {
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());
  const toggleExpand = (postSlug: string) => {
    setExpandedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postSlug)) {
        newSet.delete(postSlug);
      } else {
        newSet.add(postSlug);
      }
      return newSet;
    });
  };

  const getCorrectImageUrl = (url: string) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`;
  };

  return (
    <section className="bg-white py-12">
        <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold">Most Popular Blog Posts</h2>
                <Link href="/blog" className="text-sm font-semibold text-gray-600 hover:text-[#f7931e] transition-colors">View All Blogs</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {items.slice(0, 3).map((blogPost) => (
                    <Link href={`/blog/${blogPost._id}`} key={blogPost.slug} className="bg-white rounded-lg shadow-lg overflow-hidden relative">
                        <img src={getCorrectImageUrl(blogPost.image || '/img/placeholder.jpg')}  alt={blogPost.title} width={400} height={250} className="w-full h-auto object-cover"/>
                        <div className="blog-date-overlay">
                            <p className="font-bold text-lg">{new Date(blogPost.date).toLocaleDateString(undefined, { day: 'numeric' })}</p>
                            <p className="text-xs font-normal mt-0.5">{new Date(blogPost.date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</p>
                        </div>
                        <div className="p-6">
                            <p className="text-xs text-gray-500 font-semibold uppercase mb-1">{blogPost.category}</p>
                            <h3 className="text-xl font-bold mb-2">{blogPost.title}</h3>
                            {expandedPosts.has(blogPost.slug) ? (
                                <div dangerouslySetInnerHTML={{ __html: blogPost.content || '' }} className="text-sm text-gray-600 leading-relaxed mb-4" />
                            ) : (
                                <p className="text-sm text-gray-600 leading-relaxed mb-4">{blogPost.excerpt}</p>
                            )}
                            <button
                                onClick={() => toggleExpand(blogPost.slug)}
                                className="inline-block bg-[#f7931e] text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-orange-600 transition-colors"
                            >
                                {expandedPosts.has(blogPost.slug) ? 'READ LESS' : 'READ MORE'}
                            </button>
                            {blogPost.affiliateLink && (
                                <Link href={blogPost.affiliateLink} target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-500 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-blue-600 transition-colors ml-2">
                                    Click Here
                                </Link>
                            )}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    </section>
  );
};

export default BlogPosts;
