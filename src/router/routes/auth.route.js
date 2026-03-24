import { Router } from 'express';
import { userController as ctrl} from '../../controllers/user.controller.js'
import { alreadyLogin, requireJWT } from "../../middleware/auth.middleware.js";

const router = new Router();

router.post('/api/auth/register', alreadyLogin, (req, res) => ctrl.register(req, res))
router.post('/api/auth/login', (req, res) => ctrl.login(req, res))
router.post('/api/auth/logout', requireJWT, (req, res) => ctrl.logout(req, res))
router.get('/api/auth/current', requireJWT, (req, res) => ctrl.current(req, res))

export default router;