import { Router } from 'express'
import * as ctrl from '../controllers/wallet.controllers.js'
import { protect, authorize } from '../middlewares/auth.middleware.js'
import { validate } from '../middlewares/validate.middleware.js';
import { walletAmountSchema } from '../schemas/wallet.schema.js';

const router = Router();

router.get('/', protect, authorize('Administrador'), ctrl.getAll);
router.get('/wallet', protect, ctrl.getMyWallet);
router.get('/:id', protect, authorize('Administrador'), ctrl.getById);
router.put('/:id', protect, authorize('Administrador'), validate(walletAmountSchema), ctrl.updateById);
router.post('/recharge', protect, validate(walletAmountSchema), ctrl.recharge);
router.post('/purchase', protect, validate(walletAmountSchema), ctrl.purchase);


export default router;