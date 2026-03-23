import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesController } from '../controllers/roles.controller';
import { RolesService } from '../services/roles.service';
import { UserRole } from '../entity/user-role.entity';
import { ManagerAssignment } from '../entity/manager-assignment.entity';
import { ManagerPermission } from '../entity/manager-permission.entity';
import { PropertyGroupMembership } from '../../properties/entity/property-group-membership.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRole,
      ManagerAssignment,
      ManagerPermission,
      PropertyGroupMembership,
    ]),
  ],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
