import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from '../entity/booking.entity';
import { Property } from '../../properties/entity/property.entity';
import { BookingsController } from '../controllers/bookings.controller';
import { BookingsService } from '../services/bookings.service';
import { WsModule } from '../../infrastructure/websocket';
import { JobsModule } from '../../infrastructure/jobs';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, Property]),
    WsModule,
    JobsModule,
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}
