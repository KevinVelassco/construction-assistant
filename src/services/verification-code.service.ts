import { getRepository } from 'typeorm';
import { VerificationCode } from '../entities/verification-code.entity';
import { generateUuid } from '../utils/generateUuid';
import { CreateVerificationCodeInput } from '../dto/verification-codes/create-verification-code-input.dto';

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
}
