import { Router } from "express";
import * as ctrl from '../controllers/product.controller.js'
import { protect, authorize } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { productSchema, updateProductSchema } from "../schemas/product.schema.js";

const router = Router();

router.get('/', protect, ctrl.getAll);
router.get('/:id', protect, ctrl.getById);
router.post('/', protect, authorize('Administrador'), validate(productSchema), ctrl.create);
router.put('/:id', protect, authorize('Administrador'), validate(productSchema), ctrl.update);
router.delete('/:id', protect, authorize('Administrador'), ctrl.deactivate);

export default router