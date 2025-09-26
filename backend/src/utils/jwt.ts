import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const secret = process.env.JWT_SECRET as string;
const expiresIn = process.env.JWT_EXPIRES_IN as string;

export const generateToken = (payload: object): string => {
  return jwt.sign(payload, 
    secret as jwt.Secret, 
    { expiresIn } as jwt.SignOptions);
};

export const verifyToken = (token: string): object | string => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return 'Invalid token';
  }
};