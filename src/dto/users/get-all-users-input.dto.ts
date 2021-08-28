import { Expose } from 'class-transformer';
import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class GetAllUsersInput {
  @IsOptional()
  @IsNumberString()
  @Expose()
  readonly limit?: number;

  @IsOptional()
  @IsNumberString()
  @Expose()
  readonly skip?: number;

  @IsOptional()
  @IsString()
  @Expose()
  readonly search?: string;
}
