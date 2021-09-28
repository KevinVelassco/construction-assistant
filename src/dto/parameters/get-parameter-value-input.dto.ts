import { Expose } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength
} from 'class-validator';

export class GetParameterValueInput {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @Expose()
  readonly name: string;

  @IsOptional()
  @IsBoolean()
  @Expose()
  readonly checkExisting?: boolean;
}
