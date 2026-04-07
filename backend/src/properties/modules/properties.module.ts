import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Property } from '../entity/property.entity';
import { User } from '../../user/entity/user.entity';
import { VerificationDocument } from '../entity/verification-document.entity';
import { PropertyImage } from '../entity/property-image.entity';
import { PropertyAvailability } from '../entity/property-availability.entity';
import { PropertyGroup } from '../entity/property-group.entity';
import { PropertyGroupMembership } from '../entity/property-group-membership.entity';
import { PropertiesController, SavedSearchAlertsController } from '../controllers/properties.controller';
import { PropertyGroupsController } from '../controllers/property-groups.controller';
import { DocumentValidationController } from '../controllers/document-validation.controller';
import { PropertiesService } from '../services/properties.service';
import { PropertyGroupsService } from '../services/property-groups.service';
import { DocumentValidationService } from '../services/document-validation.service';
import { NotificationModule } from '../../notification/modules/notification.module';
import { PropertyPromo } from '../entity/property-promo.entity';
import { PromoAlert } from '../entity/promo-alert.entity';
import { SavedSearchAlert } from '../entity/saved-search-alert.entity';
import { RbacScopeModule } from '../../rbac/rbac-scope.module';

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
      PropertyGroupMembership,
    ]),
    NotificationModule,
    RbacScopeModule,
  ],
  controllers: [PropertiesController, SavedSearchAlertsController, PropertyGroupsController, DocumentValidationController],
  providers: [PropertiesService, PropertyGroupsService, DocumentValidationService],
  exports: [PropertiesService, PropertyGroupsService, DocumentValidationService],
})
export class PropertiesModule {}
