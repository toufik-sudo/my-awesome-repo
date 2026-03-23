import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from '../../user/entity/user.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  content: string;

  @Index('IDX_comments_userId')
  @Column({ nullable: false })
  userId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  parentId: string;

  @Column({ nullable: true })
  targetType: string; // 'post', 'product', 'event', etc.

  @Column({ nullable: true })
  targetId: string;

  @Column({ type: 'simple-json', nullable: true })
  media: { id: string; type: string; url: string; thumbnail?: string }[];

  @Column({ type: 'simple-json', nullable: true })
  mentions: { userId: string; name: string; startIndex: number; endIndex: number }[];

  @Column({ default: false })
  isEdited: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
