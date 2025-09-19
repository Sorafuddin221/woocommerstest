'use client';

import { useEffect, useState } from 'react';

interface Subscription {
  _id: string;
  email: string;
  subscribedAt: string;
}

const NewsletterSubscriptionsPage = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/newsletter`);
        if (res.ok) {
          const data = await res.json();
          setSubscriptions(data);
        }
      } catch (error: any) {
        console.error('Error fetching newsletter subscriptions:', error);
      }
    };
    fetchSubscriptions();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/newsletter/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setSubscriptions(subscriptions.filter((sub) => sub._id !== id));
      } else {
        const data = await res.json();
        alert(data.message);
      }
    } catch (error: any) {
      console.error('Error deleting subscription:', error);
      alert('An error occurred while deleting the subscription.');
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Newsletter Subscriptions</h1>
        {subscriptions.length === 0 ? (
          <p>No subscriptions yet.</p>
        ) : (
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Email</th>
                <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Subscribed At</th>
                <th className="py-2 px-4 border-b border-gray-200"></th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((sub) => (
                <tr key={sub._id}>
                  <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-800">{sub.email}</td>
                  <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-800">{new Date(sub.subscribedAt).toLocaleDateString()}</td>
                  <td className="py-2 px-4 border-b border-gray-200 text-right">
                    <button onClick={() => handleDelete(sub._id)} className="text-red-600 hover:text-red-900 text-sm font-medium">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default NewsletterSubscriptionsPage;
