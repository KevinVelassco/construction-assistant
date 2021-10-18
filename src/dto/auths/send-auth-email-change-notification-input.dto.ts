import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SendAuthEmailChangeNotificationInput {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  readonly oldEmail: string;

  @IsNotEmpty()
  @IsString()
  readonly authUid: string;
}
