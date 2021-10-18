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

  static async resetPassword(req: Request): Promise<Object> {
    return AuthService.resetPassword(req.body);
  }

  static async sendResetPasswordEmail(req: Request): Promise<Object> {
    return AuthService.sendResetPasswordEmail(req.body);
  }

  static async changeEmail(req: Request): Promise<Object> {
    return AuthService.changeEmail(req.body);
  }

  static async confirmEmail(req: Request): Promise<Object> {
    return AuthService.confirmEmail(req.body);
  }
}
