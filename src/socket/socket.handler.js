import jwt from 'jsonwebtoken'
import { messageService as svc} from '../services/message.service.js'

const connectedUsers = [];

export function initSocket(io) {
    io.on('connection', async (socket) => {

        //Verify JWT
        const token = socket.handshake.auth.token
        if(!token) return socket.disconnect()

        let currentUser
        try {
            currentUser = jwt.verify( token, process.env.JWT_SECRET)
        } catch {
            return socket.disconnect()
        }

        //Add user to connected users
        connectedUsers.push({
            username: currentUser.username,
            email: currentUser.email,
            socketId: socket.id
        })

         //Chat Historial
        const messages = await svc.findAll()
        socket.emit('msjList', messages)

        //Listen new message
        socket.on('msj', async (payload) => {
            await svc.create(payload)
            const messages = await svc.findAll()
            io.emit('msjList', messages)
        })

        //Update message
        socket.on('updateMsj', async (payload) => {
            const { id, ...data } = payload
            await svc.update(id, data)
            const messages = await svc.findAll()
            io.emit('msjList', messages)
        })

        //Delete message
        socket.on('deleteMsj', async (payload) => {
            const { id } = payload
            await svc.delete(id)
            const messages = await svc.findAll()
            io.emit('msjList', messages)            
        })

        //Disconnect user
        socket.on('disconnect', () => {
            console.log('Disconnect User -> id:', socket.id)

            const index = connectedUsers.findIndex(u => u.socketId === socket.id)
            if(index !== -1) connectedUsers.splice(index, 1)

            io.emit('updateUsers', connectedUsers)
        })

        //Users
        io.emit('updateUsers', connectedUsers)
    })
}
