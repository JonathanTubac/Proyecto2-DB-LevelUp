import * as ctrl from '../controllers/compra.controller.js'
import { Router } from 'express'
import { authorize, protect } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { purchaseSchema } from '../schemas/purchase.schema.js';

const router = Router();

router.get('/' ,protect, authorize('Administrador') , ctrl.getAll);
router.get('/my', protect, ctrl.getUserCompras);
router.get('/:id', protect, ctrl.getById);
router.post('/', protect, validate(purchaseSchema), ctrl.create);

export default router;