import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../entities/user.entity";

class AuthController {
    static async login (req: Request, res: Response): Promise<Response> {
        const {email, password} = req.body;

        if(!email || !password) {
            return res.status(400).json({message: 'email and password are required.'});
        }

        const userRepository = getRepository(User);

        const user = await userRepository.findOne({
            where : {
                email
            }
        });

        if(!user) {
            return res.status(400).json({message: 'email or password are incorrect'});
        }

        if(!user.checkPassword(password)) {
            return res.status(400).json({message: 'email or password are incorrect'});
        }

        return res.json({
            name: user.name,
            email: user.email
        });
    }
}

export default AuthController;