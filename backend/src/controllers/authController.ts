import { Request, Response } from 'express';
import pool from '../utils/database';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';

export const register = async (req: Request, res: Response) => {
  const { email, password, firstName, lastName, role } = req.body;

  try {
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    const hashedPassword = await hashPassword(password);
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, role',
      [email, hashedPassword, firstName, lastName, role]
    );

    const user = result.rows[0];
    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const passwordMatch = await comparePassword(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};