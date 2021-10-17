import { VerificationCodeType } from '../../entities/verification-code.entity';

export class ValidateVerificationCodeInput {
  readonly code: string;
  readonly type: VerificationCodeType;
}
