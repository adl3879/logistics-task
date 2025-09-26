
'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AssignDriverModal from './AssignDriverModal';

interface Delivery {
  _id: string;
  pickupLocation: string;
  deliveryLocation: string;
  itemDescription: string;
  status: string;
  assignedDriver?: { _id: string; name: string };
  customer: { _id: string; name: string };
  createdAt: string;
}

const DeliveryList: React.FC = () => {
  const { token } = useAuth();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);

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
        throw new Error(data.message || 'Failed to fetch deliveries');
      }

      setDeliveries(data);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred while fetching deliveries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, [token]);

  const handleAssignDriverClick = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
    setIsModalOpen(true);
  };

  const handleAssignmentSuccess = () => {
    setIsModalOpen(false);
    setSelectedDelivery(null);
    fetchDeliveries(); // Refresh the list
  };

  if (loading) {
    return <p>Loading deliveries...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">All Delivery Requests</h3>
      {deliveries.length === 0 ? (
        <p>No delivery requests found.</p>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Pickup</TableHead>
                <TableHead>Delivery</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deliveries.map((delivery) => (
                <TableRow key={delivery._id}>
                  <TableCell className="font-medium">{delivery._id.slice(-5)}</TableCell>
                  <TableCell>{delivery.customer.name}</TableCell>
                  <TableCell>{delivery.pickupLocation}</TableCell>
                  <TableCell>{delivery.deliveryLocation}</TableCell>
                  <TableCell>{delivery.itemDescription}</TableCell>
                  <TableCell>{delivery.status}</TableCell>
                  <TableCell>{delivery.assignedDriver?.name || 'N/A'}</TableCell>
                  <TableCell>
                    {!delivery.assignedDriver && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAssignDriverClick(delivery)}
                      >
                        Assign Driver
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {selectedDelivery && (
        <AssignDriverModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          delivery={selectedDelivery}
          onAssignmentSuccess={handleAssignmentSuccess}
        />
      )}
    </div>
  );
};

export default DeliveryList;
