import express from 'express';
import path from 'path';
import viewRouter from './routes/view.route.js';
import authRouter from './routes/auth.route.js';
import messageRouter from './routes/message.route.js';

export function initRouter(app) {
    //Static files
    app.use(express.static(path.join(process.cwd(), 'src', 'public')))

    //View router
    app.use('/', viewRouter);

    //Message router
    app.use('/', messageRouter);

    //Auth router
    app.use('/', authRouter);

    //Error router
    app.use((req, res) => {
    res.status(404).json({ error: 'Page Not Found'})
    })
}