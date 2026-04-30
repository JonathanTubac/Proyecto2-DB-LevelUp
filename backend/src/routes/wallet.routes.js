import { Router } from 'express'
import * as ctrl from '../controllers/wallet.controllers.js'
import { protect, authorize } from '../middlewares/auth.middleware.js'

const router = Router();

router.get('/', protect, authorize('Administrador'), ctrl.getAll);
router.get('/wallet', protect, ctrl.getMyWallet);
router.get('/:id', protect, authorize('Administrador'), ctrl.getById);
router.put('/:id', protect, authorize('Administrador'), ctrl.updateById);
router.post('/recharge', protect, ctrl.recharge);
router.post('/purchase', protect, ctrl.purchase);


export default router;