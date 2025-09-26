'use client';

import { DashboardLayout } from '../../../components/Layout';
import { useAuthRedirect } from '../../../hooks';
import { AssignedDeliveries } from '../../../components/Driver';

export default function DriverDashboardPage() {
  const { user } = useAuthRedirect(['driver']);

  if (!user) {
    return null; // Or a loading spinner
  }

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-4">Welcome, {user.name} (Driver)</h2>
      <p>This is your driver dashboard. Here you can view assigned deliveries and update their status.</p>
      <AssignedDeliveries />
    </DashboardLayout>
  );
}
