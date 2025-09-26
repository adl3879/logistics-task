import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const registerValidationRules = () => {
  return [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('role').isIn(['CUSTOMER', 'DRIVER', 'ADMIN']).withMessage('Invalid role'),
  ];
};

export const createDeliveryValidationRules = () => {
  return [
    body('pickupAddress').notEmpty().withMessage('Pickup address is required'),
    body('deliveryAddress').notEmpty().withMessage('Delivery address is required'),
    body('packageDescription').notEmpty().withMessage('Package description is required'),
  ];
};