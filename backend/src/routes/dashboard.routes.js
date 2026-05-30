import { Router } from 'express';
import * as ctrl from '../controllers/dashboard.controller.js';
import { protect, authorize } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', protect, authorize('Administrador', 'Gerente'), ctrl.getMetrics);

export default router;