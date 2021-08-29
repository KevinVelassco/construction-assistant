import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class FindOneUserInput {
  @IsNotEmpty()
  @IsString()
  @Expose()
  readonly authUid: string;
}
