import { Router } from 'express';
import * as patientController from './patient.controller.js';
import { validateUpdateProfile } from './patient.validation.js';
import { authenticateJWT, authorizeRoles } from '../auth/auth.middleware.js';

const router = Router();

// Apply JWT authentication and restrict all routes in this file to the PATIENT role
router.use(authenticateJWT);
router.use(authorizeRoles('PATIENT'));

// Patient specific profile endpoints
router.get('/profile', patientController.getProfile);
router.put('/profile', validateUpdateProfile, patientController.updateProfile);

// Stub endpoint to join a clinic
router.post('/join-clinic', patientController.joinClinic);

export default router;
