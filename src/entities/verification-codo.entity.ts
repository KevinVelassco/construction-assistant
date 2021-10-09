import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn
} from 'typeorm';
import { User } from './user.entity';

/* eslint-disable no-unused-vars */
export enum VerificationCodeType {
  CONFIRM_EMAIL = 'CONFIRM_EMAIL',
  RESET_PASSWORD = 'RESET_PASSWORD'
}

@Entity('verification_codes')
@Unique('uq_uid', ['uid'])
export class VerificationCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Generated('uuid')
  @Column()
  uid: string;

  @Column({ type: 'varchar', length: 20 })
  code: string;

  @Column({ name: 'expiration_date', type: 'timestamp' })
  expirationDate: Date;

  @Column({
    type: 'enum',
    enum: VerificationCodeType,
    default: VerificationCodeType.CONFIRM_EMAIL
  })
  type: VerificationCodeType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // ralations

  @ManyToOne(() => User, (user: User) => user.verificationCodes)
  @JoinColumn({ name: 'user_id' })
  user: User;
}