'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'customer':
        return '/customer/dashboard';
      case 'admin':
        return '/admin/dashboard';
      case 'driver':
        return '/driver/dashboard';
      default:
        return '/';
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">BrandMe Logistics</h1>
        <nav className="flex items-center space-x-4">
          {user && <span className="text-gray-300">Welcome, {user.name} ({user.role})</span>}
          <Link href={getDashboardLink()} className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Dashboard</Link>
          <button onClick={handleLogout} className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium bg-red-600 hover:bg-red-700">
            Logout
          </button>
        </nav>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-700 text-white p-4">
          <nav className="mt-5">
            <Link href={getDashboardLink()} className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-600">Dashboard</Link>
            {user?.role === 'customer' && (
              <Link href="/customer/delivery/create" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-600 mt-1">Create Delivery</Link>
            )}
            {user?.role === 'customer' && (
              <Link href="/customer/delivery/history" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-600 mt-1">Delivery History</Link>
            )}
            {user?.role === 'admin' && (
              <Link href="/admin/deliveries" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-600 mt-1">All Deliveries</Link>
            )}
            {user?.role === 'admin' && (
              <Link href="/admin/users" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-600 mt-1">Manage Users</Link>
            )}
            {user?.role === 'driver' && (
              <Link href="/driver/assigned" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-600 mt-1">Assigned Deliveries</Link>
            )}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
