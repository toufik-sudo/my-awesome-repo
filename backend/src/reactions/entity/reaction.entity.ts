import {
  Entity, Column, PrimaryGeneratedColumn, CreateDateColumn,
  Unique, Index, ManyToOne, JoinColumn,
} from 'typeorm';
import { User } from '../../user/entity/user.entity';

@Entity('reactions')
@Unique(['userId', 'targetType', 'targetId'])
export class Reaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('IDX_reactions_userId', ['userId'])
  @Column({ nullable: false })
  userId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: false })
  type: string; // 'like', 'dislike', 'love', etc.

  /** Type of the target entity: 'comment', 'property', 'service', 'review' */
  @Index('IDX_reactions_targetType', ['targetType'])
  @Column({ type: 'varchar', length: 50, default: 'comment' })
  targetType: string;

  /** ID of the target entity */
  @Index('IDX_reactions_targetId', ['targetId'])
  @Column({ type: 'varchar', length: 100 })
  targetId: string;

  @CreateDateColumn()
  createdAt: Date;
}
