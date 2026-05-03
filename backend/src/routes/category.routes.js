import { Router } from "express";
import * as ctrl from '../controllers/category.controller.js'
import { authorize, protect } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { categorySchema } from "../schemas/category.schema.js";

const router = Router();

router.get('/', protect, authorize('Administrador'), ctrl.getAll);
router.get('/:id', protect, authorize('Administrador'), ctrl.getById);
router.post('/', protect, authorize('Administrador'), validate(categorySchema), ctrl.create);
router.put('/:id', protect, authorize('Administrador'), validate(categorySchema), ctrl.update);

export default router