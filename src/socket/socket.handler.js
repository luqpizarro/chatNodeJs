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

        socket.on('disconnect', () => {
            console.log('Disconnect User -> id:', socket.id)

            const index = connectedUsers.findIndex(u => u.socketId === socket.id)
            if(index !== -1) connectedUsers.splice(index, 1)

            io.emit('updateUsers', connectedUsers)
        })
    })
}

// import express from "express";
// import ViewRoutes from "./src/routes/view.route.js";
// import path from "node:path";
// import handlebars from "express-handlebars";
// import { Server } from "socket.io";
// import { v4 as uuidv4 } from 'uuid'
// import fs from "fs"

// const app = express();

// let BBDD = []
// let users = []
// const userPath = path.join(process.cwd(), 'src', 'db', 'user.json')
// const chatPath = path.join(process.cwd(), 'src', 'db', 'chat.json')

// //handlebars config
// app.engine('handlebars', handlebars.engine());
// app.set('views', path.join(process.cwd(), 'src', 'views'));
// app.set('view engine', 'handlebars')

// // client config
// app.use(express.static(path.join(process.cwd(), 'src', 'public')));

// //routes config
// app.use('/', ViewRoutes);

// const serverHTTP = app.listen(8080, () => {
//     console.log("server ON")
// });

// const io = new Server(serverHTTP);


// io.on('connection', (socket) => {
//     console.log('probando conectar usuario -> id:', socket.id)

//     if(fs.existsSync(chatPath)) {
//         BBDD = JSON.parse(fs.readFileSync(chatPath, 'utf-8'))
//     } else {
//         BBDD = []
//     }

//     socket.emit('msjList', BBDD)
    
//     socket.on('userList', (data) => {
//         users = JSON.parse(fs.readFileSync(userPath, 'utf-8'))
//         const newUser = {data, id: socket.id}

//         if(users.find( u => u.data === newUser.data )){
//             socket.emit('userExist')
//             return
//         } 
//         users.push(newUser)
//         fs.writeFileSync(userPath, JSON.stringify(users))  
//         io.emit('updateUsers', users)
//     })

//     socket.on('disconnect', () => {
//         console.log('Usuario desconectado -> id:', socket.id)

//         //users = JSON.parse(fs.readFileSync(userPath, 'utf-8'))

//         users = users.filter(u => u.id !== socket.id)

//         //fs.writeFileSync(userPath, JSON.stringify(users))

//         io.emit('userList', users)
//     })

//     socket.on('msj', (payload) => {

//         BBDD = JSON.parse(fs.readFileSync(chatPath, 'utf-8'))
//         BBDD.push(payload)
//         fs.writeFileSync(chatPath, JSON.stringify(BBDD))

//         io.emit('msjList', BBDD)
//     })
// })