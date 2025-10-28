"use client";
import React, { useEffect, useState } from 'react';
import Table from './Table';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/interfaces';

const ProductsTable: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products`);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data.products || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to delete product');
        }

        setProducts(products.filter((product) => product._id !== id));
      } catch (err: any) {
        console.error(err);
        alert(err.message);
      }
    }
  };

  const columns = [
    {
      Header: 'Image',
      accessor: 'image',
      Cell: ({ row }: { row: Product }) => (
        typeof row.image === 'string' && row.image ? (
          <Image className="h-8 w-8 rounded-full object-cover" src={row.image} alt={row.name || 'Product image'} width={32} height={32} />
        ) : (
          <Image className="h-8 w-8 rounded-full object-cover" src="/img/placeholder.jpg" alt="Placeholder" width={32} height={32} />
        )
      ),
    },
    { Header: 'Title', accessor: 'name' },
    {
      Header: 'Description',
      accessor: 'description',
      Cell: ({ value }: { value: string }) => `${value.substring(0, 50)}...`,
    },
    {
      Header: 'Price',
      accessor: 'price',
      Cell: ({ value }: { value: number }) => `${value.toFixed(2)}`,
    },
    {
      Header: 'Created At',
      accessor: 'createdAt',
      Cell: ({ value }: { value: string }) => new Date(value).toLocaleDateString(),
    },
    { Header: 'Stock', accessor: 'stock' },
    {
      Header: 'Action',
      accessor: 'action',
      Cell: ({ row }: { row: Product }) => (
        <>
          <Link href={`/dashboard/products/edit/${row._id}`} className="bg-green-500/20 text-green-300 text-xs font-semibold py-1 px-3 rounded-md hover:bg-green-500/40">Edit</Link>
          <button onClick={() => handleDelete(row._id)} className="ml-2 bg-red-500/20 text-red-300 text-xs font-semibold py-1 px-3 rounded-md hover:bg-red-500/40">Delete</button>
        </>
      ),
    },
  ];

  if (loading) {
    return <p className="text-white">Loading products...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <Table columns={columns} data={products} className="min-w-[800px]" />
  );
};

export default ProductsTable;
