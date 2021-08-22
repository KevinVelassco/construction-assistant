import { DtoType } from "../config/keys.config";
import AuthController from "../controllers/auth.controller";
import { LoginAuthInput } from "../dto/auths/login-auth-input.dto";
import { dtoValidation } from "../middlewares/dto-validation";

export const auth = [
    {
        unauthenticatedAvailable: true,
        method: 'post',
        route: '/auth/login',
        dto: dtoValidation(LoginAuthInput, DtoType.Body),
        action: AuthController.login
    }
];