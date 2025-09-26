
'use client';

import React, { useState, useEffect } from 'react';
import { Icon } from '@/lib/interfaces';

const IconSettingsForm = () => {
  const [icons, setIcons] = useState<Icon[]>([]);
  const [icon, setIcon] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchIcons();
  }, []);

  const fetchIcons = async () => {
    const res = await fetch('/api/icons');
    const data = await res.json();
    setIcons(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newIcon = { icon, title, description };

    if (editingId) {
      await fetch(`/api/icons/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newIcon),
      });
    } else {
      await fetch('/api/icons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newIcon),
      });
    }

    fetchIcons();
    resetForm();
  };

  const handleEdit = (icon: Icon) => {
    setEditingId(icon._id!);
    setIcon(icon.icon);
    setTitle(icon.title);
    setDescription(icon.description);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/icons/${id}`, {
      method: 'DELETE',
    });
    fetchIcons();
  };

  const resetForm = () => {
    setEditingId(null);
    setIcon('');
    setTitle('');
    setDescription('');
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <label className="block text-gray-700">Icon (SVG code)</label>
          <textarea
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {editingId ? 'Update Icon' : 'Add Icon'}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={resetForm}
            className="ml-4 bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        )}
      </form>

      <h2 className="text-xl font-bold mb-4">Current Icons</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {icons.map((icon) => (
          <div key={icon._id} className="border p-4 rounded">
            <div
              className="h-16 w-16 mx-auto mb-2 text-gray-400"
              dangerouslySetInnerHTML={{ __html: icon.icon }}
            ></div>
            <h3 className="font-bold text-lg text-center mb-1">{icon.title}</h3>
            <p className="text-sm text-center">{icon.description}</p>
            <div className="flex justify-center mt-4">
              <button
                onClick={() => handleEdit(icon)}
                className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(icon._id!)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IconSettingsForm;
