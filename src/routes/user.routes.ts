import { Router } from "express";
import { DtoType } from "../config/keys.config";
import { UserController } from "../controllers/user.controller";
import { GetAllUsersInput } from "../dto/users/get-all-users-input.dto";
import { GetUserByAuthUidInput } from "../dto/users/get-user-by-auth-uid-input.dto";
import { dtoValidation } from "../middlewares/dto-validation";
import { checkJwt } from "../middlewares/jwt";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.get('/',
    [checkJwt, dtoValidation(GetAllUsersInput, DtoType.Query)],
    asyncHandler(UserController.getAll));
router.get('/:authUid', checkJwt, UserController.getByAuthUid);
router.post('/', checkJwt, UserController.create);
router.put('/:id', checkJwt, UserController.update);
router.delete('/:authUid',
    [checkJwt, dtoValidation(GetUserByAuthUidInput, DtoType.Params)],
    asyncHandler(UserController.remove));

export default router;