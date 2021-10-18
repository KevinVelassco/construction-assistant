import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class ResetAuthPasswordInput {
  @IsNotEmpty()
  @IsString()
  @Expose()
  readonly code: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  readonly password: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  readonly confirmedPassword: string;
}
