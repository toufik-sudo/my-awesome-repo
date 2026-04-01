import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailProcessor } from './processors/email.processor';
import { NotificationProcessor } from './processors/notification.processor';
import { ImageProcessor } from './processors/image.processor';
import { AlertsProcessor } from './processors/alerts.processor';
import { JobProducerService } from './job-producer.service';
import { Notification } from '../../notification/entity/notification.entity';
import { User } from '../../user/entity/user.entity';
import { UserRole } from '../../user/entity/user-role.entity';
import { Property } from '../../properties/entity/property.entity';
import { SavedSearchAlert } from '../../properties/entity/saved-search-alert.entity';
import { PromoAlert } from '../../properties/entity/promo-alert.entity';
import { PropertyPromo } from '../../properties/entity/property-promo.entity';
import { QUEUE_EMAIL, QUEUE_NOTIFICATION, QUEUE_IMAGE, QUEUE_ALERTS } from './jobs.constant';

@Module({
  imports: [
    ConfigModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get<string>('REDIS_HOST', 'localhost'),
          port: config.get<number>('REDIS_PORT', 6379),
          password: config.get<string>('REDIS_PASSWORD', undefined),
          db: config.get<number>('REDIS_BULL_DB', 1),
        },
        defaultJobOptions: {
          removeOnComplete: { count: 1000 },
          removeOnFail: { count: 5000 },
          attempts: 3,
          backoff: { type: 'exponential', delay: 2000 },
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue(
      { name: QUEUE_EMAIL },
      { name: QUEUE_NOTIFICATION },
      { name: QUEUE_IMAGE },
      { name: QUEUE_ALERTS },
    ),
    TypeOrmModule.forFeature([
      Notification, User, UserRole,
      Property, SavedSearchAlert, PromoAlert, PropertyPromo,
    ]),
  ],
  providers: [
    JobProducerService,
    EmailProcessor,
    NotificationProcessor,
    ImageProcessor,
    AlertsProcessor,
  ],
  exports: [JobProducerService],
})
export class JobsModule {}
