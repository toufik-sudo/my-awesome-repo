import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from '../properties/controllers/dashboard.controller';
import { DashboardService } from '../services/dashboard.service';
import { Property } from '../properties/entity/property.entity';
import { Booking } from '../bookings/entity/booking.entity';
import { Favorite } from '../favorites/entity/favorite.entity';
import { VerificationDocument } from '../properties/entity/verification-document.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Property, Booking, Favorite, VerificationDocument]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
