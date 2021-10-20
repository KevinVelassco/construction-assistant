import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SendAuthConfirmationEmailInput {
  @IsNotEmpty()
  @IsString()
  readonly authUid: string;

  @IsOptional()
  @IsBoolean()
  readonly newAccount?: boolean;
}
