import { Request, Response } from "express";

import { UserService } from "../services/user.service";

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
        const user = await UserService.create(req.body);
        return res.json(user);
    }

    static async update (req: Request, res: Response): Promise<Response> {
        const {authUid} = req.params;
        const user = await UserService.update({authUid}, req.body);
        return res.json(user);
    }

    static async remove (req: Request, res: Response): Promise<Response> {
        const {authUid} = req.params;
        const user = await UserService.remove({authUid});
        return res.json(user);
    }
}