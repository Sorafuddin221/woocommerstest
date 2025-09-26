'use client';

import React, { useState, useEffect } from 'react';
import { Icon } from '@/lib/interfaces';

const IconSection = () => {
  const [icons, setIcons] = useState<Icon[]>([]);

  useEffect(() => {
    const fetchIcons = async () => {
      const res = await fetch('/api/icons');
      const data = await res.json();
      setIcons(data);
    };
    fetchIcons();
  }, []);

  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-gray-600">
        {icons.map((icon) => (
          <div key={icon._id} className="flex flex-col items-center text-center my-4 md:my-0 md:w-1/4">
            <div
              className="h-16 w-16 mb-2 text-gray-400"
              dangerouslySetInnerHTML={{ __html: icon.icon }}
            ></div>
            <h3 className="font-bold text-lg mb-1">{icon.title}</h3>
            <p className="text-sm">{icon.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default IconSection;
