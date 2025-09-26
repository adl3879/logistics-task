import { Request, Response } from 'express';
import pool from '../utils/database';

export const createDelivery = async (req: Request, res: Response) => {
  const { pickupAddress, deliveryAddress, packageDescription } = req.body;
  const customerId = req.user?.id;

  try {
    const result = await pool.query(
      'INSERT INTO deliveries (customer_id, pickup_address, delivery_address, package_description) VALUES ($1, $2, $3, $4) RETURNING *',
      [customerId, pickupAddress, deliveryAddress, packageDescription]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getDeliveryById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;

  try {
    const result = await pool.query('SELECT * FROM deliveries WHERE id = $1', [id]);
    const delivery = result.rows[0];

    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found' });
    }

    if (user?.role !== 'ADMIN' && user?.id !== delivery.customer_id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    res.status(200).json(delivery);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateDelivery = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { pickupAddress, deliveryAddress, packageDescription } = req.body;
  const user = req.user;

  try {
    const result = await pool.query('SELECT * FROM deliveries WHERE id = $1', [id]);
    const delivery = result.rows[0];

    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found' });
    }

    if (user?.role !== 'ADMIN' && user?.id !== delivery.customer_id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const updatedResult = await pool.query(
      'UPDATE deliveries SET pickup_address = $1, delivery_address = $2, package_description = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
      [pickupAddress, deliveryAddress, packageDescription, id]
    );

    res.status(200).json(updatedResult.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteDelivery = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;

  try {
    const result = await pool.query('SELECT * FROM deliveries WHERE id = $1', [id]);
    const delivery = result.rows[0];

    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found' });
    }

    if (user?.role !== 'ADMIN' && user?.id !== delivery.customer_id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await pool.query('DELETE FROM deliveries WHERE id = $1', [id]);

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const assignDriver = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { driverId } = req.body;

  try {
    const result = await pool.query('UPDATE deliveries SET driver_id = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *', [driverId, id]);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateDeliveryStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const user = req.user;

  try {
    const result = await pool.query('SELECT * FROM deliveries WHERE id = $1', [id]);
    const delivery = result.rows[0];

    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found' });
    }

    if (user?.role === 'DRIVER' && user?.id !== delivery.driver_id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const updatedResult = await pool.query(
      'UPDATE deliveries SET status = $1, updated_at = CURRENT_TIMESTAMP, delivered_at = CASE WHEN $1 = \'DELIVERED\' THEN CURRENT_TIMESTAMP ELSE delivered_at END WHERE id = $2 RETURNING *',
      [status, id]
    );

    res.status(200).json(updatedResult.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getDeliveries = async (req: Request, res: Response) => {
  const user = req.user;

  try {
    let result;
    if (user?.role === 'ADMIN') {
      result = await pool.query('SELECT * FROM deliveries');
    } else if (user?.role === 'DRIVER') {
      result = await pool.query('SELECT * FROM deliveries WHERE driver_id = $1', [user.id]);
    } else {
      result = await pool.query('SELECT * FROM deliveries WHERE customer_id = $1', [user?.id]);
    }

    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};