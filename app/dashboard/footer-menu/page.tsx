'use client';

import React, { useEffect, useState } from 'react';

interface FooterMenuItem {
  _id: string;
  title: string;
  url: string;
  order: number;
}

const FooterMenuPage: React.FC = () => {
  const [menuItems, setMenuItems] = useState<FooterMenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newItem, setNewItem] = useState({ title: '', url: '', order: 0 });

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/footermenu`);
      if (!response.ok) {
        throw new Error('Failed to fetch footer menu items');
      }
      const data = await response.json();
      setMenuItems(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddItem = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/footermenu`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      });

      if (!response.ok) {
        throw new Error('Failed to add item');
      }

      setNewItem({ title: '', url: '', order: 0 });
      fetchMenuItems();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) {
      return;
    }
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/footermenu/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete item');
      }
      fetchMenuItems();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="text-white p-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-8">Error: {error}</div>;
  }

  return (
    <main className="page-content flex-1 p-4 md:p-8 overflow-y-auto w-full">
      <h2 className="text-xl font-bold text-white mb-6">Manage Footer Menu</h2>

      <div className="bg-custom-surface rounded-lg p-6 mb-8 space-y-4">
        <h3 className="text-lg font-bold text-white mb-4">Add New Item</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={newItem.title}
            onChange={handleInputChange}
            className="w-full bg-custom-card rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-custom-accent text-sm"
          />
          <input
            type="text"
            name="url"
            placeholder="URL"
            value={newItem.url}
            onChange={handleInputChange}
            className="w-full bg-custom-card rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-custom-accent text-sm"
          />
          <input
            type="number"
            name="order"
            placeholder="Order"
            value={newItem.order}
            onChange={handleInputChange}
            className="w-full bg-custom-card rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-custom-accent text-sm"
          />
        </div>
        <button
          onClick={handleAddItem}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Add Item
        </button>
      </div>

      <div className="bg-custom-surface rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4">Current Menu Items</h3>
        <ul className="space-y-4">
          {menuItems.map((item) => (
            <li key={item._id} className="bg-custom-card p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-white text-lg">{item.title}</span>
                  <span className="text-gray-400 text-sm ml-4">{item.url}</span>
                </div>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
};

export default FooterMenuPage;
