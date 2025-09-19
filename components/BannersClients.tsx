"use client";
import React, { useEffect, useState } from 'react';
import { ClientLogo } from '@/lib/interfaces';

const BannersClients = () => {
  const [clientLogos, setClientLogos] = useState<ClientLogo[]>([]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/settings/theme`);
        if (!response.ok) {
          throw new Error('Failed to fetch settings');
        }
        const data = await response.json();
        if (data.clientLogos) {
          setClientLogos(data.clientLogos);
        }
      } catch (error: any) {
        console.error('Error fetching client logos:', error);
      }
    };

    fetchSettings();
  }, []);

  return (
    <section className="bg-white py-12">
        <div className="container mx-auto px-4">


            {/* Client Logos Section */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 justify-items-center items-center">
                {clientLogos.map((logo, index) => (
                  <a key={logo.imageUrl} href={logo.link || '#'} target="_blank" rel="noopener noreferrer">
                    <img
                      src={logo.imageUrl}
                      alt={`Client Logo ${index + 1}`}
                      className="h-10 w-auto opacity-70 hover:opacity-100 transition-opacity"
                    />
                  </a>
                ))}
                {clientLogos.length === 0 && (
                  // Placeholder if no logos are configured
                  <p className="col-span-full text-center text-gray-500">No client logos configured yet.</p>
                )}
            </div>
        </div>
    </section>
  );
};

export default BannersClients;