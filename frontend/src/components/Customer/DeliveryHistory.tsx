'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

interface Delivery {
  id: string;
  pickup_address: string;
  delivery_address: string;
  package_description: string;
  status: string;
  assigned_driver?: { name: string };
  created_at: string;
}

const DeliveryHistory: React.FC = () => {
  const { token } = useAuth();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeliveries = async () => {
      if (!token) {
        setError('Authentication token not found.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:3001/api/deliveries', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch delivery history');
        }

        setDeliveries(data);
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred while fetching deliveries.');
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries();
  }, [token]);

  if (loading) {
    return <p>Loading delivery history...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Your Delivery History</h3>
      {deliveries.length === 0 ? (
        <p>No delivery requests found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {deliveries.map((delivery) => (
            <Card key={delivery.id}>
              <CardHeader>
                <CardTitle>Delivery #{delivery.id}</CardTitle>
                <CardDescription>Status: {delivery.status}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Pickup: {delivery.pickup_address}</p>
                <p>Delivery: {delivery.delivery_address}</p>
                <p>Item: {delivery.package_description}</p>
                {/* {delivery.assignedDriver && <p>Driver: {delivery.assignedDriver.name}</p>} */}
              </CardContent>
              <CardFooter>
                <p className="text-sm text-gray-500">Requested on: {new Date(delivery.created_at).toLocaleDateString()}</p>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeliveryHistory;
