'use client';
import React, { useEffect, useState } from 'react';
import Table from './Table';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface BlogPost {
  _id: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  slug: string;
}

const BlogTable: React.FC = () => {
  const router = useRouter();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blog`);
        if (!response.ok) {
          throw new Error('Failed to fetch blog posts');
        }
        const data: { blogPosts: BlogPost[]; currentPage: number; totalPages: number; totalBlogPosts: number } = await response.json();
        setBlogPosts(data.blogPosts);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  const handleDelete = async (slug: string) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blog/${slug}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete blog post');
        }
        setBlogPosts(blogPosts.filter((post) => post.slug !== slug));
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  const onEdit = (post: BlogPost) => {
    router.push(`/dashboard/blog/${post.slug}`);
  };

  const columns = [
    { Header: 'Title', accessor: 'title' },
    { Header: 'Excerpt', accessor: 'excerpt' },
    { Header: 'Created At', accessor: 'date', Cell: ({ value }: { value: string }) => new Date(value).toLocaleDateString() },
    {
      Header: 'Action',
      accessor: 'action',
      Cell: ({ row }: { row: BlogPost }) => (
        <div className="flex items-center">
          <button
            onClick={() => onEdit(row)}
            className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(row.slug)}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <p className="text-white">Loading blog posts...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <Table columns={columns} data={blogPosts} className="min-w-[800px]" actions={[]} />
  );
};

export default BlogTable;