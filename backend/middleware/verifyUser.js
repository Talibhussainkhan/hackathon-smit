import jwt from 'jsonwebtoken';

export const verifyToken = ( req, res, next )=>{
    const token = req.cookies.access_token;
    
    if(!token) return res.json(401).json({  success  : false, message  : 'Unauthorized' }); 

    jwt.verify(token, process.env.JWT_SECRET, ( err, user )=>{
        if(err) return res.json(403).json({ success : false, message : 'Forbidden'  })
        req.user = user;
        next();
    })
}