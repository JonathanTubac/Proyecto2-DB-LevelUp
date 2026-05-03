import { Router } from "express";
import * as ctrl from '../controllers/provider.controller.js'
import { authorize, protect } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { providerSchema } from "../schemas/provider.schema.js";

const router = Router();

router.get('/', protect, authorize('Administrador'), ctrl.getAll);
router.get('/:id', protect, authorize('Administrador'), ctrl.getById);
router.post('/', protect, authorize('Administrador'), validate(providerSchema), ctrl.create);
router.put('/:id', protect, authorize('Administrador'), validate(providerSchema), ctrl.updateById);
router.delete('/:id', protect, authorize('Administrador'), ctrl.deactivateById);

export default router;