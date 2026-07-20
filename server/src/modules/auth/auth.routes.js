import { Router } from 'express';
import * as authController from './auth.controller.js';
import { validateRegister, validateLogin } from './auth.validation.js';
import { authenticateJWT } from './auth.middleware.js';

const router = Router();

// Public routes
router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);

// Protected routes
router.get('/me', authenticateJWT, authController.getMe);
router.delete('/account', authenticateJWT, authController.deleteAccount);

export default router;
