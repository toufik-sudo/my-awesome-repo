import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { TourismService } from './tourism-service.entity';
import { ServiceGroup } from './service-group.entity';

@Entity('service_group_memberships')
@Unique(['serviceId', 'groupId'])
export class ServiceGroupMembership {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  serviceId: string;

  @ManyToOne(() => TourismService, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'serviceId' })
  service: TourismService;

  @Column()
  groupId: string;

  @ManyToOne(() => ServiceGroup, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'groupId' })
  group: ServiceGroup;

  @CreateDateColumn()
  addedAt: Date;
}
