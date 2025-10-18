'use client';

import React from 'react';
import Link from 'next/link';
import ProductForm from '../../../../components/ProductForm';
import { ProductFormData } from '@/lib/interfaces';
import { useRouter } from 'next/navigation';

const AddProductPage: React.FC = () => {
  const router = useRouter();

  const handleSubmit = async (formData: ProductFormData): Promise<boolean> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.title, // Map title to name
          description: formData.description,
          shortDescription: formData.shortDescription, // Add this line
          price: parseFloat(formData.price), // Convert to number
          category: formData.category,
          brand: formData.brand,
          shopDepartment: formData.shopDepartment,
          image: formData.image, // Handle image upload separately if needed
          gallery: formData.gallery, // Add this line
          rating: 0, // Default rating
          originalPrice: null, // Default originalPrice
          isSale: false, // Default isSale
          url: formData.url,
          buttons: formData.buttons, // Add this line to save buttons
        }),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Try to parse the error response
        console.error('Server Error:', errorData.message); // Log the server's error message
        throw new Error(errorData.message || 'Failed to add product'); // Use server's message if available
      }

      const newProduct = await response.json();
      console.log('New Product Added:', newProduct);
      router.push('/dashboard/products');
      return true; // Indicate success
    } catch (error: any) {
      console.error('Error adding product:', error);
      alert('Failed to add product. Please try again.');
      return false; // Indicate failure
    }
  };

  return (
    <main id="addproduct-content" className="page-content flex-1 p-4 md:p-8 overflow-y-auto w-full">
      <Link href="/dashboard/products" className="inline-flex items-center text-sm text-custom-text-secondary hover:text-white mb-4">
        <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        Back to Products
      </Link>
      <ProductForm onSubmit={handleSubmit} />
    </main>
  );
};

export default AddProductPage;