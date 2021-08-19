import { Router } from "express";
import { DtoType } from "../config/keys.config";
import { UserController } from "../controllers/user.controller";
import { CreateUserInput } from "../dto/users/create-user-input.dto";
import { GetAllUsersInput } from "../dto/users/get-all-users-input.dto";
import { GetUserByAuthUidInput } from "../dto/users/get-user-by-auth-uid-input.dto";
import { UpdateUserInput } from "../dto/users/update-user-input.dto";
import { dtoValidation } from "../middlewares/dto-validation";
import { checkJwt } from "../middlewares/jwt";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.get('/',
    [checkJwt, dtoValidation(GetAllUsersInput, DtoType.Query)],
    asyncHandler(UserController.getAll));

router.get('/:authUid',
    [checkJwt, dtoValidation(GetUserByAuthUidInput, DtoType.Params)],
    UserController.getByAuthUid);

router.post('/',
    [checkJwt, dtoValidation(CreateUserInput, DtoType.Body)],
    asyncHandler(UserController.create));

router.put('/:authUid',
    [
        checkJwt,
        dtoValidation(GetUserByAuthUidInput, DtoType.Params),
        dtoValidation(UpdateUserInput, DtoType.Body)
    ],
    asyncHandler(UserController.update));

router.delete('/:authUid',
    [checkJwt, dtoValidation(GetUserByAuthUidInput, DtoType.Params)],
    asyncHandler(UserController.remove));

export default router;