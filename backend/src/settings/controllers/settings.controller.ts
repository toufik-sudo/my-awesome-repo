import {
  Controller, Get, Put, Body, UseGuards, Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SettingsService } from '../services/settings.service';
import { UpdatePreferencesDto } from '../dtos/update-preferences.dto';
import { UpdateNotificationsDto } from '../dtos/update-notifications.dto';
import { UpdateAccountDto, ChangePasswordDto } from '../dtos/update-account.dto';

@ApiTags('Settings')
@ApiBearerAuth('JWT-auth')
@Controller('settings')
@UseGuards(AuthGuard('jwt'))
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all settings', description: 'Returns preferences, notifications, and account settings.' })
  getSettings(@Request() req) {
    return this.settingsService.getSettings(req.user.id);
  }

  @Put('preferences')
  @ApiOperation({ summary: 'Update preferences', description: 'Language, theme, date format, timezone, currency.' })
  updatePreferences(@Request() req, @Body() dto: UpdatePreferencesDto) {
    return this.settingsService.updatePreferences(req.user.id, dto);
  }

  @Put('notifications')
  @ApiOperation({ summary: 'Update notification settings', description: 'Email, push, quiet hours, etc.' })
  updateNotifications(@Request() req, @Body() dto: UpdateNotificationsDto) {
    return this.settingsService.updateNotifications(req.user.id, dto);
  }

  @Put('account')
  @ApiOperation({ summary: 'Update account info', description: 'Name, email, phone, address.' })
  updateAccount(@Request() req, @Body() dto: UpdateAccountDto) {
    return this.settingsService.updateAccount(req.user.id, dto);
  }

  @Put('password')
  @ApiOperation({ summary: 'Change password', description: 'Requires current password + new password (min 8 chars).' })
  changePassword(@Request() req, @Body() dto: ChangePasswordDto) {
    return this.settingsService.changePassword(req.user.id, dto);
  }
}
