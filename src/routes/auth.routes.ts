import { DtoType } from '../config/dto-type.config';
import { AuthController } from '../controllers/auth.controller';
import { ChangeAuthPasswordInput } from '../dto/auths/change-auth-password-input.dto';
import { LoginAuthInput } from '../dto/auths/login-auth-input.dto';
import { RefreshAuthTokenInput } from '../dto/auths/refresh-auth-token-input.dto';
import { ResetAuthPasswordInput } from '../dto/auths/reset-auth-password-input.dto';
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
  },
  {
    unauthenticatedAvailable: true,
    method: 'post',
    route: '/auth/refresh-token',
    dto: dtoValidation(RefreshAuthTokenInput, DtoType.Body),
    action: AuthController.refreshToken
  },
  {
    unauthenticatedAvailable: true,
    method: 'post',
    route: '/auth/reset-password',
    dto: dtoValidation(ResetAuthPasswordInput, DtoType.Body),
    action: AuthController.resetPassword
  }
];
