import {
  Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index,
} from 'typeorm';

export type EmailEventType =
  | 'sent' | 'delivered' | 'opened' | 'clicked'
  | 'bounced' | 'dropped' | 'spam_report' | 'unsubscribed';

@Entity('email_events')
@Index('idx_email_message_id', ['messageId'])
@Index('idx_email_recipient_email', ['recipientEmail'])
@Index('idx_email_event_type', ['eventType'])
@Index('idx_email_created_at', ['createdAt'])
export class EmailEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  messageId: string;

  @Column({ type: 'varchar', length: 30 })
  eventType: EmailEventType;

  @Column({ type: 'varchar', length: 255 })
  recipientEmail: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  subject: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  templateName: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  clickedUrl: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  linkTag: string;

  // ─── Bot detection fields ────────────────────────────────────────
  @Column({ type: 'varchar', length: 500, nullable: true })
  userAgent: string;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ipAddress: string;

  @Column({ type: 'boolean', default: false })
  isBot: boolean;

  @Column({ type: 'varchar', length: 50, nullable: true })
  botReason: string;

  @Column({ type: 'int', nullable: true })
  responseTimeMs: number;

  @Column({ type: 'boolean', default: false })
  isHoneypot: boolean;

  @Column({ type: 'boolean', default: false })
  jsVerified: boolean;

  // ─── Metadata ────────────────────────────────────────────────────
  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;
}
