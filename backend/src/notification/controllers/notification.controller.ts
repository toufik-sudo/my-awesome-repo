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
import { AuthGuard } from '@nestjs/passport';
import { CsrfCheck, CsrfGenAuth } from '@tekuconcept/nestjs-csrf';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/user/entity/user.entity';
import { CustomCsrfInterceptor } from 'src/services/interceptors/custom.csrf.interceptor';
import { NotificationRequestDto } from '../dtos/requests/notification.request.dto';
import { SessionService } from '../../services/session/session.service';

@Controller('notifications')
@UseInterceptors(CustomCsrfInterceptor)
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
  // @UseGuards(AuthGuard('jwt'))
  async get(): Promise<any[]> {
    return [];
  }

  @Get('new')
  @CsrfGenAuth()
  @CsrfCheck(true)
  // @UseGuards(AuthGuard('jwt'))
  async getNew(): Promise<any[]> {
    return [];
  }

  // @UseGuards(AuthGuard('jwt'))
  // @Post('create')
  // @CsrfGenAuth()
  // @CsrfCheck(true)
  // async create(
  //   @Req() req: Request | any,
  //   @Res({ passthrough: true }) res: Response | any,
  //   @Body() createNotificationRequestDto: NotificationRequestDto,
  //   // @Headers('authorization') authHeader: string,
  // ) {
  //   Logger.debug('Hot accepted ?');
  //   // return await this.authService.login(req, res, null, loginDto);
  //   return null;
  // }
  //
  // @Put('update')
  // @CsrfGenAuth()
  // @CsrfCheck(true)
  // @UseGuards(AuthGuard('jwt'))
  // async update(
  //   @Body() updateNotificationRequestDto: NotificationRequestDto,
  // ): Promise<User> {
  //   return null;
  // }
}
