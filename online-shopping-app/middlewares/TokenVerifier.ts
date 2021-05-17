import jwt from 'jsonwebtoken';
import express from 'express';

interface Payload {
    user : {
        id : string;
        name : string;
    }
}

const verifyToken = (request:express.Request , response:express.Response , next:express.NextFunction) => {
    let token:any = request.headers['x-auth-token'];
    if(!token){
        return response.status(401).json({errors : [{msg : 'NO Token Provided, Access Denied'}]});
    }
    try {
        console.log('Got a Valid Token');
        let decode:any = jwt.verify(token, process.env.JWT_SECRET_KEY);
        request.headers['user'] = decode.user;
        next();
    }
    catch (error) {
        console.error({msg : 'Invalid Token Provided'});
        return response.status(401).json({errors : [{msg : 'Invalid Token Provided'}]});
    }
};
export  default verifyToken;