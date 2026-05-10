import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RbacScopeModule } from './rbac-scope.module';
import { RbacDebugController } from '../user/controllers/rbac-debug.controller';
import { PermissionTraceService } from '../user/services/permission-trace.service';
import { Property } from '../properties/entity/property.entity';
import { TourismService } from '../services/entity/tourism-service.entity';
import { PropertyGroup } from '../properties/entity/property-group.entity';
import { ServiceGroup } from '../services/entity/service-group.entity';
import { User } from '../user/entity/user.entity';

/**
 * RBAC debug surface:
 *  - GET /rbac-debug/trace          → full scope-resolution trace for (user, perm, resource)
 *  - GET /rbac-debug/scope-fallbacks → recent inviter-fallback events
 *  - DELETE /rbac-debug/scope-fallbacks → clear the buffer
 *
 * Reuses RolesService (global) + ScopeFilterService (RbacScopeModule) +
 * RbacConfigService (RbacConfigModule, global).
 */
@Module({
  imports: [
    RbacScopeModule,
    TypeOrmModule.forFeature([Property, TourismService, PropertyGroup, ServiceGroup, User]),
  ],
  controllers: [RbacDebugController],
  providers: [PermissionTraceService],
  exports: [PermissionTraceService],
})
export class RbacDebugModule {}
