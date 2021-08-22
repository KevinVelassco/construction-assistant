import { DtoType } from "../config/keys.config";
import { UserController } from "../controllers/user.controller";
import { CreateUserInput } from "../dto/users/create-user-input.dto";
import { GetAllUsersInput } from "../dto/users/get-all-users-input.dto";
import { GetUserByAuthUidInput } from "../dto/users/get-user-by-auth-uid-input.dto";
import { UpdateUserInput } from "../dto/users/update-user-input.dto";
import { dtoValidation } from "../middlewares/dto-validation";

export const user = [
    {
        method: 'get',
        route: '/users',
        dto: dtoValidation(GetAllUsersInput, DtoType.Query),
        action: UserController.getAll
    },
    {
        method: 'get',
        route: '/users/:authUid',
        dto: dtoValidation(GetUserByAuthUidInput, DtoType.Params),
        action: UserController.getByAuthUid
    },
    {
        method: 'post',
        route: '/users',
        dto: dtoValidation(CreateUserInput, DtoType.Body),
        action: UserController.create
    },
    {
        method: 'put',
        route: '/users/:authUid',
        dto: [
            dtoValidation(GetUserByAuthUidInput, DtoType.Params),
            dtoValidation(UpdateUserInput, DtoType.Body)
        ],
        action: UserController.update
    },
    {
        method: 'delete',
        route: '/users/:authUid',
        dto: dtoValidation(GetUserByAuthUidInput, DtoType.Params),
        action: UserController.remove
    }
];