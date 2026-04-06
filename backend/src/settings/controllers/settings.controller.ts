import { Controller, Get, Put, Body, UseGuards, UseInterceptors, Request } from '@nestjs/common';
import { SettingsService } from '../services/settings.service';
import { JwtAuthGuard } from '../../auth/jwtAuth.guard';
import { PermissionGuard } from '../../auth/guards/permission.guard';
import { CustomCsrfInterceptor } from '../../services/interceptors/custom.csrf.interceptor';
import { CsrfGenAuth, CsrfCheck } from '@tekuconcept/nestjs-csrf';
import { UpdatePreferencesDto } from '../dtos/update-preferences.dto';
import { UpdateNotificationsDto } from '../dtos/update-notifications.dto';
import { UpdateAccountDto, ChangePasswordDto } from '../dtos/update-account.dto';

@Controller('settings')
@UseGuards(JwtAuthGuard)
@UseInterceptors(CustomCsrfInterceptor)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  getSettings(@Request() req) { return this.settingsService.getSettings(req.user.id); }

  @Put('preferences')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  updatePreferences(@Request() req, @Body() dto: UpdatePreferencesDto) { return this.settingsService.updatePreferences(req.user.id, dto); }

  @Put('notifications')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  updateNotifications(@Request() req, @Body() dto: UpdateNotificationsDto) { return this.settingsService.updateNotifications(req.user.id, dto); }

  @Put('account')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  updateAccount(@Request() req, @Body() dto: UpdateAccountDto) { return this.settingsService.updateAccount(req.user.id, dto); }

  @Put('password')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  changePassword(@Request() req, @Body() dto: ChangePasswordDto) { return this.settingsService.changePassword(req.user.id, dto); }
}
