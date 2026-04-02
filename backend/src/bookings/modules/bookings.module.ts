import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from '../entity/booking.entity';
import { Property } from '../../properties/entity/property.entity';
import { TourismService } from '../../services/entity/tourism-service.entity';
import { User } from '../../user/entity/user.entity';
import { UserRole } from '../../user/entity/user-role.entity';
import { BookingsController } from '../controllers/bookings.controller';
import { MetricsController } from '../controllers/metrics.controller';
import { BookingsService } from '../services/bookings.service';
import { MetricsService } from '../services/metrics.service';
import { WsModule } from '../../infrastructure/websocket';
import { JobsModule } from '../../infrastructure/jobs';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, Property, TourismService, User, UserRole]),
    WsModule,
    JobsModule,
  ],
  controllers: [BookingsController, MetricsController],
  providers: [BookingsService, MetricsService],
  exports: [BookingsService, MetricsService],
})
export class BookingsModule {}
