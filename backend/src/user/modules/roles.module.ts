import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesController } from '../controllers/roles.controller';
import { InvitationController } from '../controllers/invitation.controller';
import { ReferralController } from '../controllers/referral.controller';
import { RolesService } from '../services/roles.service';
import { InvitationService } from '../services/invitation.service';
import { ReferralService } from '../services/referral.service';
import { UserRole } from '../entity/user-role.entity';
import { User } from '../entity/user.entity';
import { ManagerAssignment } from '../entity/manager-assignment.entity';
import { ManagerPermission } from '../entity/manager-permission.entity';
import { Invitation } from '../entity/invitation.entity';
import { Referral, PropertyShare } from '../entity/referral.entity';
import { PropertyGroupMembership } from '../../properties/entity/property-group-membership.entity';
import { ServiceFeeRule } from '../entity/service-fee-rule.entity';
import { PointsRule } from '../entity/points-rule.entity';
import { ServiceFeeController } from '../controllers/service-fee.controller';
import { PointsRuleController } from '../controllers/points-rule.controller';
import { ServiceFeeService } from '../services/service-fee.service';
import { PointsRuleService } from '../services/points-rule.service';
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
      PropertyGroupMembership,
      ServiceFeeRule,
      PointsRule,
    ]),
    JobsModule,
  ],
  controllers: [RolesController, InvitationController, ServiceFeeController, PointsRuleController, ReferralController],
  providers: [RolesService, InvitationService, ServiceFeeService, PointsRuleService, ReferralService],
  exports: [RolesService, InvitationService, ServiceFeeService, PointsRuleService, ReferralService],
})
export class RolesModule {}
