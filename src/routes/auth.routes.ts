import { DtoType } from '../config/dto-type.config';
import { AuthController } from '../controllers/auth.controller';
import { ChangeAuthEmailInput } from '../dto/auths/change-auth-email-Input.dto';
import { ChangeAuthPasswordInput } from '../dto/auths/change-auth-password-input.dto';
import { ConfirmUserAuthEmailInput } from '../dto/auths/confirm-user-auth-email-input.dto';
import { LoginAuthInput } from '../dto/auths/login-auth-input.dto';
import { RefreshAuthTokenInput } from '../dto/auths/refresh-auth-token-input.dto';
import { ResetAuthPasswordInput } from '../dto/auths/reset-auth-password-input.dto';
import { SendResetAuthPasswordEmailInput } from '../dto/auths/send-reset-auth-password-email-input.dto';
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
  },
  {
    unauthenticatedAvailable: true,
    method: 'post',
    route: '/auth/send-reset-password-email',
    dto: dtoValidation(SendResetAuthPasswordEmailInput, DtoType.Body),
    action: AuthController.sendResetPasswordEmail
  },
  {
    method: 'put',
    route: '/auth/change-email',
    dto: dtoValidation(ChangeAuthEmailInput, DtoType.Body),
    action: AuthController.changeEmail
  },
  {
    method: 'put',
    route: '/auth/confirm-email',
    dto: dtoValidation(ConfirmUserAuthEmailInput, DtoType.Body),
    action: AuthController.confirmEmail
  }
];
