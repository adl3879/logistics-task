'use client';

import { AuthLayout } from '../../components/Layout';
import { RegisterForm } from '../../components/Auth';

export default function RegisterPage() {
  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  );
}
