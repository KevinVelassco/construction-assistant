import { NextFunction, Request, Response } from "express";
import * as jwt from 'jsonwebtoken';
import { getRepository } from "typeorm";

import { User } from "../entities/user.entity";

export const checkJwt = async (req: Request, res: Response, next: NextFunction) => {
    const authorization = <string>req.headers['authorization'];

    if (!authorization) {
        return res.status(401).json({ success: false, message: 'authorization header not found'});
    }

    const authenticationScheme: string = authorization.split(' ')[0];
    const token: string = authorization.split(' ')[1];

    if (!(authenticationScheme && token)) {
        return res.status(401).json({ success: false, message: 'invalid auth header'});
    }

    if(authenticationScheme !== 'Bearer'){
        return res.status(401).json({ success: false, message: 'invalid auth scheme'});
    }

    let decodedToken: any;

    try{
        decodedToken = jwt.verify(token, process.env.TOKEN_SECRET || 'qwe');
    } catch(e){
        return res.status(401).json({success: false, message: 'invalid token' });
    }

    const {authUid} = decodedToken;

    if(!authUid){
        return res.status(401).json({success: false, message: 'invalid token' });
    }

    const userRepository = getRepository(User);

    const user = await userRepository.findOne({
        where : {
            authUid
        }
    });

    if(!user) {
        return res.status(401).json({success: false, message: 'user does not exist' });
    }

    req.user = user;

    next();
}