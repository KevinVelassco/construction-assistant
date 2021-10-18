import { IsNotEmpty, IsString } from 'class-validator';

export class SendAuthConfirmationEmailInput {
  @IsNotEmpty()
  @IsString()
  readonly authUid: string;
}
