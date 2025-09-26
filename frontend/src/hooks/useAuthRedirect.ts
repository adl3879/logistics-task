
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

const useAuthRedirect = (allowedRoles: string[] = []) => {
  const { isAuthenticated, user, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
      router.push('/'); 
    }
  }, [isAuthenticated, user, allowedRoles, router]);

  return { isAuthenticated, user, token };
};

export default useAuthRedirect;
