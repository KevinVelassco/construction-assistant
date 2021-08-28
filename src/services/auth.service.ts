import { getRepository } from 'typeorm';
import { HttpException } from '../common/http-exception';
import { LoginAuthInput } from '../dto/auths/login-auth-input.dto';
import { User } from '../entities/user.entity';
import * as jwt from 'jsonwebtoken';

export class AuthService {
  static async login(loginAuthInput: LoginAuthInput): Promise<any> {
    const { email, password } = loginAuthInput;

    if (!(email && password)) {
      throw new HttpException(400, 'email and password are required.');
    }

    const userRepository = getRepository(User);

    const user = await userRepository.findOne({
      where: {
        email
      }
    });

    if (!(user && user.checkPassword(password))) {
      throw new HttpException(400, 'email or password are incorrect');
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
}
