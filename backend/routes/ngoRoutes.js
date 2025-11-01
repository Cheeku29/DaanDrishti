import { Router } from 'express';
import {
  getDashboard,
  getNGODonations,
  addSpending,
  getSpending,
  updateSpending,
  updateProfile,
  getProfile,
} from '../controllers/ngoController.js';
import { auth } from '../middleware/authMiddleware.js';
import { allowRoles } from '../middleware/roleMiddleware.js';

const router = Router();

router.use(auth);
router.use(allowRoles('ngo'));

router.get('/dashboard', getDashboard);
router.get('/donations', getNGODonations);
router.post('/spending', addSpending);
router.get('/spending', getSpending);
router.put('/spending/:id', updateSpending);
router.put('/profile', updateProfile);
router.get('/profile', getProfile);

export default router;

