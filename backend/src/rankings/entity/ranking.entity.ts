import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('rankings')
export class Ranking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('IDX_rankings_userId', ['userId'])
  @Column({ nullable: false })
  userId: number;

  @Column({ default: 0 })
  score: number;

  @Column({ nullable: true })
  previousRank: number;

  @Column({ nullable: true })
  category: string; // 'global', 'monthly', 'weekly', etc.

  @Column({ type: 'simple-json', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
