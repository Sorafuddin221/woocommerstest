'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface MegaDiscount {
  _id: string;
  title: string;
  subtitle: string;
  image: string;
}

const MegaDiscountsPage = () => {
  const [megaDiscounts, setMegaDiscounts] = useState<MegaDiscount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMegaDiscounts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/mega-discounts`);
        if (!response.ok) {
          throw new Error('Failed to fetch mega discounts');
        }
        const data = await response.json();
        setMegaDiscounts(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMegaDiscounts();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this mega discount?')) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/mega-discounts/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete mega discount');
        }

        setMegaDiscounts(megaDiscounts.filter((discount) => discount._id !== id));
      } catch (err: any) {
        console.error(err);
      }
    }
  };

  if (loading) {
    return <p>Loading mega discounts...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Mega Discounts</h1>
        <Link href="/dashboard/mega-discounts/add" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Add New
        </Link>
      </div>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Title</th>
            <th className="py-2 px-4 border-b">Subtitle</th>
            <th className="py-2 px-4 border-b">Image</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {megaDiscounts.map((discount) => (
            <tr key={discount._id}>
              <td className="py-2 px-4 border-b">{discount.title}</td>
              <td className="py-2 px-4 border-b">{discount.subtitle}</td>
              <td className="py-2 px-4 border-b"><img src={discount.image || '/img/placeholder.jpg'} alt={discount.title} className="h-16" /></td>
              <td className="py-2 px-4 border-b">
                <Link href={`/dashboard/mega-discounts/edit/${discount._id}`} className="text-blue-500 hover:underline mr-4">Edit</Link>
                <button onClick={() => handleDelete(discount._id)} className="text-red-500 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MegaDiscountsPage;
