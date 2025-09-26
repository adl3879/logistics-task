'use client';

import { DashboardLayout } from '../../../components/Layout';
import { useAuthRedirect } from '../../../hooks';
import { DeliveryList } from '../../../components/Admin';

export default function AdminDashboardPage() {
  const { user } = useAuthRedirect(['admin']);

  if (!user) {
    return null; // Or a loading spinner
  }

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-4">Welcome, {user.name} (Admin)</h2>
      <p>This is your admin dashboard. Here you can view all delivery requests and assign drivers.</p>
      <DeliveryList />
      {/* Placeholder for user management, if needed later */}
      {/* <div className="mt-8">
        <h3 className="text-xl font-semibold mb-2">Manage Users</h3>
        <p>[User management tools]</p>
      </div> */}
    </DashboardLayout>
  );
}
