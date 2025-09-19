'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BlogForm from '../../../../components/BlogForm';

const AddBlogPage: React.FC = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/categories`);
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (formData: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blog`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create blog post');
      }

      router.push('/dashboard/blog');
          } catch (err: any) {
            setError(err.message);
          } finally {      setLoading(false);
    }
  };

  return (
    <main className="page-content flex-1 p-4 md:p-8 overflow-y-auto w-full">
      {error && <p className="text-red-500 mb-4">Error: {error}</p>}
      <BlogForm onSubmit={handleSubmit} categories={categories} />
      {loading && <p className="text-white mt-4">Creating post...</p>}
    </main>
  );
};

export default AddBlogPage;