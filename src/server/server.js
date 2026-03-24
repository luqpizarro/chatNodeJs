import express from "express";
import { initRouter } from "../router/router.js";
import { Server } from 'socket.io'
import { initSocket } from '../socket/socket.handler.js'

// Import variables de entorno
import environment, {validateEnv} from '../config/env/env.config.js';

// Data Base
import { connectAuto } from "../config/db/connect.config.js";

//middleware
import logger from '../middleware/logger.middleware.js';

//cookie
import cookieParser from "cookie-parser";


//Handlebars
import { engine } from "express-handlebars";
import path from 'path';
import { fileURLToPath } from 'url';
//import { hbsHelpers } from './hbs.helper.js'

const app = express();
const PORT = environment.PORT 

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(logger)
app.use(cookieParser())

export const startServer = async () => {

    // validamos antes de hacer conexion a la base de datos, para ver que todas las variables de entorno existan
    validateEnv()

    //Conectamos a la DB
    await connectAuto()

    // Rutas de Handlebars
    app.engine('handlebars', engine({
        defaultLayout: 'main',
        layoutDir: path.join(process.cwd(), 'src', 'views', 'layouts'),
        //helpers: hbsHelpers,
    }))
    app.set('view engine', 'handlebars');
    app.set('views', path.join(process.cwd(), 'src', 'views'))

    //Inicializar Router
    initRouter(app)

    // Manejo de señales y errores globales
    process.on('unhandledRejection', (reason) => {
        console.error('[process] Unhandled Rejection ', reason);
    });

    process.on('uncaughtException', (err) => {
        console.error('[process] Uncaught Exception ', err);
    });

    process.on('SIGINT', () => {
        console.log('\n[process] SIGINT recibido. Cerrando...');
        process.exit(0);
    });

    const httpServer = app.listen(PORT, () => {
        console.log(`Servidor escuchando desde http://localhost:${PORT}`)
    })

    const io = new Server(httpServer)
    initSocket(io)
}
