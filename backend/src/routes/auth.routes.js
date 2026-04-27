import { Router } from "express";
import * as ctrl from '../controllers/auth.controller.js'

const router = Router();

router.post('/register', ctrl.register);
router.post('/login', ctrl.login);
router.post('/refresh', ctrl.refresh);
router.post('/logout', ctrl.logout);

export default router;