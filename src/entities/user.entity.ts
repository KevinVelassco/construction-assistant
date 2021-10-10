import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn
} from 'typeorm';

import bcrypt from 'bcrypt';
import { VerificationCode } from './verification-code.entity';

@Entity('users')
@Unique('uq_auth_uid', ['authUid'])
@Unique('uq_email', ['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 50 })
  email: string;

  @Column({ type: 'varchar', length: 100 })
  password: string;

  @Index('idx_auth_uid')
  @Column({ name: 'auth_uid', type: 'varchar', length: 100 })
  authUid: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  hashPassword(): void {
    const salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);
  }

  checkPassword(password: string): boolean {
    return bcrypt.compareSync(password, this.password);
  }

  // ralations

  @OneToMany(
    () => VerificationCode,
    (verificationCode: VerificationCode) => verificationCode.user
  )
  verificationCodes: VerificationCode[];
}
