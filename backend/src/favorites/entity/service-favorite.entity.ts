import {
  Entity, Column, PrimaryGeneratedColumn, CreateDateColumn,
  ManyToOne, JoinColumn, Unique, Index,
} from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { TourismService } from '../../services/entity/tourism-service.entity';

@Entity('service_favorites')
@Unique(['userId', 'serviceId'])
export class ServiceFavorite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('IDX_service_favorites_userId', ['userId'])
  @Column()
  userId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Index('IDX_service_favorites_serviceId', ['serviceId'])
  @Column()
  serviceId: string;

  @ManyToOne(() => TourismService, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'serviceId' })
  service: TourismService;

  @CreateDateColumn()
  createdAt: Date;
}
