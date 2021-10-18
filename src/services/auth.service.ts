import { getRepository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import { HttpException } from '../common/http-exception';
import { LoginAuthInput } from '../dto/auths/login-auth-input.dto';
import { User } from '../entities/user.entity';
import { ChangeAuthPasswordInput } from '../dto/auths/change-auth-password-input.dto';
import { UserService } from './user.service';
import { RefreshAuthTokenInput } from '../dto/auths/refresh-auth-token-input.dto';
import { TemplateService } from '../templates/template.service';
import { MailgunService } from '../plugins/mailgun/mailgun.service';
import { ParameterService } from './parameter.service';
import { SendAuthPasswordUpdateEmailInput } from '../dto/auths/send-auth-password-update-email-input.dto';

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

    const accessToken = jwt.sign(
      { authUid: user.authUid },
      <string>process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION }
    );

    const refreshToken = jwt.sign(
      { authUid: user.authUid },
      <string>process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION }
    );

    return {
      success: true,
      accessToken,
      refreshToken
    };
  }

  static async refreshToken(
    refreshAuthTokenInput: RefreshAuthTokenInput
  ): Promise<Object> {
    const { refreshToken } = refreshAuthTokenInput;

    let decodedToken: any;

    try {
      decodedToken = jwt.verify(
        refreshToken,
        <string>process.env.REFRESH_TOKEN_SECRET
      );
    } catch (e) {
      throw new HttpException(400, 'invalid token.');
    }

    const existing = await UserService.getUserByAuthUid({
      authUid: decodedToken.authUid
    });

    if (!existing)
      throw new HttpException(
        404,
        `can't get the user with authUid ${decodedToken.authUid}`
      );

    const accessToken = jwt.sign(
      { authUid: existing.authUid },
      <string>process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION }
    );

    return { success: true, accessToken: accessToken };
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

  private static async sendPasswordUpdateEmail(
    sendAuthPasswordUpdateEmailInput: SendAuthPasswordUpdateEmailInput
  ) {
    const { authUid, email } = sendAuthPasswordUpdateEmailInput;

    const existing = await UserService.getUserByAuthUidAndEmail({
      authUid,
      email
    });

    if (!existing) {
      throw new HttpException(
        404,
        `can't get the user with email ${email} for the authUid ${authUid}`
      );
    }

    const html = TemplateService.generateHtmlByTemplate(
      'updated-password-notification',
      {
        email,
        name: existing.name,
        link: `${process.env.SELF_WEB_URL}recover-password`
      }
    );

    const from = <string>process.env.MAILGUN_EMAIL_FROM;

    const parameterName = 'UPDATED_PASSWORD_EMAIL_SUBJECT';

    const subject = await ParameterService.getParameterValue({
      name: parameterName
    });

    await MailgunService.sendEmail({
      from,
      to: email,
      subject: <string>subject,
      html
    });
  }
}
