import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class GetUserByEmailInput {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MaxLength(50)
  @Expose()
  readonly email: string;
}
