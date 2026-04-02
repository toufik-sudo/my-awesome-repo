import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesController } from '../controllers/roles.controller';
import { InvitationController } from '../controllers/invitation.controller';
import { ReferralController } from '../controllers/referral.controller';
import { RewardsController } from '../controllers/rewards.controller';
import { RolesService } from '../services/roles.service';
import { InvitationService } from '../services/invitation.service';
import { ReferralService } from '../services/referral.service';
import { RewardsService } from '../services/rewards.service';
import { UserRole } from '../entity/user-role.entity';
import { User } from '../entity/user.entity';
import { ManagerAssignment } from '../entity/manager-assignment.entity';
import { ManagerPermission } from '../entity/manager-permission.entity';
import { Invitation } from '../entity/invitation.entity';
import { Referral, PropertyShare } from '../entity/referral.entity';
import { Reward, RewardRedemption } from '../entity/reward.entity';
import { PropertyGroupMembership } from '../../properties/entity/property-group-membership.entity';
import { ServiceFeeRule } from '../entity/service-fee-rule.entity';
import { PointsRule } from '../entity/points-rule.entity';
import { HostFeeAbsorption } from '../entity/host-fee-absorption.entity';
import { ServiceFeeController } from '../controllers/service-fee.controller';
import { PointsRuleController } from '../controllers/points-rule.controller';
import { HostFeeAbsorptionController } from '../controllers/host-fee-absorption.controller';
import { ServiceFeeService } from '../services/service-fee.service';
import { PointsRuleService } from '../services/points-rule.service';
import { HostFeeAbsorptionService } from '../services/host-fee-absorption.service';
import { PointsModule } from '../../modules/points/points.module';
import { JobsModule } from 'src/infrastructure/jobs/jobs.module';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRole,
      User,
      ManagerAssignment,
      ManagerPermission,
      Invitation,
      Referral,
      PropertyShare,
      Reward,
      RewardRedemption,
      PropertyGroupMembership,
      ServiceFeeRule,
      PointsRule,
      HostFeeAbsorption,
    ]),
    PointsModule,
    JobsModule,
  ],
  controllers: [
    RolesController,
    InvitationController,
    ServiceFeeController,
    PointsRuleController,
    HostFeeAbsorptionController,
    ReferralController,
    RewardsController,
  ],
  providers: [
    RolesService,
    InvitationService,
    ServiceFeeService,
    PointsRuleService,
    HostFeeAbsorptionService,
    ReferralService,
    RewardsService,
  ],
  exports: [
    RolesService,
    InvitationService,
    ServiceFeeService,
    PointsRuleService,
    HostFeeAbsorptionService,
    ReferralService,
    RewardsService,
  ],
})
export class RolesModule {}
