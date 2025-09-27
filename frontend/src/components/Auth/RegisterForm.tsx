
'use client';

import React, { useState } from 'react';
import {Input, Button} from '@/components/ui';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

const RegisterForm: React.FC = () => {
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'CUSTOMER' | 'DRIVER'>('CUSTOMER'); // Default role
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, firstName, lastName, role }),
      });
      console.log(response);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      login(data.token, data.user);
      router.push('/'); // Redirect to home which will then redirect to appropriate dashboard
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-6">Create a new account</h2>
      {error && <p className="text-red-500 text-xs italic mb-4 text-center">{error}</p>}
      <div className="mb-4">
        <Label htmlFor="name">First Name</Label>
        <Input
          id="firstName"
          name="firstName"
          type="text"
          autoComplete="name"
          required
          placeholder="First Name"
          value={firstName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <Label htmlFor="name">Last Name</Label>
        <Input
          id="lastName"
          name="lastName"
          type="text"
          autoComplete="name"
          required
          placeholder="Last Name"
          value={lastName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="Email address"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          placeholder="Password"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <Label htmlFor="confirm-password">Confirm Password</Label>
        <Input
          id="confirm-password"
          name="confirm-password"
          type="password"
          autoComplete="new-password"
          required
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
        />
      </div>
      <div className="mb-6">
        <Label htmlFor="role">Register as:</Label>
        <Select value={role} onValueChange={(value: 'CUSTOMER' | 'DRIVER') => setRole(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CUSTOMER">Customer</SelectItem>
            <SelectItem value="DRIVER">Driver</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Registering...' : 'Register'}
      </Button>
    </form>
  );
};

export default RegisterForm;
