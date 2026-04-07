import { Controller, Get, Put, Body, UseGuards, UseInterceptors, Request } from '@nestjs/common';
import { SettingsService } from '../services/settings.service';
import { JwtAuthGuard } from '../../auth/jwtAuth.guard';
import { PermissionGuard } from '../../auth/guards/permission.guard';
import { CustomCsrfInterceptor } from '../../services/interceptors/custom.csrf.interceptor';
import { CsrfGenAuth, CsrfCheck } from '@tekuconcept/nestjs-csrf';
import { UpdatePreferencesDto } from '../dtos/update-preferences.dto';
import { UpdateNotificationsDto } from '../dtos/update-notifications.dto';
import { UpdateAccountDto, ChangePasswordDto } from '../dtos/update-account.dto';
import { extractScopeContext } from '../../rbac/scope-context';

@Controller('settings')
@UseGuards(JwtAuthGuard)
@UseInterceptors(CustomCsrfInterceptor)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  getSettings(@Request() req: any) {
    const scopeCtx = extractScopeContext(req);
    return this.settingsService.getSettings(req.user.id, scopeCtx);
  }

  @Put('preferences')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  updatePreferences(@Request() req: any, @Body() dto: UpdatePreferencesDto) {
    const scopeCtx = extractScopeContext(req);
    return this.settingsService.updatePreferences(req.user.id, dto, scopeCtx);
  }

  @Put('notifications')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  updateNotifications(@Request() req: any, @Body() dto: UpdateNotificationsDto) {
    const scopeCtx = extractScopeContext(req);
    return this.settingsService.updateNotifications(req.user.id, dto, scopeCtx);
  }

  @Put('account')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  updateAccount(@Request() req: any, @Body() dto: UpdateAccountDto) {
    const scopeCtx = extractScopeContext(req);
    return this.settingsService.updateAccount(req.user.id, dto, scopeCtx);
  }

  @Put('password')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  changePassword(@Request() req: any, @Body() dto: ChangePasswordDto) {
    const scopeCtx = extractScopeContext(req);
    return this.settingsService.changePassword(req.user.id, dto, scopeCtx);
  }
}
