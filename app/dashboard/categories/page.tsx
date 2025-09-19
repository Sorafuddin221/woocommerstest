
'use client';

import React, { useEffect, useState } from 'react';
import { Category } from '@/lib/interfaces';

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories`);
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      setCategories(data);
      if (data.length > 0) {
        setSelectedCategory(data[0].name);
      }
    } catch (err: any) {
        setError(err.message);
      } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    if (!selectedCategory || !selectedFile) {
      alert('Please select a category and a file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          'x-filename': selectedFile.name,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image');
      }

      const uploadData = await uploadResponse.json();
      console.log('Upload data:', uploadData);
      const imageUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}${uploadData.urls[0]}`;

      const categoryResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: selectedCategory, imageUrl }),
      });

      if (!categoryResponse.ok) {
        throw new Error('Failed to save category image');
      }

      alert('Category image saved successfully.');
      fetchCategories();
      setSelectedFile(null);
    } catch (err: any) {
        console.error('Error saving category image:', err);
        alert(`Failed to save category image: ${err.message}`);
    }
  };

  const handleDelete = async (categoryName: string) => {
    if (!confirm(`Are you sure you want to delete the image for this category?`)) {
      return;
    }
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories/${encodeURIComponent(categoryName)}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete category image');
      }
      alert(`Category image deleted successfully.`);
      fetchCategories();
    } catch (err: any) {
        console.error('Error deleting category image:', err);
        alert(`Failed to delete category image: ${err.message}`);
    }
  };

  if (loading) {
    return <div className="text-white p-8">Loading categories...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-8">Error: {error}</div>;
  }

  return (
    <main id="categories-content" className="page-content flex-1 p-4 md:p-8 overflow-y-auto w-full">
      <h2 className="text-xl font-bold text-white mb-6">Manage Category Images</h2>

      <div className="bg-custom-surface rounded-lg p-6 mb-8 space-y-4">
        <div>
          <label htmlFor="categorySelect" className="block text-sm font-medium text-white">Select Category</label>
          <select
            id="categorySelect"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="mt-1 block w-full bg-custom-card border border-custom-border rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            {categories.map(cat => (
              cat.name && <option key={cat.name} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="categoryImage" className="block text-sm font-medium text-white">Upload Image</label>
          <input
            type="file"
            id="categoryImage"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-custom-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>
        <button
          onClick={handleSave}
          disabled={!selectedCategory || !selectedFile}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition disabled:bg-gray-500"
        >
          Save Image
        </button>
      </div>

      <div className="bg-custom-surface rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4">Current Categories</h3>
        {categories.length === 0 ? (
          <p className="text-custom-text-secondary">No categories found. Add categories to your products to see them here.</p>
        ) : (
          <ul className="space-y-4">
            {categories.map((category) => (
              category.name && (
                <li key={category.name} className="bg-custom-card p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                      <div className="flex items-center">
                          {category.imageUrl ? (
                              <img src={category.imageUrl.startsWith('http') ? category.imageUrl : `${process.env.NEXT_PUBLIC_BACKEND_URL}${category.imageUrl}`} alt={category.name} className="w-16 h-16 object-cover rounded-md mr-4" />
                          ) : (
                              <div className="w-16 h-16 bg-gray-700 rounded-md mr-4 flex items-center justify-center">
                                  <span className="text-xs text-gray-400">No Image</span>
                              </div>
                          )}
                          <span className="text-white text-lg">{category.name}</span>
                      </div>
                      {category.imageUrl && (
                        <button
                        onClick={() => handleDelete(category.name)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                        >
                        Delete Image
                        </button>
                      )}
                  </div>
                </li>
              )
            ))}
          </ul>
        )}
      </div>
    </main>
  );
};

export default CategoriesPage;
