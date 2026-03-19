import { Router } from "express";
 
const route = Router();

route.get('/chat', (req, res) => {
    res.render('chat', {})
});

export default route;
