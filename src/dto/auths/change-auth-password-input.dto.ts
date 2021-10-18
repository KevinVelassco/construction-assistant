import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ChangeAuthPasswordInput {
  @IsNotEmpty()
  @IsString()
  @Expose()
  readonly oldPassword: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  readonly newPassword: string;

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
