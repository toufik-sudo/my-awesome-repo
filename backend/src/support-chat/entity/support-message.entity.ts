import {
  Entity, Column, PrimaryGeneratedColumn, CreateDateColumn,
  ManyToOne, JoinColumn, Index,
} from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { SupportThread } from './support-thread.entity';

@Entity('support_messages')
export class SupportMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('IDX_support_message_thread')
  @Column()
  threadId: string;

  @ManyToOne(() => SupportThread, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'threadId' })
  thread: SupportThread;

  @Column()
  senderId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'senderId' })
  sender: User;

  @Column({ type: 'varchar', length: 20 })
  senderRole: string; // 'admin' | 'host' | 'guest'

  @Column({ type: 'text' })
  content: string;

  @Column({ default: false })
  isSystemMessage: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
