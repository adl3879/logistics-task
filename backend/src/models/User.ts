export interface User {
  id: number;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  role: 'CUSTOMER' | 'DRIVER' | 'ADMIN';
  created_at: Date;
  updated_at: Date;
}