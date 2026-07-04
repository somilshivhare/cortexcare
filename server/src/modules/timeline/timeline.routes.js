import { Router } from 'express';
import * as timelineController from './timeline.controller.js';
import { validateConsultationId } from './timeline.validation.js';
import { authenticateJWT } from '../auth/auth.middleware.js';

const router = Router();

// Apply JWT authentication globally to all timeline routes
router.use(authenticateJWT);

// Route to get unified consultation event history
router.get('/:consultationId', validateConsultationId, timelineController.getTimeline);

export default router;
