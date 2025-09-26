import { Request, Response } from 'express';
import pool from '../utils/database';
import { hashPassword } from '../utils/password';

export const createDriver = async (req: Request, res: Response) => {
  const { email, password, firstName, lastName } = req.body;

  try {
    const hashedPassword = await hashPassword(password);
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES ($1, $2, $3, $4, \'DRIVER\') RETURNING id, email, role',
      [email, hashedPassword, firstName, lastName]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const listUsers = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT id, email, first_name, last_name, role FROM users');
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};