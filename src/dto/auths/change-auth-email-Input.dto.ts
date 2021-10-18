import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ChangeAuthEmailInput {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @Expose()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  readonly authUid: string;
}
