'use client';

import React, { useEffect, useState } from 'react';

const TermsPage: React.FC = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pages/terms`);
        if (!response.ok) {
          throw new Error('Failed to fetch terms content');
        }
        const data = await response.json();
        setContent(data.content);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800">Terms and Conditions</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white p-8 rounded-lg shadow-md">
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : error ? (
            <div className="text-red-500 text-center">Error: {error}</div>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: content }} />
          )}
        </div>
      </main>
    </div>
  );
};

export default TermsPage;
