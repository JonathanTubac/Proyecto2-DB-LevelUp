import * as ctrl from '../controllers/compra.controller.js'
import { Router } from 'express'
import { authorize, protect } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/' ,protect, authorize('Administrador') , ctrl.getAll);
router.get('/my', protect, ctrl.getUserCompras);
router.get('/:id', protect, ctrl.getById);
router.post('/', protect, ctrl.create);

export default router;