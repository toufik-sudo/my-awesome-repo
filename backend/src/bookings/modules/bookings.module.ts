import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { Booking } from '../entity/booking.entity';
import { Property } from '../../properties/entity/property.entity';
import { BookingsController } from '../controllers/bookings.controller';
import { BookingsService } from '../services/bookings.service';
import { BookingLifecycleService } from '../services/booking-lifecycle.service';
import { ServiceBooking } from '../../services/entity/service-booking.entity';
import { TourismService } from '../../services/entity/tourism-service.entity';
import { WsModule } from '../../infrastructure/websocket';
import { JobsModule } from '../../infrastructure/jobs';
import { RbacScopeModule } from '../../rbac/rbac-scope.module';
import { UserModule } from '../../user/modules/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, Property, ServiceBooking, TourismService]),
    ScheduleModule.forRoot(),
    WsModule,
    JobsModule,
    RbacScopeModule,
    UserModule,
  ],
  controllers: [BookingsController],
  providers: [BookingsService, BookingLifecycleService],
  exports: [BookingsService],
})
export class BookingsModule {}
