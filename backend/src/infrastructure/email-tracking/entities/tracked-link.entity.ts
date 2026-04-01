import {
  Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index,
} from 'typeorm';

@Entity('email_tracked_links')
@Index(['trackingId'], { unique: true })
@Index(['messageId'])
export class TrackedLink {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 64, unique: true })
  trackingId: string;

  @Column({ type: 'varchar', length: 255 })
  messageId: string;

  @Column({ type: 'varchar', length: 2000 })
  originalUrl: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  linkTag: string;

  @Column({ type: 'varchar', length: 255 })
  recipientEmail: string;

  @Column({ type: 'int', default: 0 })
  clickCount: number;

  @Column({ type: 'int', default: 0 })
  humanClickCount: number;

  @CreateDateColumn()
  createdAt: Date;
}
