import { Request } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
  static async login(req: Request): Promise<Object> {
    return AuthService.login(req.body);
  }

  static async refreshToken(req: Request): Promise<Object> {
    return AuthService.refreshToken(req.body);
  }

  static async changePassword(req: Request): Promise<Object> {
    return AuthService.changePassword(req.body);
  }
}
