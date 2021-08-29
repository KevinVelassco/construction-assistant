import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

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
  @Expose()
  readonly authUid: string;
}
