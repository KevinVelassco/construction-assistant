import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateUserInput {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @Expose()
  readonly name: string;
}
