import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { EmailEvent } from './entities/email-event.entity';
import { TrackedLink } from './entities/tracked-link.entity';
import { EmailTrackingService } from './services/email-tracking.service';
import { BotDetectionService } from './services/bot-detection.service';
import { EmailTrackingController } from './controllers/email-tracking.controller';

@Global()
@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([EmailEvent, TrackedLink]),
  ],
  controllers: [EmailTrackingController],
  providers: [EmailTrackingService, BotDetectionService],
  exports: [EmailTrackingService, BotDetectionService],
})
export class EmailTrackingModule {}
