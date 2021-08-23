import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

export class AuthController {
    static async login (req: Request, res: Response): Promise<any> {
        return AuthService.login(req.body);
    }
}