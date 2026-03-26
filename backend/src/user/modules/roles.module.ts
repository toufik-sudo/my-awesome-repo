import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesController } from '../controllers/roles.controller';
import { InvitationController } from '../controllers/invitation.controller';
import { RolesService } from '../services/roles.service';
import { InvitationService } from '../services/invitation.service';
import { UserRole } from '../entity/user-role.entity';
import { ManagerAssignment } from '../entity/manager-assignment.entity';
import { ManagerPermission } from '../entity/manager-permission.entity';
import { Invitation } from '../entity/invitation.entity';
import { PropertyGroupMembership } from '../../properties/entity/property-group-membership.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRole,
      ManagerAssignment,
      ManagerPermission,
      Invitation,
      PropertyGroupMembership,
    ]),
  ],
  controllers: [RolesController, InvitationController],
  providers: [RolesService, InvitationService],
  exports: [RolesService, InvitationService],
})
export class RolesModule {}
