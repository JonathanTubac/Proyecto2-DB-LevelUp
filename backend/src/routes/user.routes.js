import * as ctrl from '../controllers/user.controller.js'
import { Router } from 'express'
import { authorize, protect } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', protect, authorize('Administrador'), ctrl.getAll);
router.get('/:id', protect, authorize('Administrador'), ctrl.getById);
router.post('/', protect, authorize('Administrador'), ctrl.create);
router.put('/:id', protect, authorize('Administrador'), ctrl.update)
router.delete('/:id', protect, authorize('Administrador'), ctrl.remove)

export default router;