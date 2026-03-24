import { messageService as svc } from '../services/message.service.js'

class MessageController {
    async findByWord(req, res) {
        try {
            const { word } = req.query
            const msj = await svc.findByWord(word)
            res.status(200).json({ msj })
        } catch (err) {
            res.status(400).json({ error: err.message })
        }
    }
}

export const messageController = new MessageController()