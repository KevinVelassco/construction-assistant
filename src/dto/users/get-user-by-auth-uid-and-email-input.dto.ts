import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class GetUserByAuthUidAndEmailInput {
  @IsNotEmpty()
  @IsString()
  readonly authUid: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  readonly email: string;
}
