import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Unique, Index } from 'typeorm';

@Entity('reactions')
@Unique(['userId', 'targetType', 'targetId'])
export class Reaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('IDX_reactions_userId')
  @Column({ nullable: false })
  userId: number;

  @Column({ nullable: false })
  type: string; // 'like', 'love', 'haha', 'wow', 'sad', 'angry'

  @Column({ nullable: false })
  targetType: string; // 'comment', 'post', etc.

  @Column({ nullable: false })
  targetId: string;

  @CreateDateColumn()
  createdAt: Date;
}
