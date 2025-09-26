import { Router } from 'express';
import { createDriver, listUsers } from '../controllers/adminController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';

const router = Router();

router.use(authenticate);
router.use(authorize(['ADMIN']));

router.post('/drivers', createDriver);
router.get('/users', listUsers);

export default router;