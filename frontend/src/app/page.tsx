
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'customer') {
        router.push('/customer/dashboard');
      } else if (user.role === 'admin') {
        router.push('/admin/dashboard');
      } else if (user.role === 'driver') {
        router.push('/driver/dashboard');
      } else {
        // Fallback for unknown roles or if role is not set
        router.push('/login');
      }
    } else {
      router.push('/login');
    }
  }, [isAuthenticated, user, router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Loading...</h1>
    </main>
  );
}

