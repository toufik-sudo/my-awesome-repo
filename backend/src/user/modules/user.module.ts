import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { UserRole } from 'src/user/entity/user-role.entity';
import { ManagerAssignment } from 'src/user/entity/manager-assignment.entity';
import { ManagerPermission } from 'src/user/entity/manager-permission.entity';
import { UserService } from 'src/user/services/user.service';
import { RolesService } from 'src/user/services/roles.service';
import { RolesController } from 'src/user/controllers/roles.controller';
import { UserController } from 'src/user/controllers/user.controller';
import { CancellationRuleController } from 'src/user/controllers/cancellation-rule.controller';
import { CancellationRuleService } from 'src/user/services/cancellation-rule.service';
import { CancellationRule } from 'src/user/entity/cancellation-rule.entity';
import { PropertyGroupMembership } from 'src/properties/entity/property-group-membership.entity';
import { Profile } from 'src/profiles/entity/profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserRole,
      ManagerAssignment,
      ManagerPermission,
      PropertyGroupMembership,
      Profile,
      CancellationRule,
    ]),
  ],
  controllers: [RolesController, UserController, CancellationRuleController],
  providers: [UserService, RolesService, CancellationRuleService],
  exports: [UserService, RolesService, CancellationRuleService],
})
export class UserModule {}
