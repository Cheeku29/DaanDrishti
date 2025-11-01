import { Router } from 'express';
import { param } from 'express-validator';
import { listVerifiedNgos, getNgoDetails } from '../controllers/publicController.js';

const router = Router();

router.get('/ngos', listVerifiedNgos);
router.get('/ngos/:id', [param('id').isString()], getNgoDetails);

export default router;

