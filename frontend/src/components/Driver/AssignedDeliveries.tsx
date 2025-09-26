
'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import UpdateDeliveryStatusForm from './UpdateDeliveryStatusForm';

interface Delivery {
  _id: string;
  pickupLocation: string;
  deliveryLocation: string;
  itemDescription: string;
  status: string;
  customer: { name: string };
  createdAt: string;
}

const AssignedDeliveries: React.FC = () => {
  const { token } = useAuth();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);

  const fetchAssignedDeliveries = async () => {
    if (!token) {
      setError('Authentication token not found.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/deliveries/assigned', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch assigned deliveries');
      }

      setDeliveries(data);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred while fetching assigned deliveries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignedDeliveries();
  }, [token]);

  const handleStatusUpdateSuccess = () => {
    setSelectedDelivery(null);
    fetchAssignedDeliveries(); // Refresh the list
  };

  if (loading) {
    return <p>Loading assigned deliveries...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Your Assigned Deliveries</h3>
      {deliveries.length === 0 ? (
        <p>No assigned deliveries found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {deliveries.map((delivery) => (
            <Card key={delivery._id}>
              <CardHeader>
                <CardTitle>Delivery #{delivery._id.slice(-5)}</CardTitle>
                <CardDescription>Status: {delivery.status}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Customer: {delivery.customer.name}</p>
                <p>Pickup: {delivery.pickupLocation}</p>
                <p>Delivery: {delivery.deliveryLocation}</p>
                <p>Item: {delivery.itemDescription}</p>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-gray-500">Assigned on: {new Date(delivery.createdAt).toLocaleDateString()}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedDelivery(delivery)}
                  className="mt-2"
                >
                  Update Status
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {selectedDelivery && (
        <UpdateDeliveryStatusForm
          delivery={selectedDelivery}
          onUpdateSuccess={handleStatusUpdateSuccess}
          onCancel={() => setSelectedDelivery(null)}
        />
      )}
    </div>
  );
};

export default AssignedDeliveries;
