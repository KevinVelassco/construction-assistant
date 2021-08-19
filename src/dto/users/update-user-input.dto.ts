import { Expose } from "class-transformer";
import { IsEmail, IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateUserInput {
    @IsOptional()
    @IsString()
    @MaxLength(100)
    @Expose()
    readonly name: string;

    @IsOptional()
    @IsString()
    @IsEmail()
    @MaxLength(50)
    @Expose()
    readonly email: string;
}