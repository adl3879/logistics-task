'use client';

import { DashboardLayout } from '../../../components/Layout';
import { useAuthRedirect } from '../../../hooks';
import { DeliveryRequestForm, DeliveryHistory } from '../../../components/Customer';

export default function CustomerDashboardPage() {
  const { user } = useAuthRedirect(['customer']);

  if (!user) {
    return null; // Or a loading spinner
  }

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-4">Welcome, {user.name} (Customer)</h2>
      <p>This is your customer dashboard. Here you can create new delivery requests and view your delivery history.</p>
      <div className="mt-8">
        <DeliveryRequestForm />
      </div>
      <div className="mt-8">
        <DeliveryHistory />
      </div>
    </DashboardLayout>
  );
}
