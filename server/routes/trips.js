import { Router } from 'express';
import {
  generateTrip,
  getAllTrips,
  getTripById,
  deleteTrip,
  duplicateTrip,
} from '../controllers/tripsController.js';
import { validateGenerateTrip } from '../middleware/validateRequest.js';

const router = Router();

router.post('/generate', validateGenerateTrip, generateTrip);
router.get('/', getAllTrips);
router.get('/:id', getTripById);
router.delete('/:id', deleteTrip);
router.post('/:id/duplicate', duplicateTrip);

export { router as tripRoutes };
