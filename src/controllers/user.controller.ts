import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";

import { User } from "../entities/user.entity";

import { UserService } from "../services/user.service";

import { generateUuid } from "../utils/generateUuid";

export class UserController {

    static async getAll (req: Request, res: Response): Promise<Response> {
        const items = await UserService.getAll(req.query);
        return res.json(items);
    }

    static async getByAuthUid (req: Request, res: Response): Promise<Response> {
        const {authUid} = req.params;
        const item = await UserService.getUserByAuthUid({authUid});
        return res.json(item);
    }

    static async create (req: Request, res: Response): Promise<Response> {
        const {name, email, password} = req.body;

        const user = new User();
        user.name = name;
        user.email = email;
        user.password = password;
        user.authUid = generateUuid(21);

        const errors = await validate(user, {
            validationError : { target: false, value: false }
        });

        if(errors.length > 0) return res.status(400).json(errors);

        const userRepository = getRepository(User);

        const existing = await userRepository.findOne({
            where:{
                email
            }
        });

        if(existing) {
            return res.status(412).json({success: false, message: `already exists a user with email ${email}`})
        }

        try{
            user.hashPassword();

            const saved = await userRepository.save(user);
            return res.json(saved);
        } catch(e){
            return res.status(409).json({success: false, message: e.message});
        }
    }

    static async update (req: Request, res: Response): Promise<Response> {
        const {id} = req.params;
        const  userRepository = getRepository(User);
        const user = await userRepository.findOne(id);

        if(!user) return res.status(404).json({success: false, message: `user with id ${id} does not exist`});

        const {name, email} = req.body;

        user.name = name ?? user.name;
        user.email = email ?? user.email;

        const errors = await validate(user, {
            validationError : { target: false, value: false }
        });

        if(errors.length > 0) return res.status(400).json(errors);

        const existing = await userRepository.findOne({
            where:{
                email
            }
        });

        if(existing) {
            return res.status(412).json({success: false, message: `already exists a user with email ${email}`})
        }

        try{
            const saved = await userRepository.save(user);
            return res.json(saved);
        } catch(e){
            return res.status(409).json({success: false, message: e.message});
        }
    }

    static async remove (req: Request, res: Response): Promise<Response> {
        const {authUid} = req.params;
        const user = await UserService.remove({authUid});
        return res.json(user);
    }
}