'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface MegaDiscount {
  _id: string;
  title: string;
  subtitle: string;
  image: string;
  buttonText: string;
  buttonLink: string;
}

const MegaDiscounts = () => {
  const [megaDiscounts, setMegaDiscounts] = useState<MegaDiscount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSection, setShowSection] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/settings/theme`);
        if (!response.ok) {
          throw new Error('Failed to fetch settings');
        }
        const data = await response.json();
        setShowSection(data.showMegaDiscounts);
      } catch (err: any) {
        setError(err.message);
      }
    };

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

    fetchSettings();
    fetchMegaDiscounts();
  }, []);

  if (!showSection) {
    return null;
  }

  if (loading) {
    return <p>Loading discounts...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <section className="bg-gray-100 py-12 border-t-2 border-gray-200">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-custom-orange">Mega Discount</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {megaDiscounts.map((discount) => (
            <div key={discount._id} className="relative rounded-lg overflow-hidden shadow-lg h-80 group">
              <img src={discount.image || '/img/placeholder.jpg'} alt={discount.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute inset-0 bg-black opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-50"></div>
              <div className="relative h-full flex flex-col justify-end p-6 text-white">
                <p className="text-lg font-medium mb-1">{discount.subtitle}</p>
                <h3 className="text-3xl font-extrabold leading-tight mb-4">{discount.title}</h3>
                <Link href={discount.buttonLink} className="bg-orange-500 text-white px-6 py-2 rounded-md text-lg font-semibold hover:bg-orange-600 transition-colors self-start">
                  {discount.buttonText}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MegaDiscounts;