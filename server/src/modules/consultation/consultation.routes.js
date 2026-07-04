import { Router } from 'express';
import * as consultationController from './consultation.controller.js';
import { validateAddChunk } from './consultation.validation.js';
import { authenticateJWT, authorizeRoles } from '../auth/auth.middleware.js';

const router = Router();

// Apply JWT authentication and restrict all routes in this file to the PATIENT role
router.use(authenticateJWT);
router.use(authorizeRoles('PATIENT'));

// Route definitions
router.post('/', consultationController.create);
router.get('/:id', consultationController.getDetails);
router.post('/:id/chunks', validateAddChunk, consultationController.addChunk);
router.post('/:id/finalize', consultationController.finalize);

export default router;
