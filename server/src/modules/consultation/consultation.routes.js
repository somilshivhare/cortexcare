import { Router } from 'express';
import multer from 'multer';
import * as consultationController from './consultation.controller.js';
import { validateSendMessage } from './consultation.validation.js';
import { authenticateJWT, authorizeRoles } from '../auth/auth.middleware.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Apply JWT authentication and restrict all routes in this file to the PATIENT role
router.use(authenticateJWT);
router.use(authorizeRoles('PATIENT'));

// Route definitions
router.post('/', consultationController.create);
router.get('/:id', consultationController.getDetails);
router.post('/:id/messages', validateSendMessage, consultationController.sendMessage);
router.post('/:id/finalize', consultationController.finalize);
router.post('/:id/attachments', upload.single('file'), consultationController.uploadFile);

export default router;
