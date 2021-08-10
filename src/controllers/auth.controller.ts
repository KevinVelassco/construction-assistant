import { Request, Response } from "express";
import { getRepository } from "typeorm";

import { User } from "../entities/user.entity";

import * as jwt from 'jsonwebtoken';

class AuthController {
    static async login (req: Request, res: Response): Promise<Response> {
        const {email, password} = req.body;

        if(!(email && password)) {
            return res.status(400).json({message: 'email and password are required.'});
        }

        const userRepository = getRepository(User);

        const user = await userRepository.findOne({
            where : {
                email
            }
        });

        if(!(user && user.checkPassword(password))) {
            return res.status(400).json({message: 'email or password are incorrect'});
        }

        const token = jwt.sign({authUid: user.authUid}, process.env.TOKEN_SECRET || 'qwe', {expiresIn: '1h'});

        return res.json({success: true, token});
    }
}

export default AuthController;