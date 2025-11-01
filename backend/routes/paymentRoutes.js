import { Router } from 'express';
import { body } from 'express-validator';
import { createOrder, verifyPayment } from '../controllers/paymentController.js';
import { auth } from '../middleware/authMiddleware.js';
import { allowRoles } from '../middleware/roleMiddleware.js';

const router = Router();

router.post(
  '/create-order',
  auth,
  allowRoles('donor'),
  [
    body('ngoId').notEmpty(),
    body('amount').isFloat({ min: 1 }),
  ],
  createOrder
);

router.post(
  '/verify',
  auth,
  allowRoles('donor'),
  [
    body('razorpay_order_id').notEmpty(),
    body('razorpay_payment_id').notEmpty(),
    body('razorpay_signature').notEmpty(),
    body('ngoId').notEmpty(),
    body('amount').isFloat({ min: 1 }),
  ],
  verifyPayment
);

export default router;

