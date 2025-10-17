'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface FooterMenuItem {
  _id: string;
  title: string;
  url: string;
}

const FooterMenu: React.FC = () => {
  const [menuItems, setMenuItems] = useState<FooterMenuItem[]>([]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/footermenu`);
        if (response.ok) {
          const data = await response.json();
          setMenuItems(data);
        }
      } catch (error) {
        console.error('Error fetching footer menu items:', error);
      }
    };

    fetchMenuItems();
  }, []);

  return (
    <div className="flex items-center space-x-4">
      {menuItems.map((item) => (
        <Link key={item._id} href={item.url} className="text-gray-400 hover:text-white">
          {item.title}
        </Link>
      ))}
    </div>
  );
};

export default FooterMenu;
