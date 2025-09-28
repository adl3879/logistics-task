'use client';

import { AuthLayout } from '../../components/Layout';
import { RegisterForm } from '../../components/Auth';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <AuthLayout>
      <RegisterForm />
      <p className="text-center text-sm text-gray-600 mt-4">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
          Login here
        </Link>
      </p>
    </AuthLayout>
  );
}
