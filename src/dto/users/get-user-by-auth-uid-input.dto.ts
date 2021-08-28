import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetUserByAuthUidInput {
  @IsNotEmpty()
  @IsString()
  @Expose()
  readonly authUid: string;
}
