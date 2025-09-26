import { Router } from 'express';
import {
  createDelivery,
  getDeliveries,
  getDeliveryById,
  updateDelivery,
  deleteDelivery,
  assignDriver,
  updateDeliveryStatus,
} from '../controllers/deliveryController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import { validate, createDeliveryValidationRules } from '../middleware/validation';

const router = Router();

router.use(authenticate);

router.post('/', authorize(['CUSTOMER']), createDeliveryValidationRules(), validate, createDelivery);
router.get('/', getDeliveries);
router.get('/:id', getDeliveryById);
router.put('/:id', authorize(['CUSTOMER', 'ADMIN']), updateDelivery);
router.delete('/:id', authorize(['CUSTOMER', 'ADMIN']), deleteDelivery);
router.put('/:id/assign', authorize(['ADMIN']), assignDriver);
router.put('/:id/status', authorize(['DRIVER', 'ADMIN']), updateDeliveryStatus);

export default router;