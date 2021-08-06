import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";

import { User } from "../entities/user.entity";

export class UserController {

    static async getAll (req: Request, res: Response): Promise<Response> {
        const  userRepository = getRepository(User);
        const items = await userRepository.find();
        return res.json(items);
    }

    static async getById (req: Request, res: Response): Promise<Response> {
        const {id} = req.params;
        const  userRepository = getRepository(User);
        const item = await userRepository.findOne(id);

        if(!item) return res.status(404).json({message: `user with id ${id} does not exist`});

        return res.json(item);
    }

    static async create (req: Request, res: Response): Promise<Response> {
        const {name, email} = req.body;

        const user = new User();
        user.name = name;
        user.email = email;

        const errors = await validate(user);

        if(errors.length > 0) return res.status(400) .json(errors);

        const userRepository = getRepository(User);

        const existing = await userRepository.findOne({
            where:{
                email
            }
        });

        if(existing) {
            return res.status(412).json({message: `already exists a user with email ${email}`})
        }

        try{
            const saved = await userRepository.save(user);
            return res.json(saved);
        } catch({e}){
            return res.status(409).json({message: e.message});
        }
    }

    static async update (req: Request, res: Response): Promise<Response> {
        const {id} = req.params;
        const  userRepository = getRepository(User);
        const user = await userRepository.findOne(id);

        if(!user) return res.status(404).json({message: `user with id ${id} does not exist`});

        const {name, email} = req.body;

        user.name = name ?? user.name;
        user.email = email ?? user.email;

        const errors = await validate(user);

        if(errors.length > 0) return res.status(400) .json(errors);

        const existing = await userRepository.findOne({
            where:{
                email
            }
        });

        if(existing) {
            return res.status(412).json({message: `already exists a user with email ${email}`})
        }

        try{
            const saved = await userRepository.save(user);
            return res.json(saved);
        } catch({e}){
            return res.status(409).json({message: e.message});
        }
    }

    static async remove (req: Request, res: Response): Promise<Response> {
        const {id} = req.params;
        const  userRepository = getRepository(User);
        const user = await userRepository.findOne(id);

        if(!user) return res.status(404).json({message: `user with id ${id} does not exist`});

        const clone = {...user};

        await userRepository.remove(user);

        return res.json(clone);
    }
}