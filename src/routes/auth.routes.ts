import { DtoType } from '../config/dto-type.config';
import { AuthController } from '../controllers/auth.controller';
import { ChangeAuthPasswordInput } from '../dto/auths/change-auth-password-input.dto';
import { LoginAuthInput } from '../dto/auths/login-auth-input.dto';
import { dtoValidation } from '../middlewares/dto-validation';

export const auth = [
  {
    unauthenticatedAvailable: true,
    method: 'post',
    route: '/auth/login',
    dto: dtoValidation(LoginAuthInput, DtoType.Body),
    action: AuthController.login
  },
  {
    method: 'put',
    route: '/auth/change-password',
    dto: dtoValidation(ChangeAuthPasswordInput, DtoType.Body),
    action: AuthController.changePassword
  }
];
