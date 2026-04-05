import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesController } from '../controllers/roles.controller';
import { InvitationController } from '../controllers/invitation.controller';
import { ReferralController } from '../controllers/referral.controller';
import { RbacConfigController } from '../controllers/rbac-config.controller';
import { RolesService } from '../services/roles.service';
import { InvitationService } from '../services/invitation.service';
import { ReferralService } from '../services/referral.service';
import { RbacConfigService } from '../services/rbac-config.service';
import { RbacBindingService } from '../services/rbac-binding.service';
import { User } from '../entity/user.entity';
import { ManagerAssignment } from '../entity/manager-assignment.entity';
import { ManagerPermission } from '../entity/manager-permission.entity';
import { Invitation } from '../entity/invitation.entity';
import { Referral, PropertyShare } from '../entity/referral.entity';
import { PropertyGroupMembership } from '../../properties/entity/property-group-membership.entity';
import { ServiceFeeRule } from '../entity/service-fee-rule.entity';
import { PointsRule } from '../entity/points-rule.entity';
import { HostFeeAbsorption } from '../entity/host-fee-absorption.entity';
import { RbacBackendPermission } from '../entity/rbac-backend-permission.entity';
import { RbacFrontendPermission } from '../entity/rbac-frontend-permission.entity';
import { RbacPermissionBinding } from '../entity/rbac-permission-binding.entity';
import { ServiceFeeController } from '../controllers/service-fee.controller';
import { PointsRuleController } from '../controllers/points-rule.controller';
import { HostFeeAbsorptionController } from '../controllers/host-fee-absorption.controller';
import { ServiceFeeService } from '../services/service-fee.service';
import { PointsRuleService } from '../services/points-rule.service';
import { HostFeeAbsorptionService } from '../services/host-fee-absorption.service';
import { JobsModule } from 'src/infrastructure/jobs/jobs.module';
import { WsModule } from 'src/infrastructure/websocket/ws.module';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      ManagerAssignment,
      ManagerPermission,
      Invitation,
      Referral,
      PropertyShare,
      PropertyGroupMembership,
      ServiceFeeRule,
      PointsRule,
      HostFeeAbsorption,
      RbacBackendPermission,
      RbacFrontendPermission,
      RbacPermissionBinding,
    ]),
    JobsModule,
    WsModule,
  ],
  controllers: [
    RolesController,
    InvitationController,
    ServiceFeeController,
    PointsRuleController,
    HostFeeAbsorptionController,
    ReferralController,
    RbacConfigController,
  ],
  providers: [
    RolesService,
    InvitationService,
    ServiceFeeService,
    PointsRuleService,
    HostFeeAbsorptionService,
    ReferralService,
    RbacConfigService,
    RbacBindingService,
  ],
  exports: [
    RolesService,
    InvitationService,
    ServiceFeeService,
    PointsRuleService,
    HostFeeAbsorptionService,
    ReferralService,
    RbacConfigService,
    RbacBindingService,
  ],
})
export class RolesModule {}
