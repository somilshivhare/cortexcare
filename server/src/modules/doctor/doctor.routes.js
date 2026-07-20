import { Router } from 'express';
import multer from 'multer';
import * as doctorController from './doctor.controller.js';
import { validateUpdateProfile, validateAddNotes } from './doctor.validation.js';
import { authenticateJWT, authorizeRoles } from '../auth/auth.middleware.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Apply JWT authentication and restrict all routes in this file to the DOCTOR role
router.use(authenticateJWT);
router.use(authorizeRoles('DOCTOR'));

// Profile routes
router.get('/profile', doctorController.getProfile);
router.put('/profile', validateUpdateProfile, doctorController.updateProfile);

// Dashboard routes
router.get('/dashboard', doctorController.getDashboard);

// Patient registry/directory route
router.get('/patients', doctorController.getPatients);

// Consultation routing
router.get('/consultations', doctorController.getConsultations);
router.post('/consultations/:consultationId/claim', doctorController.claim);
router.post('/consultations/:consultationId/notes', validateAddNotes, doctorController.saveNotes);
router.post('/consultations/:consultationId/review', doctorController.review);
router.post('/consultations/:consultationId/attachments', upload.single('file'), doctorController.uploadFile);

// Fetch clinical context (Reuses the clinical context module logic)
router.get('/consultations/:consultationId/context', doctorController.getContext);

export default router;
