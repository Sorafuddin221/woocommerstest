'use client';

import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Function to get the title based on the current path
  const getTitle = (path: string) => {
    if (path === '/dashboard') return 'Dashboard';
    if (path.startsWith('/dashboard/users/add')) return 'Add User';
    if (path.startsWith('/dashboard/users')) return 'Users';
    if (path.startsWith('/dashboard/products/add')) return 'Add Product';
    if (path.startsWith('/dashboard/products')) return 'Products';
    if (path.startsWith('/dashboard/blog/add')) return 'Add Blog';
    if (path.startsWith('/dashboard/blog')) return 'Blog';
    return 'Dashboard'; // Default title
  };

  const currentTitle = getTitle(pathname);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-custom-bg text-custom-text">
      {/* Sidebar Navigation */}
      <aside id="sidebar" className={`w-64 bg-custom-surface flex-shrink-0 p-4 fixed lg:relative lg:translate-x-0 h-full z-20 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out flex flex-col`}>
        <Sidebar />
      </aside>

      <div className="flex-1 flex flex-col lg:pl-5">
        {/* Top Header for Mobile */}
        <header className="lg:hidden flex justify-between items-center p-4 bg-custom-surface shadow-md">
          <button id="menu-toggle-btn" className="p-2 rounded-md bg-blue-500 text-white" onClick={toggleSidebar}>
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 id="mobile-header-title" className="text-xl font-bold text-white">{currentTitle}</h1>
          <div></div> {/* Spacer */}
        </header>

        <div id="content-container" className="flex flex-col xl:flex-row flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}