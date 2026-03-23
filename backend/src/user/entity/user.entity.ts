import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users') // This will map to the 'users' table in your database
export class User {
  @PrimaryGeneratedColumn()
  id: number; // Primary key

  @Column({ unique: true, nullable: true })
  email: string; // User email

  @Column({ unique: true, nullable: false })
  phoneNbr: string; // User phone number

  @Column({ unique: true, nullable: false })
  cardId: string; // CNID

  @Column({ unique: true, nullable: true })
  passportId: string;

  @Column({ nullable: false })
  roles: string;

  @Column({ nullable: false })
  lastName: string;

  @Column({ nullable: false })
  firstName: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  token: string;

  @Column({ nullable: true, type: 'datetime' })
  tokenExpirationDate: Date;

  @Column({ nullable: true })
  otp: string;

  @Column({ nullable: true, type: 'datetime' })
  otpExpirationDate: Date;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  zipcode: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  secondPhoneNbr: string;

  @Column({ nullable: true })
  resetToken: string;

  @Column({ nullable: true })
  passwordCreatedAt: Date;

  @Column({ nullable: true })
  passwordUpdatedAt: Date;

  @Column({ default: true })
  isActive: boolean;
}
