'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import SearchInput from '../../../components/SearchInput';
import UsersTable from '../../../components/UsersTable';
import Pagination from '../../../components/Pagination';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react'; // Import useSession
import { User } from '@/lib/interfaces';

const UsersPage: React.FC = () => {
  const router = useRouter();
  const { data: session, status } = useSession(); // Get session data
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState('user');
  const [createError, setCreateError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return; // Do nothing while session is loading

    if (!session || session.user.role !== 'admin') {
      router.push('/login'); // Redirect to login if not authenticated or not admin
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/users`, {
          headers: {
            // You might need to send a token for authentication if your backend requires it
            // 'Authorization': `Bearer ${session.accessToken}` // Example
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [session, status, router]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${session.accessToken}` // Example
        },
        body: JSON.stringify({ username: newUsername, password: newPassword, role: newUserRole }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to create user');
      }

      const newUser = await response.json();
      setUsers((prevUsers) => [...prevUsers, newUser]);
      setNewUsername('');
      setNewPassword('');
      setNewUserRole('user');
      alert('User created successfully!');
    } catch (err: any) {
        setCreateError(err.message);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/users/${userId}`, {
        method: 'DELETE',
        headers: {
          // 'Authorization': `Bearer ${session.accessToken}` // Example
        },
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to delete user');
      }

      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      alert('User deleted successfully!');
    } catch (err: unknown) {
        alert(`Error: ${(err as Error).message}`);
    }
  };

  if (status === 'loading' || loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!session || session.user.role !== 'admin') return <p>Access Denied</p>; // Should be redirected by now

  return (
    <main id="users-content" className="page-content flex-1 p-4 md:p-8 overflow-y-auto w-full">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>

      {/* Create New User Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold mb-4">Create New User</h2>
        <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="newUsername" className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              id="newUsername"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}              required
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="newPassword"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}              required
            />
          </div>
          <div>
            <label htmlFor="newUserRole" className="block text-sm font-medium text-gray-700">Role</label>
            <select
              id="newUserRole"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={newUserRole}
              onChange={(e) => setNewUserRole(e.target.value)}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create User
            </button>
            {createError && <p className="text-red-500 text-sm mt-2">{createError}</p>}
          </div>
        </form>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <SearchInput placeholder="Search for a user" />
        {/* Removed Add New button as creation is now on this page */}
      </div>

      {/* Users Table */}
      <UsersTable users={users} onDelete={handleDeleteUser} /> {/* Pass users and delete handler to UsersTable */}

      <Pagination />

      <Pagination />
    </main>
  );
};
export default UsersPage;