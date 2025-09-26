
'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuth } from '../../context/AuthContext';

const DeliveryRequestForm: React.FC = () => {
  const { token } = useAuth();
  const [pickupLocation, setPickupLocation] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (!token) {
      setError('You must be logged in to create a delivery request.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/deliveries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ pickupLocation, deliveryLocation, itemDescription }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create delivery request');
      }

      setSuccess('Delivery request created successfully!');
      setPickupLocation('');
      setDeliveryLocation('');
      setItemDescription('');
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h3 className="text-xl font-semibold mb-4">Request a New Delivery</h3>
      {error && <p className="text-red-500 text-xs italic mb-4 text-center">{error}</p>}
      {success && <p className="text-green-500 text-xs italic mb-4 text-center">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Label htmlFor="pickupLocation">Pickup Location</Label>
          <Input
            id="pickupLocation"
            type="text"
            value={pickupLocation}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPickupLocation(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="deliveryLocation">Delivery Location</Label>
          <Input
            id="deliveryLocation"
            type="text"
            value={deliveryLocation}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDeliveryLocation(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <Label htmlFor="itemDescription">Item Description</Label>
          <Input
            id="itemDescription"
            type="text"
            value={itemDescription}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setItemDescription(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Request'}
        </Button>
      </form>
    </div>
  );
};

export default DeliveryRequestForm;
