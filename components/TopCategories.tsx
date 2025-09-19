
'use client';
import React, { useState, useEffect } from 'react';
import { Category } from '@/lib/interfaces';

const TopCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories`);
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        // Filter out categories that don't have an image
        const categoriesWithImages = data.filter((cat: Category) => cat.imageUrl);
        setCategories(categoriesWithImages);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <p>Loading categories...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <section className="bg-gray-100 py-12">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-8">Top Categories Of This Month</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-6 justify-items-center">
          {categories.map((category) => (
            <div key={category.name} className="flex flex-col items-center text-gray-600 space-y-2">
              {category.imageUrl && (
                <img src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${category.imageUrl}`} alt={category.name} className="w-16 h-16 object-cover rounded-full" />
              )}
              <p className="text-sm font-semibold">{category.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopCategories;
