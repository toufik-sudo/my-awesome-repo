import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SettingsService } from '../services/settings.service';
import { UpdatePreferencesDto } from '../dtos/update-preferences.dto';
import { UpdateNotificationsDto } from '../dtos/update-notifications.dto';
import { UpdateAccountDto, ChangePasswordDto } from '../dtos/update-account.dto';

@Controller('settings')
@UseGuards(AuthGuard('jwt'))
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  /**
   * GET /settings — Returns all settings (preferences, notifications, account)
   */
  @Get()
  getSettings(@Request() req) {
    return this.settingsService.getSettings(req.user.id);
  }

  /**
   * PUT /settings/preferences — Update user preferences
   */
  @Put('preferences')
  updatePreferences(@Request() req, @Body() dto: UpdatePreferencesDto) {
    return this.settingsService.updatePreferences(req.user.id, dto);
  }

  /**
   * PUT /settings/notifications — Update notification settings
   */
  @Put('notifications')
  updateNotifications(@Request() req, @Body() dto: UpdateNotificationsDto) {
    return this.settingsService.updateNotifications(req.user.id, dto);
  }

  /**
   * PUT /settings/account — Update account information
   */
  @Put('account')
  updateAccount(@Request() req, @Body() dto: UpdateAccountDto) {
    return this.settingsService.updateAccount(req.user.id, dto);
  }

  /**
   * PUT /settings/password — Change password
   */
  @Put('password')
  changePassword(@Request() req, @Body() dto: ChangePasswordDto) {
    return this.settingsService.changePassword(req.user.id, dto);
  }
}
