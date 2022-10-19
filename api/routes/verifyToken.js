const jwt = require("jsonwebtoken");

const verifyToken = (req,res,next)=>{
    const authHeader = req.headers.token;
    if(authHeader){
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SEC, (err,user)=>{
            if(err) res.status(403).json("Token is not valid!"); // it can be expired or wrong token
            // if everything is ok
            req.user = user;
            next();
        })
    }else{
        return res.status(401).json("You are not authenticated!");
    }
};

const verifyTokenAndAuthorization = (req,res,next)=>{
    verifyToken(req,res,()=>{
        // should decide whether this token belongs to clients or admin or not
        // if request and user we are keeping inside our id I can use it, 
        // continue root function next()
        if(req.user.id === req.params.id || req.user.isAdmin ){
            next();
        }else{
            res.status(403).json("You are not allowed to do that!");
        }
    });
};

const verifyTokenAndAdmin = (req,res,next)=>{
    verifyToken(req,res,()=>{
        // should decide whether this token belongs to clients or admin or not
        // if request and user we are keeping inside our id I can use it, 
        // continue root function next()
        if( req.user.isAdmin ){
            next();
        }else{
            res.status(403).json("You are not allowed to do that!");
        }
    });
};

module.exports = { verifyToken, verifyTokenAndAuthorization,verifyTokenAndAdmin };