'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import BlogForm from '@/components/BlogForm';
import { BlogPost } from '../../../../lib/interfaces';

const EditBlogPostPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const { slug } = params;

  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchBlogPost = async () => {
      if (!slug) return;
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blog/${slug}`);
        if (!response.ok) {
          throw new Error('Failed to fetch blog post');
        }
        const data: BlogPost = await response.json();
        setBlogPost(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blog/categories`);
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data: string[] = await response.json();
        setCategories(data);
      } catch (err: any) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchBlogPost();
    fetchCategories();
  }, [slug]);

  const handleSubmit = async (formData: any) => {
    if (!slug) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blog/${slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Failed to update blog post');
      }
      alert('Blog post updated successfully!');
      router.push('/dashboard/blog'); // Redirect back to the blog list
    } catch (err: any) {
        alert(`Error updating blog post: ${err.message}`);
    }
  };

  if (loading) {
    return <p>Loading blog post...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  if (!blogPost) {
    return <p>Blog post not found.</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <BlogForm
        onSubmit={handleSubmit}
        initialData={{ ...blogPost, content: blogPost.content || '' }}
        categories={categories}
      />
    </div>
  );
};

export default EditBlogPostPage;
