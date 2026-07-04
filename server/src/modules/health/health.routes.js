import { Router } from 'express';
import * as healthController from './health.controller.js';

const router = Router();

// Define health check endpoint
router.get('/', healthController.checkHealth);

export default router;
