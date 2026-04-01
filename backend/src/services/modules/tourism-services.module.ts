import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TourismService } from '../entity/tourism-service.entity';
import { ServiceVerificationDocument } from '../entity/service-verification-document.entity';
import { ServiceBooking } from '../entity/service-booking.entity';
import { ServiceAvailability } from '../entity/service-availability.entity';
import { ServiceGroup } from '../entity/service-group.entity';
import { ServiceGroupMembership } from '../entity/service-group-membership.entity';
import { TourismServicesController } from '../controllers/tourism-services.controller';
import { ServiceBookingsController } from '../controllers/service-bookings.controller';
import { ServiceGroupsController } from '../controllers/service-groups.controller';
import { TourismServicesService } from '../services/tourism-services.service';
import { ServiceBookingsService } from '../services/service-bookings.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TourismService,
      ServiceVerificationDocument,
      ServiceBooking,
      ServiceAvailability,
      ServiceGroup,
      ServiceGroupMembership,
    ]),
  ],
  controllers: [
    TourismServicesController,
    ServiceBookingsController,
    ServiceGroupsController,
  ],
  providers: [
    TourismServicesService,
    ServiceBookingsService,
  ],
  exports: [TourismServicesService, ServiceBookingsService],
})
export class TourismServicesModule {}
