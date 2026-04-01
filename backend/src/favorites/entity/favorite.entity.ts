import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
  Index,
} from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { Property } from '../../properties/entity/property.entity';

@Entity('favorites')
@Unique(['userId', 'propertyId'])
export class Favorite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('IDX_favorites_userId', ['userId'])
  @Column()
  userId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Index('IDX_favorites_propertyId', ['propertyId'])
  @Column()
  propertyId: string;

  @ManyToOne(() => Property, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'propertyId' })
  property: Property;

  @CreateDateColumn()
  createdAt: Date;
}
