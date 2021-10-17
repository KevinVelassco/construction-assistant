import { User } from '../../entities/user.entity';
import { VerificationCodeType } from '../../entities/verification-code.entity';

export class CreateVerificationCodeInput {
  readonly expirationDate: Date;
  readonly type: VerificationCodeType;
  readonly user: User;
}
