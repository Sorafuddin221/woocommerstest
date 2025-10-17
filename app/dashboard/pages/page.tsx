'use client';

import React, { useEffect, useState } from 'react';
import Editor from '@/components/Editor';

const PagesPage: React.FC = () => {
  const [pages, setPages] = useState(['disclosure', 'terms', 'privacy-policy']);
  const [selectedPage, setSelectedPage] = useState('disclosure');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPageContent = async (pageTitle: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pages/${pageTitle}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch content for ${pageTitle}`);
      }
      const data = await response.json();
      setContent(data.content);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPageContent(selectedPage);
  }, [selectedPage]);

  const handleSave = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pages/${selectedPage}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error('Failed to save content');
      }

      alert('Content saved successfully!');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <main className="page-content flex-1 p-4 md:p-8 overflow-y-auto w-full">
      <h2 className="text-xl font-bold text-white mb-6">Manage Pages</h2>

      <div className="bg-custom-surface rounded-lg p-6 mb-8 space-y-4">
        <h3 className="text-lg font-bold text-white mb-4">Select Page to Edit</h3>
        <select
          value={selectedPage}
          onChange={(e) => setSelectedPage(e.target.value)}
          className="w-full bg-custom-card rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-custom-accent text-sm"
        >
          {pages.map((page) => (
            <option key={page} value={page}>
              {page.charAt(0).toUpperCase() + page.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-custom-surface rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4">Edit Content</h3>
        {loading ? (
          <div className="text-white">Loading...</div>
        ) : error ? (
          <div className="text-red-500">Error: {error}</div>
        ) : (
          <Editor content={content} onChange={setContent} />
        )}
        <button
          onClick={handleSave}
          className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Save Content
        </button>
      </div>
    </main>
  );
};

export default PagesPage;
