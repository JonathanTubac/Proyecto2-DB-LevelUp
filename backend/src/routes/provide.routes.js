import { Router } from "express";
import * as ctrl from '../controllers/provide.controller.js'
import { authorize, protect } from "../middlewares/auth.middleware.js";

const router = Router();

router.get('/', protect, authorize('Administrador'), ctrl.getAll);
router.post('/', protect, authorize('Administrador'), ctrl.create);

export default router;