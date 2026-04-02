import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Property } from '../entity/property.entity';
import { VerificationDocument } from '../entity/verification-document.entity';
import { PropertyImage } from '../entity/property-image.entity';
import { PropertyAvailability } from '../entity/property-availability.entity';
import { PropertyGroup } from '../entity/property-group.entity';
import { PropertyGroupMembership } from '../entity/property-group-membership.entity';
import { TourismService } from '../../services/entity/tourism-service.entity';
import { User } from '../../user/entity/user.entity';
import { UserRole } from '../../user/entity/user-role.entity';
import { ManagerAssignment } from '../../user/entity/manager-assignment.entity';
import { PropertiesController, SavedSearchAlertsController } from '../controllers/properties.controller';
import { PropertyGroupsController } from '../controllers/property-groups.controller';
import { DocumentValidationController } from '../controllers/document-validation.controller';
import { HyperManagementController } from '../controllers/hyper-management.controller';
import { PropertiesService } from '../services/properties.service';
import { PropertyGroupsService } from '../services/property-groups.service';
import { DocumentValidationService } from '../services/document-validation.service';
import { HyperManagementService } from '../services/hyper-management.service';
import { NotificationModule } from '../../notification/modules/notification.module';
import { WsModule } from '../../infrastructure/websocket';
import { PropertyPromo } from '../entity/property-promo.entity';
import { PromoAlert } from '../entity/promo-alert.entity';
import { SavedSearchAlert } from '../entity/saved-search-alert.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Property,
      PromoAlert,
      PropertyPromo,
      SavedSearchAlert,
      VerificationDocument,
      PropertyImage,
      PropertyAvailability,
      PropertyGroup,
      PropertyGroupMembership,
      TourismService,
      User,
      UserRole,
      ManagerAssignment,
    ]),
    NotificationModule,
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
  exports: [PropertiesService, PropertyGroupsService, DocumentValidationService, HyperManagementService],
})
export class PropertiesModule {}
