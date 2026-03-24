import { Router } from "express";
import { messageController as ctrl} from '../../controllers/message.controller.js'
import { requireJWT } from '../../middleware/auth.middleware.js'

const router = Router()

router.get('/api/messages/search', requireJWT, (req, res) => ctrl.findByWord(req, res))

export default router;