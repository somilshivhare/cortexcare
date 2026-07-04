import { Router } from 'express';
import * as clinicalContextController from './clinicalContext.controller.js';
import { validateConsultationId } from './clinicalContext.validation.js';
import { authenticateJWT, authorizeRoles } from '../auth/auth.middleware.js';

const router = Router();

// Apply JWT authentication globally to all clinical context endpoints
router.use(authenticateJWT);

// 1. Static Route: Fetch all summaries belonging to the patient.
// Must be registered BEFORE the parameterized route to avoid matching 'patient' as a consultationId parameter.
router.get('/patient', authorizeRoles('PATIENT'), clinicalContextController.getPatientContexts);

// 2. Parameterized Route: Fetch single clinical context by consultation ID.
// Open to both Patients (verified for ownership) and Doctors (verified for clinical role).
router.get('/:consultationId', validateConsultationId, clinicalContextController.getDetails);

export default router;
