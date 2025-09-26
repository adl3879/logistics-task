

'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '../../context/AuthContext';

interface UpdateDeliveryStatusFormProps {
  delivery: {
    _id: string;
    status: string;
  };
  onUpdateSuccess: () => void;
  onCancel: () => void;
}

const UpdateDeliveryStatusForm: React.FC<UpdateDeliveryStatusFormProps> = ({ delivery, onUpdateSuccess, onCancel }) => {
  const { token } = useAuth();
  const [newStatus, setNewStatus] = useState<string>(delivery.status);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const statusOptions = ['pending', 'picked-up', 'in-transit', 'delivered', 'cancelled'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!token) {
      setError('Authentication token not found.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/deliveries/${delivery._id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update delivery status');
      }

      onUpdateSuccess();
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred while updating status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={!!delivery} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Delivery Status</DialogTitle>
          <DialogDescription>
            Update the status for delivery #{delivery._id.slice(-5)}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Label htmlFor="status-select">
                Current Status: {delivery.status}
              </Label>
              <Select value={newStatus} onValueChange={setNewStatus} disabled={loading}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1).replace('-', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </form>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel} disabled={loading}>Cancel</Button>
          <Button type="submit" disabled={loading} onClick={handleSubmit}>
            {loading ? 'Updating...' : 'Update Status'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateDeliveryStatusForm;

