import { Request } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
  static async login(req: Request): Promise<any> {
    return AuthService.login(req.body);
  }
}
