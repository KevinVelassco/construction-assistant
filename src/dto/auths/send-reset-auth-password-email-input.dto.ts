import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SendResetAuthPasswordEmailInput {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @Expose()
  readonly email: string;
}
