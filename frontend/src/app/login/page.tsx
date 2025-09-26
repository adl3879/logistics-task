'use client';

import { AuthLayout } from '../../components/Layout';
import { LoginForm } from '../../components/Auth';

export default function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
