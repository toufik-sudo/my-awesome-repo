import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users_address') // This will map to the 'users' table in your database
export class UserAddress {
  @PrimaryGeneratedColumn()
  id: number; // Primary key

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  zipcode: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  otherPhoneNbr: string;

  @Column({ nullable: true })
  otherEmail: string;
}
