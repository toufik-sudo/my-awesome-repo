import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPreferences } from '../entity/user-preferences.entity';
import { NotificationSettings } from '../entity/notification-settings.entity';
import { User } from '../../user/entity/user.entity';
import { SettingsController } from '../controllers/settings.controller';
import { SettingsService } from '../services/settings.service';
import { UserModule } from '../../user/modules/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserPreferences, NotificationSettings, User]),
    UserModule,
  ],
  controllers: [SettingsController],
  providers: [SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {}
