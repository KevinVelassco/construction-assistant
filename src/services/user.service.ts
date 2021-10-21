import { getRepository } from 'typeorm';
import { HttpException } from '../common/http-exception';
import { CreateUserInput } from '../dto/users/create-user-input.dto';
import { FindOneUserInput } from '../dto/users/find-one-user-input.dto';
import { FindAllUsersInput } from '../dto/users/find-all-users-input.dto';
import { GetUserByAuthUidInput } from '../dto/users/get-user-by-auth-uid-input.dto';
import { UpdateUserInput } from '../dto/users/update-user-input.dto';
import { User } from '../entities/user.entity';
import { generateUuid } from '../utils/generateUuid';
import { GetUserByEmailInput } from '../dto/users/get-user-by-email-input.dto';
import { GetUserByAuthUidAndEmailInput } from '../dto/users/get-user-by-auth-uid-and-email-input.dto';
import { AuthService } from './auth.service';

export class UserService {
  static async findAll(findAllUsersInput: FindAllUsersInput): Promise<User[]> {
    const userRepository = getRepository(User);

    const { limit, skip, search } = findAllUsersInput;

    const query = userRepository
      .createQueryBuilder('u')
      .select(['u.id', 'u.authUid', 'u.name', 'u.email']);

    if (search) {
      query
        .where('u.name ilike :search', { search: `%${search}%` })
        .orWhere('u.email ilike :search', { search: `%${search}%` });
    }

    query
      .limit(limit || undefined)
      .offset(skip || 0)
      .orderBy('u.id', 'DESC');

    const items = await query.getMany();

    return items;
  }

  static async findOne(
    findOneUserInput: FindOneUserInput
  ): Promise<User | null> {
    const userRepository = getRepository(User);

    const { authUid } = findOneUserInput;

    const user = await userRepository.findOne({
      select: ['id', 'authUid', 'name', 'email'],
      where: {
        authUid
      }
    });

    return user || null;
  }

  static async create(createUserInput: CreateUserInput): Promise<User> {
    const userRepository = getRepository(User);

    const { email } = createUserInput;

    const existing = await userRepository.findOne({
      where: {
        email
      }
    });

    if (existing) {
      throw new HttpException(412, `already exists a user with email ${email}`);
    }

    const created = userRepository.create({
      ...createUserInput,
      authUid: generateUuid(21)
    });

    let saved: User;

    try {
      created.hashPassword();
      saved = await userRepository.save(created);
    } catch (e) {
      throw new HttpException(409, 'something goes wrong!');
    }

    AuthService.sendConfirmationEmail({
      authUid: saved.authUid,
      newAccount: true
    }).catch(console.error);

    return saved;
  }

  static async update(
    getUserByAuthUidInput: GetUserByAuthUidInput,
    updateUserInput: UpdateUserInput
  ): Promise<User> {
    const userRepository = getRepository(User);

    const { authUid } = getUserByAuthUidInput;

    const user = await this.getUserByAuthUid({ authUid });

    if (!user)
      throw new HttpException(
        404,
        `user with authUid ${authUid} does not exist`
      );

    const merged = userRepository.merge(user, updateUserInput);

    try {
      const saved = await userRepository.save(merged);
      return saved;
    } catch (e) {
      throw new HttpException(409, 'something goes wrong!');
    }
  }

  static async remove(
    getUserByAuthUidInput: GetUserByAuthUidInput
  ): Promise<User> {
    const { authUid } = getUserByAuthUidInput;

    const userRepository = getRepository(User);

    const user = await this.getUserByAuthUid({ authUid });

    if (!user)
      throw new HttpException(
        404,
        `user with authUid ${authUid} does not exist`
      );

    await userRepository.softRemove(user);

    return user;
  }

  static async getUserByAuthUid(
    getUserByAuthUidInput: GetUserByAuthUidInput
  ): Promise<User | null> {
    const userRepository = getRepository(User);

    const { authUid } = getUserByAuthUidInput;

    const user = await userRepository.findOne({
      where: {
        authUid
      }
    });

    return user || null;
  }

  static async getUserByEmail(
    getUserByEmailInput: GetUserByEmailInput
  ): Promise<User | null> {
    const userRepository = getRepository(User);

    const { email } = getUserByEmailInput;

    const user = await userRepository.findOne({
      where: {
        email
      }
    });

    return user || null;
  }

  static async getUserByAuthUidAndEmail(
    getUserByAuthUidAndEmailInput: GetUserByAuthUidAndEmailInput
  ): Promise<User | null> {
    const userRepository = getRepository(User);

    const { authUid, email } = getUserByAuthUidAndEmailInput;

    const user = await userRepository.findOne({
      where: {
        authUid,
        email
      }
    });

    return user || null;
  }
}
