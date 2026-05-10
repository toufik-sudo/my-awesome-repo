import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Property } from '../entity/property.entity';
import { User } from '../../user/entity/user.entity';
import { VerificationDocument } from '../entity/verification-document.entity';
import { PropertyImage } from '../entity/property-image.entity';
import { PropertyAvailability } from '../entity/property-availability.entity';
import { PropertyGroup } from '../entity/property-group.entity';
import { PropertiesController, SavedSearchAlertsController } from '../controllers/properties.controller';
import { PropertyGroupsController } from '../controllers/property-groups.controller';
import { DocumentValidationController } from '../controllers/document-validation.controller';
import { HyperManagementController } from '../controllers/hyper-management.controller';
import { PropertiesService } from '../services/properties.service';
import { PropertyGroupsService } from '../services/property-groups.service';
import { DocumentValidationService } from '../services/document-validation.service';
import { HyperManagementService } from '../services/hyper-management.service';
import { NotificationModule } from '../../notification/modules/notification.module';
import { PropertyPromo } from '../entity/property-promo.entity';
import { PromoAlert } from '../entity/promo-alert.entity';
import { SavedSearchAlert } from '../entity/saved-search-alert.entity';
import { RbacScopeModule } from '../../rbac/rbac-scope.module';
import { TourismService } from '../../services/entity/tourism-service.entity';
import { Booking } from '../../bookings/entity/booking.entity';
import { ServiceBooking } from '../../services/entity/service-booking.entity';
import { ManagerPermission } from '../../user/entity/manager-permission.entity';
import { HyperManagerPermission } from '../../user/entity/hyper-manager-permission.entity';
import { GuestPermission } from '../../user/entity/guest-permission.entity';
import { WsModule } from '../../infrastructure/websocket/ws.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Property,
      User,
      PromoAlert,
      PropertyPromo,
      SavedSearchAlert,
      VerificationDocument,
      PropertyImage,
      PropertyAvailability,
      PropertyGroup,
      // Required by HyperManagementService for cascade pause/archive
      TourismService,
      Booking,
      ServiceBooking,
      ManagerPermission,
      HyperManagerPermission,
      GuestPermission,
    ]),
    NotificationModule,
    RbacScopeModule,
    WsModule,
  ],
  controllers: [
    PropertiesController,
    SavedSearchAlertsController,
    PropertyGroupsController,
    DocumentValidationController,
    HyperManagementController,
  ],
  providers: [
    PropertiesService,
    PropertyGroupsService,
    DocumentValidationService,
    HyperManagementService,
  ],
  exports: [
    PropertiesService,
    PropertyGroupsService,
    DocumentValidationService,
    HyperManagementService,
  ],
})
export class PropertiesModule {}
