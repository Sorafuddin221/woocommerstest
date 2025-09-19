'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const BrandsPage: React.FC = () => {
  const [brands, setBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/brands`);
      if (!response.ok) {
        throw new Error('Failed to fetch brands');
      }
      const data = await response.json();
      setBrands(data);
    } catch (err: any) {
        setError(err.message);
      } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleDelete = async (brandName: string) => {
    if (!confirm(`Are you sure you want to delete the brand: ${brandName}? This will disassociate it from all products.`)) {
      return;
    }
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/brands/${encodeURIComponent(brandName)}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete brand');
      }
      alert(`Brand '${brandName}' deleted successfully.`);
      fetchBrands(); // Re-fetch brands after deletion
    } catch (err: unknown) {
        console.error('Error deleting brand:', err);
        alert(`Failed to delete brand: ${(err as Error).message}`);
    }
  };

  if (loading) {
    return <div className="text-white p-8">Loading brands...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-8">Error: {error}</div>;
  }

  return (
    <main id="brands-content" className="page-content flex-1 p-4 md:p-8 overflow-y-auto w-full">
      <h2 className="text-xl font-bold text-white mb-6">Manage Brands</h2>
      <Link href="/dashboard/products" className="inline-flex items-center text-sm text-custom-text-secondary hover:text-white mb-4">
        <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        Back to Products
      </Link>

      <div className="bg-custom-surface rounded-lg p-6">
        {brands.length === 0 ? (
          <p className="text-custom-text-secondary">No brands found.</p>
        ) : (
          <ul className="space-y-4">
            {brands.map((brand) => (
              <li key={brand} className="flex justify-between items-center bg-custom-card p-4 rounded-lg">
                <span className="text-white text-lg">{brand}</span>
                <button
                  onClick={() => handleDelete(brand)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
};

export default BrandsPage;
