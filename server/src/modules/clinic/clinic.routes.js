import { Router } from 'express';
import * as clinicController from './clinic.controller.js';
import { validateCreateClinic, validateJoinClinic } from './clinic.validation.js';
import { authenticateJWT, authorizeRoles } from '../auth/auth.middleware.js';

const router = Router();

// Apply JWT authentication globally to all clinic endpoints
router.use(authenticateJWT);

// Get clinic details (for both Patients and Doctors)
router.get('/', clinicController.getClinic);

// Join a clinic using a code (for both Patients and Doctors)
router.post('/join', validateJoinClinic, clinicController.join);

// Create a clinic (restricted to Doctors)
router.post('/', authorizeRoles('DOCTOR'), validateCreateClinic, clinicController.create);

// Get clinic members list (accessible by both Doctors and Patients)
router.get('/members', authorizeRoles('DOCTOR', 'PATIENT'), clinicController.getMembers);

export default router;
