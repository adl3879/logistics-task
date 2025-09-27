'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '../../context/AuthContext';

interface AssignDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  delivery: {
    _id: string;
    pickupLocation: string;
    deliveryLocation: string;
    itemDescription: string;
  };
  onAssignmentSuccess: () => void;
}

interface Driver {
  _id: string;
  name: string;
}

const AssignDriverModal: React.FC<AssignDriverModalProps> = ({ isOpen, onClose, delivery, onAssignmentSuccess }) => {
  const { token } = useAuth();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedDriverId, setSelectedDriverId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && token) {
      const fetchDrivers = async () => {
        try {
          const response = await fetch('http://localhost:3001/api/users/drivers', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch drivers');
          }
          setDrivers(data);
          if (data.length > 0) {
            setSelectedDriverId(data[0]._id); // Select first driver by default
          }
        } catch (err: any) {
          setError(err.message || 'Error fetching drivers');
        }
      };
      fetchDrivers();
    }
  }, [isOpen, token]);

  const handleAssign = async () => {
    if (!selectedDriverId || !token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:3001/api/deliveries/${delivery._id}/assign` , {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ driverId: selectedDriverId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to assign driver');
      }

      onAssignmentSuccess();
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during assignment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign Driver</DialogTitle>
          <DialogDescription>
            Assign a driver to delivery request:
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p className="mb-2"><strong>Item:</strong> {delivery.itemDescription}</p>
          <p className="mb-4"><strong>From:</strong> {delivery.pickupLocation} <strong>To:</strong> {delivery.deliveryLocation}</p>

          {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}

          <div className="mb-4">
            <Label htmlFor="driver-select">
              Select Driver
            </Label>
            <Select value={selectedDriverId} onValueChange={setSelectedDriverId} disabled={loading || drivers.length === 0}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a driver" />
              </SelectTrigger>
              <SelectContent>
                {drivers.length === 0 && <SelectItem value="">No drivers available</SelectItem>}
                {drivers.map((driver) => (
                  <SelectItem key={driver._id} value={driver._id}>
                    {driver.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button onClick={handleAssign} disabled={loading || !selectedDriverId}>
            {loading ? 'Assigning...' : 'Assign'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignDriverModal;
