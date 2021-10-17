import { getRepository } from 'typeorm';
import { HttpException } from '../common/http-exception';
import { VerificationCode } from '../entities/verification-code.entity';
import { generateUuid } from '../utils/generateUuid';
import { CreateVerificationCodeInput } from '../dto/verification-codes/create-verification-code-input.dto';
import { ValidateVerificationCodeInput } from '../dto/verification-codes/validate-verification-code-input.dto';

export class VerificationCodeService {
  static async create(
    createVerificationCodeInput: CreateVerificationCodeInput
  ): Promise<VerificationCode> {
    const verificationCodeRepository = getRepository(VerificationCode);

    const created = verificationCodeRepository.create({
      ...createVerificationCodeInput,
      code: generateUuid(10)
    });

    const saved = await verificationCodeRepository.save(created);

    return saved;
  }

  static async validate(
    validateVerificationCodeInput: ValidateVerificationCodeInput
  ): Promise<VerificationCode> {
    const { code } = validateVerificationCodeInput;

    const verificationCodeRepository = getRepository(VerificationCode);

    const existing = await verificationCodeRepository.findOne({
      where: {
        code
      },
      relations: ['user']
    });

    if (!existing) {
      throw new HttpException(
        404,
        `the code ${code} is invalid, probably because it was already used.`
      );
    }

    const currentDate = new Date();

    const { expirationDate } = existing;

    if (currentDate.getTime() > expirationDate.getTime()) {
      throw new HttpException(409, `the verification code ${code} is expired.`);
    }

    const { type } = validateVerificationCodeInput;

    if (type !== existing.type) {
      throw new HttpException(
        409,
        `the verification code ${code} doesn't have the expected type.`
      );
    }

    return existing;
  }
}
