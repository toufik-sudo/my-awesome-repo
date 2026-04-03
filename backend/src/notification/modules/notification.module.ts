import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationService } from '../services/notification.service';
import { NotificationController } from '../controllers/notification.controller';
import { Notification } from '../entity/notification.entity';
import { User } from '../../user/entity/user.entity';
import { AuthModule } from '../../modules/auth.module';
import { JobsModule } from '../../infrastructure/jobs';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification, User]),
    AuthModule,
    JobsModule,
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
