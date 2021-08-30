import { getRepository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import { HttpException } from '../common/http-exception';
import { LoginAuthInput } from '../dto/auths/login-auth-input.dto';
import { User } from '../entities/user.entity';
import { ChangeAuthPasswordInput } from '../dto/auths/change-auth-password-input.dto';
import { UserService } from './user.service';

export class AuthService {
  static async login(loginAuthInput: LoginAuthInput): Promise<Object> {
    const { email, password } = loginAuthInput;

    if (!(email && password)) {
      throw new HttpException(400, 'email and password are required.');
    }

    const user = await UserService.getUserByEmail({ email });

    if (!(user && user.checkPassword(password))) {
      throw new HttpException(400, 'email or password are incorrect.');
    }

    const token = jwt.sign(
      { authUid: user.authUid },
      process.env.TOKEN_SECRET || 'qwe',
      { expiresIn: '1h' }
    );

    return {
      success: true,
      token
    };
  }

  static async changePassword(
    changeAuthPasswordInput: ChangeAuthPasswordInput
  ): Promise<Object> {
    const { authUid } = changeAuthPasswordInput;

    const existing = await UserService.getUserByAuthUid({ authUid });

    if (!existing)
      throw new HttpException(
        404,
        `can't get the user with authUid ${authUid}`
      );

    const { oldPassword } = changeAuthPasswordInput;

    const isValidPassword = existing.checkPassword(oldPassword);

    if (!isValidPassword)
      throw new HttpException(400, 'old password is invalid.');

    const { newPassword } = changeAuthPasswordInput;

    const isSameOldPassword = existing.checkPassword(newPassword);

    if (isSameOldPassword)
      throw new HttpException(
        400,
        'the new password must be different from the old one.'
      );

    const userRepository = getRepository(User);

    const merged = userRepository.merge(existing, {
      password: changeAuthPasswordInput.newPassword
    });

    try {
      merged.hashPassword();

      await userRepository.save(merged);
      return { success: true, message: 'password changed successfully.' };
    } catch (e) {
      throw new HttpException(409, e.message);
    }
  }
}
