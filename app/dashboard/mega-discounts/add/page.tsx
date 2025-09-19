'use client';
import React, { useState } from 'react';
import MegaDiscountForm from '@/components/MegaDiscountForm';
import { MegaDiscountFormData } from '@/lib/interfaces';

const AddMegaDiscountPage = () => {
  const [error, setError] = useState(null);

  const handleSubmit = async (formData: MegaDiscountFormData) => {
    try {
      setError(null);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/mega-discounts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create mega discount');
      }

      // Redirect to the mega discounts list page
      window.location.href = '/dashboard/mega-discounts';
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Add Mega Discount</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <MegaDiscountForm onSubmit={handleSubmit} />
    </div>
  );
};

export default AddMegaDiscountPage;
