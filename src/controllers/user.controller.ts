import { Request } from 'express';
import { User } from '../entities/user.entity';

import { UserService } from '../services/user.service';

export class UserController {
  static async findAll(req: Request): Promise<User[]> {
    return UserService.findAll(req.query);
  }

  static async findOne(req: Request): Promise<User | null> {
    const { authUid } = req.params;
    return UserService.findOne({ authUid });
  }

  static async create(req: Request): Promise<User> {
    return UserService.create(req.body);
  }

  static async update(req: Request): Promise<User> {
    const { authUid } = req.params;
    return UserService.update({ authUid }, req.body);
  }

  static async remove(req: Request): Promise<User> {
    const { authUid } = req.params;
    return UserService.remove({ authUid });
  }
}
