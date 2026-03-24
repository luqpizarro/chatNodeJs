import { Router } from "express";
import { alreadyLogin, requireJWT } from "../../middleware/auth.middleware.js";

const router = Router();

router.get('/register', alreadyLogin, (req, res) => res.render('register', {}))
router.get('/login', alreadyLogin, (req, res) => res.render('login', {}))
router.get('/chat', requireJWT, (req, res) => res.render('chat', {}))

export default router;
