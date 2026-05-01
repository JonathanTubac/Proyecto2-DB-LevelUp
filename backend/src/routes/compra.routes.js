import * as ctrl from '../controllers/compra.controller.js'
import { Router } from 'express'
import { protect } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', protect, ctrl.getUserCompras);
router.get('/:id', protect, ctrl.getById);
router.post('/', protect, ctrl.create);

export default router;