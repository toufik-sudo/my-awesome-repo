import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SSOService } from '../services/sso.service';
import { SSOProvisioningService } from '../services/sso-provisioning.service';
import { SSOController } from '../controllers/sso.controller';
import { SsoEnabledGuard } from '../guards/sso-enabled.guard';
import { User } from '../../user/entity/user.entity';
import ssoConfig from '../config/sso.config';

@Module({
  imports: [
    ConfigModule.forFeature(ssoConfig),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [SSOController],
  providers: [SSOService, SSOProvisioningService, SsoEnabledGuard],
  exports: [SSOService, SSOProvisioningService, SsoEnabledGuard],
})
export class SSOModule {}
