import { userService as svc } from "../services/user.service.js";
import { toUserResponseDTO } from '../models/dto/user.dto.js'
import jwt from 'jsonwebtoken'

class UserController {
    async register(req, res) {
        try {
            const user = await svc.register(req.body)
            res.status(201).json({ message: 'User created', user: toUserResponseDTO(user) })
        } catch (err) {
            res.status(400).json({ error: err.message })
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body
            const user = await svc.login(email, password)

            //Cookie setting
            const payload = {
                sub: String(user._id), 
                email: user.email, 
                role: user.role,
                username: user.username
            };
            const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "1h"});
            //Add cookie httpOnly
            res.cookie('access_token', token, {
                httpOnly: true,
                sameSite: 'lax',
                secure: false,
                maxAge: 60 * 60 * 1000,
                path: '/'
            })
            res.status(200).json({ message: "Login OK (JWT in cookie)", user: toUserResponseDTO(user), token})
        } catch (err) {
            res.status(400).json({ error: err.message })
        }
    }

    async logout(req, res) {
        try {
            res.clearCookie('access_token', { path: '/' })
            res.status(200).json({ message: 'See you' })
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }

    async current(req, res) {
        try {
            const user = await svc.current(req.user.sub)
            res.status(200).json({ user: toUserResponseDTO(user)})
        } catch (err) {
            res.status(400).json({ error: err.message })
        }
    }

    async update(req, res) {
        try {
            const user = await svc.update(req.params.id, req.body)
            res.status(200).json({ user })
        } catch (err) {
            res.status(400).json({ error: err.message})
        }
    }

    async delete(req, res) {
        try {
            const user = await svc.delete(req.params.id)
            res.status(204).end()
        } catch (err) {
            res.status(400).json({ error: err.message})
        }
    }
}

export const userController = new UserController()