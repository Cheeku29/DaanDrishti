import { Router } from 'express';
import {
  getAllSocialEvents,
  createSocialEvent,
  getSocialEventDetails,
  updateSocialEvent,
} from '../controllers/socialEventController.js';
import { auth } from '../middleware/authMiddleware.js';
import { allowRoles } from '../middleware/roleMiddleware.js';

const router = Router();

router.use(auth);
router.use(allowRoles('admin'));

router.get('/social-events', getAllSocialEvents);
router.post('/social-events', createSocialEvent);
router.get('/social-events/:id', getSocialEventDetails);
router.put('/social-events/:id', updateSocialEvent);

export default router;

