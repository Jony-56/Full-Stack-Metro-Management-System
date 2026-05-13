import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  STAFF = 'staff',
  PASSENGER = 'passenger',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

 @Column({ select: false })
password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.PASSENGER,
  })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}