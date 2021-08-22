import { Expose } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class LoginAuthInput {
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    @MaxLength(50)
    @Expose()
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    @Expose()
    readonly password: string;
}