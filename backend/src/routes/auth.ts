import { Router } from 'express';
import { register, login } from '../controllers/authController';
import { validate, registerValidationRules } from '../middleware/validation';

const router = Router();

router.post('/register', registerValidationRules(), validate, register);
router.post('/login', login);

export default router;