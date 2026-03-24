import jwt from 'jsonwebtoken'

export function alreadyLogin(req, res, next) {
    const token = req.cookies.access_token
    if(token){
        try {
            jwt.verify(token, process.env.JWT_SECRET)
            return res.redirect('/chat')
        } catch (error) {}
    }
    next()
}

//Role authorization
export function requireManyRoles (...roles) {
    return (req, res, next) => {
        if(!req.user) return res.status(401).json({error: "Not Authorized"});
        if(!roles.includes(req.user.role)) return res.status(403).json({ error: "Forbbiden"});
        next();
    }
}

export function requireJWT (req, res, next) {
    const token = req.cookies.access_token
    if (!token) return res.redirect('/login')
    
     try {
        req.user = jwt.verify(token, process.env.JWT_SECRET)
        next()
     } catch (err) {
        return res.redirect('/login')
     }   
}