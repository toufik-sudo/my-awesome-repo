import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesController } from '../controllers/roles.controller';
import { InvitationController } from '../controllers/invitation.controller';
import { PublicOnboardingController } from '../controllers/public-onboarding.controller';
import { ReferralController } from '../controllers/referral.controller';
import { RolesService } from '../services/roles.service';
import { InvitationService } from '../services/invitation.service';
import { ReferralService } from '../services/referral.service';
import { User } from '../entity/user.entity';
import { ManagerPermission } from '../entity/manager-permission.entity';
import { HyperManagerPermission } from '../entity/hyper-manager-permission.entity';
import { GuestPermission } from '../entity/guest-permission.entity';
import { Invitation } from '../entity/invitation.entity';
import { Referral, PropertyShare } from '../entity/referral.entity';
import { PropertyGroup } from '../../properties/entity/property-group.entity';
import { ServiceFeeRule } from '../entity/service-fee-rule.entity';
import { PointsRule } from '../entity/points-rule.entity';
import { HostFeeAbsorption } from '../entity/host-fee-absorption.entity';
import { ServiceFeeController } from '../controllers/service-fee.controller';
import { PointsRuleController } from '../controllers/points-rule.controller';
import { HostFeeAbsorptionController } from '../controllers/host-fee-absorption.controller';
import { ServiceFeeService } from '../services/service-fee.service';
import { PointsRuleService } from '../services/points-rule.service';
import { HostFeeAbsorptionService } from '../services/host-fee-absorption.service';
import { JobsModule } from 'src/infrastructure/jobs/jobs.module';
import { WsModule } from 'src/infrastructure/websocket/ws.module';
import { PointsModule } from 'src/modules/points/points.module';
import { PermissionBindingController } from '../controllers/permission-binding.controller';
import { PermissionBindingService } from '../services/permission-binding.service';
import { RbacPermissionBinding } from '../entity/rbac-permission-binding.entity';
import { RbacBackendPermission } from '../entity/rbac-backend-permission.entity';
import { Profile } from '../../profiles/entity/profile.entity';
import { UserModule } from './user.module';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      ManagerPermission,
      HyperManagerPermission,
      GuestPermission,
      Invitation,
      Referral,
      PropertyShare,
      PropertyGroup,
      ServiceFeeRule,
      PointsRule,
      HostFeeAbsorption,
      RbacPermissionBinding,
      RbacBackendPermission,
      Profile,
    ]),
    JobsModule,
    WsModule,
    PointsModule,
    UserModule,
  ],
  controllers: [
    RolesController,
    InvitationController,
    PublicOnboardingController,
    ServiceFeeController,
    PointsRuleController,
    HostFeeAbsorptionController,
    ReferralController,
    PermissionBindingController,
  ],
  providers: [
    RolesService,
    InvitationService,
    ServiceFeeService,
    PointsRuleService,
    HostFeeAbsorptionService,
    ReferralService,
    PermissionBindingService,
  ],
  exports: [
    RolesService,
    InvitationService,
    ServiceFeeService,
    PointsRuleService,
    HostFeeAbsorptionService,
    ReferralService,
    PermissionBindingService,
  ],
})
export class RolesModule {}
