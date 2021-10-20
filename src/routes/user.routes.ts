import { DtoType } from '../config/dto-type.config';
import { UserController } from '../controllers/user.controller';
import { CreateUserInput } from '../dto/users/create-user-input.dto';
import { FindOneUserInput } from '../dto/users/find-one-user-input.dto';
import { FindAllUsersInput } from '../dto/users/find-all-users-input.dto';
import { GetUserByAuthUidInput } from '../dto/users/get-user-by-auth-uid-input.dto';
import { UpdateUserInput } from '../dto/users/update-user-input.dto';
import { dtoValidation } from '../middlewares/dto-validation';
import { Route } from './index.routes';

export const user: Array<Route> = [
  {
    method: 'get',
    route: '/users',
    dto: dtoValidation(FindAllUsersInput, DtoType.Query),
    action: UserController.findAll
  },
  {
    method: 'get',
    route: '/users/:authUid',
    dto: dtoValidation(FindOneUserInput, DtoType.Params),
    action: UserController.findOne
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
