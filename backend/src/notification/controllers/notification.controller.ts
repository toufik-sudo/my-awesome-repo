import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  UseInterceptors,
  Req,
  Res,
  Logger,
  Put,
  Get,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CsrfCheck, CsrfGenAuth } from '@tekuconcept/nestjs-csrf';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/user/entity/user.entity';
import { CustomCsrfInterceptor } from 'src/services/interceptors/custom.csrf.interceptor';
import { NotificationRequestDto } from '../dtos/requests/notification.request.dto';
import { SessionService } from '../../services/session/session.service';
import { JwtAuthGuard } from '../../auth/jwtAuth.guard';

@ApiTags('Notifications')
@ApiBearerAuth('JWT-auth')
@Controller('notifications')
@UseInterceptors(CustomCsrfInterceptor)
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(
    private readonly authService: AuthService,
    private readonly sessionService: SessionService,
  ) {
    Logger.debug('Host accepted !!!');
  }

  @Get()
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Get all notifications' })
  async get(): Promise<any[]> {
    return [];
  }

  @Get('new')
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Get new notifications' })
  async getNew(): Promise<any[]> {
    return [];
  }
}
