import { Router } from 'express';
import * as livekitController from './livekit.controller.js';
import { authenticateJWT } from '../auth/auth.middleware.js';

const router = Router();

// Apply JWT authentication globally to all LiveKit routes
router.use(authenticateJWT);

// Route definition to generate room tokens
router.post('/:consultationId/token', livekitController.getToken);

export default router;
