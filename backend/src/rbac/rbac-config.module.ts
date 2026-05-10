import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscoveryModule } from '@nestjs/core';
import { RbacConfigController } from '../user/controllers/rbac-config.controller';
import { RbacConfigService } from '../user/services/rbac-config.service';
import { BackendRouteMapperService } from './services/backend-route-mapper.service';
import { FrontendApiCatalogService } from './services/frontend-api-catalog.service';
import { RbacBackendPermission } from '../user/entity/rbac-backend-permission.entity';
import { RbacFrontendPermission } from '../user/entity/rbac-frontend-permission.entity';
import { ManagerPermission } from '../user/entity/manager-permission.entity';
import { HyperManagerPermission } from '../user/entity/hyper-manager-permission.entity';
import { GuestPermission } from '../user/entity/guest-permission.entity';
import { WsModule } from '../infrastructure/websocket/ws.module';

@Global()
@Module({
  imports: [
    DiscoveryModule,
    TypeOrmModule.forFeature([
      RbacBackendPermission,
      RbacFrontendPermission,
      ManagerPermission,
      HyperManagerPermission,
      GuestPermission,
    ]),
    WsModule,
  ],
  controllers: [RbacConfigController],
  providers: [RbacConfigService, BackendRouteMapperService, FrontendApiCatalogService],
  exports: [RbacConfigService, BackendRouteMapperService, FrontendApiCatalogService],
})
export class RbacConfigModule {}
