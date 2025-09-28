'use client';

import { AuthLayout } from '../../components/Layout';
import { LoginForm } from '../../components/Auth';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
      <p className="text-center text-sm text-gray-600 mt-4">
        First time user?{' '}
        <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
          Register here
        </Link>
      </p>
    </AuthLayout>
  );
}
