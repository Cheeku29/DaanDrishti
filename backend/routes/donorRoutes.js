import { Router } from 'express';
import { getMyDonations, getImpactReports } from '../controllers/donorController.js';
import { auth } from '../middleware/authMiddleware.js';
import { allowRoles } from '../middleware/roleMiddleware.js';

const router = Router();

router.get('/my', auth, allowRoles('donor'), getMyDonations);
router.get('/impact', auth, allowRoles('donor'), getImpactReports);

export default router;

