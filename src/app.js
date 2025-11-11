import express from "express";
import ViewRoutes from "./routes/view.route.js";
import path from "node:path";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import { v4 as uuidv4 } from 'uuid'
import fs from "fs"

const app = express();

let BBDD = []
let users = []
const userPath = path.join(process.cwd(), 'src', 'db', 'user.json')
const chatPath = path.join(process.cwd(), 'src', 'db', 'chat.json')

//handlebars config
app.engine('handlebars', handlebars.engine());
app.set('views', path.join(process.cwd(), 'src', 'views'));
app.set('view engine', 'handlebars')

// client config
app.use(express.static(path.join(process.cwd(), 'src', 'public')));

//routes config
app.use('/', ViewRoutes);

const serverHTTP = app.listen(8080, () => {
    console.log("server ON")
});

const io = new Server(serverHTTP);


io.on('connection', (socket) => {
    console.log('probando conectar usuario -> id:', socket.id)

    if(fs.existsSync(chatPath)) {
        BBDD = JSON.parse(fs.readFileSync(chatPath, 'utf-8'))
    } else {
        BBDD = []
    }

    socket.emit('msjList', BBDD)
    
    socket.on('userList', (data) => {
        //users = JSON.parse(fs.readFileSync(userPath, 'utf-8'))
        const newUser = {data, id: socket.id}
        users.push(newUser)
        //fs.writeFileSync(userPath, JSON.stringify(users))  

        io.emit('updateUsers', users)
    })

    socket.on('disconnect', () => {
        console.log('Usuario desconectado -> id:', socket.id)

        //users = JSON.parse(fs.readFileSync(userPath, 'utf-8'))

        users = users.filter(u => u.id !== socket.id)

        //fs.writeFileSync(userPath, JSON.stringify(users))

        io.emit('userList', users)
    })

    socket.on('msj', (payload) => {

        BBDD = JSON.parse(fs.readFileSync(chatPath, 'utf-8'))
        BBDD.push(payload)
        fs.writeFileSync(chatPath, JSON.stringify(BBDD))

        io.emit('msjList', BBDD)
    })
})