import {
  Controller,
  Get,
  UseGuards,
  UseInterceptors,
  Request,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CsrfCheck, CsrfGenAuth } from '@tekuconcept/nestjs-csrf';
import { CustomCsrfInterceptor } from 'src/services/interceptors/custom.csrf.interceptor';
import { JwtAuthGuard } from '../../auth/jwtAuth.guard';
import { PermissionGuard } from '../../auth/guards/permission.guard';
import { extractScopeContext } from '../../rbac/scope-context';

@ApiTags('Notifications')
@ApiBearerAuth('JWT-auth')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@UseInterceptors(CustomCsrfInterceptor)
export class NotificationController {
  constructor() {
    Logger.debug('NotificationController initialized');
  }

  @Get()
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Get all notifications' })
  async get(@Request() req: any): Promise<any[]> {
    const scopeCtx = extractScopeContext(req);
    return [];
  }

  @Get('new')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Get new notifications' })
  async getNew(@Request() req: any): Promise<any[]> {
    const scopeCtx = extractScopeContext(req);
    return [];
  }
}
