'use client';
import React, { useState, useEffect } from 'react';
import MegaDiscountForm from '@/components/MegaDiscountForm';
import { MegaDiscountFormData } from '@/lib/interfaces';

const EditMegaDiscountPage = ({ params }: { params: { id: string } }) => {
  const [initialData, setInitialData] = useState<MegaDiscountFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = params;

  useEffect(() => {
    const fetchMegaDiscount = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/mega-discounts/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch mega discount');
        }
        const data = await response.json();
        setInitialData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMegaDiscount();
    }
  }, [id]);

  const handleSubmit = async (formData: MegaDiscountFormData) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/mega-discounts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update mega discount');
      }

      // Redirect to the mega discounts list page
      window.location.href = '/dashboard/mega-discounts';
    } catch (err: any) {
      console.error(err);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Edit Mega Discount</h1>
      {initialData && <MegaDiscountForm onSubmit={handleSubmit} initialData={initialData} />}
    </div>
  );
};

export default EditMegaDiscountPage;
