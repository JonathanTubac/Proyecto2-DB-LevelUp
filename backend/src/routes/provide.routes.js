import { Router } from "express";
import * as ctrl from '../controllers/provide.controller.js'
import { authorize, protect } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { provideSchema, updateProvideSchema } from "../schemas/provide.schema.js";

const router = Router();

router.get('/', protect, authorize('Administrador'), ctrl.getAll);
router.post('/', protect, authorize('Administrador'), validate(provideSchema), ctrl.create);
router.put('/:id', protect, authorize('Administrador'), validate(updateProvideSchema), ctrl.update);

export default router;