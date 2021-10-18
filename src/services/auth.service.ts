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
import { ResetAuthPasswordInput } from '../dto/auths/reset-auth-password-input.dto';
import { VerificationCodeService } from './verification-code.service';
import { VerificationCodeType } from '../entities/verification-code.entity';
import { SendResetAuthPasswordEmailInput } from '../dto/auths/send-reset-auth-password-email-input.dto';
import { addTimeToDate, TimeType } from '../utils/addTimeToDate';
import { SendAuthEmailChangeNotificationInput } from '../dto/auths/send-auth-email-change-notification-input.dto';

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
    const { authUid, email } = changeAuthPasswordInput;

    const existing = await UserService.getUserByAuthUidAndEmail({
      authUid,
      email
    });

    if (!existing)
      throw new HttpException(
        404,
        `can't get the user with email ${email} for the authUid ${authUid}`
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
    } catch (e) {
      throw new HttpException(409, 'something goes wrong!');
    }

    this.sendPasswordUpdateEmail({ email, authUid }).catch(console.error);

    return { success: true, message: 'password changed successfully.' };
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

  static async resetPassword(
    resetAuthPasswordInput: ResetAuthPasswordInput
  ): Promise<Object> {
    const { code } = resetAuthPasswordInput;

    const verificationCode = await VerificationCodeService.validate({
      code,
      type: VerificationCodeType.RESET_PASSWORD
    });

    const { password, confirmedPassword } = resetAuthPasswordInput;

    if (password !== confirmedPassword) {
      throw new HttpException(400, 'the passwords do not match.');
    }

    const { user } = verificationCode;

    const userRepository = getRepository(User);

    const merged = userRepository.merge(user, { password });

    try {
      merged.hashPassword();
      await userRepository.save(merged);
    } catch (e) {
      throw new HttpException(409, 'something goes wrong!');
    }

    await VerificationCodeService.delete({ uid: verificationCode.uid });

    const { email, authUid } = user;

    this.sendPasswordUpdateEmail({ email, authUid }).catch(console.error);

    return { success: true, message: 'password changed successfully.' };
  }

  static async sendResetPasswordEmail(
    sendResetAuthPasswordEmailInput: SendResetAuthPasswordEmailInput
  ): Promise<Object> {
    const { email } = sendResetAuthPasswordEmailInput;

    const existing = await UserService.getUserByEmail({ email });

    if (!existing) {
      throw new HttpException(404, `can't get the user with email ${email}`);
    }

    const currentDate = new Date();

    const verificationCode = await VerificationCodeService.create({
      type: VerificationCodeType.RESET_PASSWORD,
      expirationDate: addTimeToDate(currentDate, 1, TimeType.Days),
      user: existing
    });

    const html = TemplateService.generateHtmlByTemplate(
      'password-reset-notification',
      {
        email,
        name: existing.name,
        link: `${process.env.SELF_WEB_URL}change-password?code=${verificationCode.code}`
      }
    );

    const from = <string>process.env.MAILGUN_EMAIL_FROM;

    const parameterName = 'PASSWORD_RESET_EMAIL_SUBJECT';

    const subject = await ParameterService.getParameterValue({
      name: parameterName
    });

    await MailgunService.sendEmail({
      from,
      to: email,
      subject: <string>subject,
      html
    });

    return {
      success: true,
      message: 'password reset instructions email sent.'
    };
  }

  static async sendEmailChangeNotification(
    sendAuthEmailChangeNotificationInput: SendAuthEmailChangeNotificationInput
  ): Promise<Object> {
    const { authUid, oldEmail } = sendAuthEmailChangeNotificationInput;

    const existing = await UserService.getUserByAuthUid({ authUid });

    if (!existing) {
      throw new HttpException(
        404,
        `can't get the user with authUid ${authUid}.`
      );
    }

    const html = TemplateService.generateHtmlByTemplate(
      'email-address-change-notification',
      {
        name: existing.name
      }
    );

    const from = <string>process.env.MAILGUN_EMAIL_FROM;

    const parameterName = 'EMAIL_CHANGE_NOTIFICATION_EMAIL_SUBJECT';

    const subject = await ParameterService.getParameterValue({
      name: parameterName
    });

    await MailgunService.sendEmail({
      from,
      to: oldEmail,
      subject: <string>subject,
      html
    });

    return {
      success: true,
      message: 'email for email change notification sent.'
    };
  }
}
