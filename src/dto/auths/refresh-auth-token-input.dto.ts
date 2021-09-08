import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshAuthTokenInput {
  @IsNotEmpty()
  @IsString()
  @Expose()
  readonly refreshToken: string;
}
