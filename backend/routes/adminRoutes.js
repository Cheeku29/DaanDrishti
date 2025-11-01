import { Router } from 'express';
import {
  getDashboard,
  getPendingNGOs,
  verifyNGO,
  getAllNGOs,
  getAnalytics,
  getAllDonors,
} from '../controllers/adminController.js';
import { auth } from '../middleware/authMiddleware.js';
import { allowRoles } from '../middleware/roleMiddleware.js';

const router = Router();

router.use(auth);
router.use(allowRoles('admin'));

router.get('/dashboard', getDashboard);
router.get('/ngos/pending', getPendingNGOs);
router.put('/ngos/:id/verify', verifyNGO);
router.get('/ngos', getAllNGOs);
router.get('/analytics', getAnalytics);
router.get('/donors', getAllDonors);

export default router;

