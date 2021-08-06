import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { IsEmail, IsNotEmpty, IsString, MaxLength } from "class-validator";

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

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}