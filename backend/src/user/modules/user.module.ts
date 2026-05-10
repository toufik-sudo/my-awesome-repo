import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { ManagerPermission } from 'src/user/entity/manager-permission.entity';
import { HyperManagerPermission } from 'src/user/entity/hyper-manager-permission.entity';
import { GuestPermission } from 'src/user/entity/guest-permission.entity';
import { Invitation } from 'src/user/entity/invitation.entity';
import { UserService } from 'src/user/services/user.service';
import { RolesService } from 'src/user/services/roles.service';
import { RolesController } from 'src/user/controllers/roles.controller';
import { UserController } from 'src/user/controllers/user.controller';
import { CancellationRuleController } from 'src/user/controllers/cancellation-rule.controller';
import { CancellationRuleService } from 'src/user/services/cancellation-rule.service';
import { CancellationRule } from 'src/user/entity/cancellation-rule.entity';
import { MetricsController } from 'src/user/controllers/metrics.controller';
import { PropertyGroupMembership } from 'src/properties/entity/property-group-membership.entity';
import { PropertyGroup } from 'src/properties/entity/property-group.entity';
import { Property } from 'src/properties/entity/property.entity';
import { TourismService } from 'src/services/entity/tourism-service.entity';
import { Profile } from 'src/profiles/entity/profile.entity';
import { UserBlame } from 'src/user/entity/user-blame.entity';
import { UserBlameService } from 'src/user/services/user-blame.service';
import { UserBlameController } from 'src/user/controllers/user-blame.controller';
import { HyperNotifierService } from 'src/user/services/hyper-notifier.service';
import { JobsModule } from 'src/infrastructure/jobs';
import { WsModule } from 'src/infrastructure/websocket';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      ManagerPermission,
      HyperManagerPermission,
      GuestPermission,
      Invitation,
      PropertyGroupMembership,
      PropertyGroup,
      Profile,
      CancellationRule,
      Property,
      TourismService,
      UserBlame,
    ]),
    JobsModule,
    WsModule,
  ],
  controllers: [RolesController, UserController, CancellationRuleController, MetricsController, UserBlameController],
  providers: [UserService, RolesService, CancellationRuleService, UserBlameService, HyperNotifierService],
  exports: [UserService, RolesService, CancellationRuleService, UserBlameService, HyperNotifierService],
})
export class UserModule {}

