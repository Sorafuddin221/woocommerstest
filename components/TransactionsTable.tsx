'use client';
import React, { useEffect, useState } from 'react';
import { Order } from '@/lib/interfaces';
import Image from 'next/image';

const TransactionsTable: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Order[] = await response.json();
        setOrders(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusClasses = (isPaid: boolean, isDelivered: boolean) => {
    if (isDelivered) {
      return 'bg-green-500/20 text-green-300';
    } else if (isPaid) {
      return 'bg-yellow-500/20 text-yellow-300';
    } else {
      return 'bg-red-500/20 text-red-300';
    }
  };

  if (loading) return <div className="text-white">Loading orders...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="bg-custom-surface p-6 rounded-lg mt-8 overflow-x-auto">
      <h3 className="text-xl font-semibold text-white">Latest Orders</h3>
      <table className="w-full mt-4 text-left min-w-[800px]">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="py-3 font-semibold text-sm text-custom-text-secondary">Order ID</th>
            <th className="py-3 font-semibold text-sm text-custom-text-secondary">Products</th>
            <th className="py-3 font-semibold text-sm text-custom-text-secondary">Total</th>
            <th className="py-3 font-semibold text-sm text-custom-text-secondary">Status</th>
            <th className="py-3 font-semibold text-sm text-custom-text-secondary">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {orders.map((order) => (
            <tr key={order._id}>
              <td className="py-4 px-4 text-white">{order._id}</td>
              <td className="py-4 px-4">
                {order.orderItems.map((item) => (
                  <div key={item.product} className="flex items-center space-x-2 mb-2">
                    <Image src={item.image} alt={item.name} width={40} height={40} className="rounded-md object-cover" />
                    <span className="text-white text-sm">{item.name} (x{item.quantity})</span>
                  </div>
                ))}
              </td>
              <td className="py-4 px-4 text-white font-medium">${order.totalPrice.toFixed(2)}</td>
              <td className="py-4 px-4">
                <span className={`${getStatusClasses(order.isPaid, order.isDelivered)} py-1 px-3 rounded-full text-xs font-medium`}>
                  {order.isDelivered ? 'Delivered' : order.isPaid ? 'Paid' : 'Pending'}
                </span>
              </td>
              <td className="py-4 px-4 text-custom-text-secondary">{new Date(order.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsTable;