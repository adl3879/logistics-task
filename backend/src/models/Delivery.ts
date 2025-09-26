export interface Delivery {
  id: number;
  customer_id: number;
  driver_id?: number;
  pickup_address: string;
  delivery_address: string;
  package_description: string;
  status: 'PENDING' | 'IN_TRANSIT' | 'DELIVERED';
  created_at: Date;
  updated_at: Date;
  delivered_at?: Date;
}