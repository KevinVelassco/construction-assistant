import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { IsEmail, IsNotEmpty, IsString, MaxLength } from "class-validator";

import bcrypt from 'bcrypt';

@Entity('users')
@Unique('uq_email', ['email'])
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 100})
    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    name: string;

    @Column({type: 'varchar', length: 50})
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    @MaxLength(50)
    email: string;

    @Column({type: 'varchar', length: 100})
    @IsNotEmpty()
    @IsString()
    password: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    hashPassword(): void {
        const salt = bcrypt.genSaltSync(10);
        this.password = bcrypt.hashSync(this.password, salt);
    }

    checkPassword(password: string): boolean {
        return bcrypt.compareSync(password, this.password);
    }
}