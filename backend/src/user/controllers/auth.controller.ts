import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  UseInterceptors,
  Req,
  Res,
  Headers,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CsrfCheck, CsrfGenAuth } from '@tekuconcept/nestjs-csrf';
import { AuthService } from 'src/auth/auth.service';
import { LoginDto } from 'src/dtos/login/login.dto';
import { User } from 'src/user/entity/user.entity';
import { CustomCsrfInterceptor } from 'src/services/interceptors/custom.csrf.interceptor';
import { CreateUserRequestDto } from '../dtos/requests/create.user.request.dto';
import { SessionService } from '../../services/session/session.service';
import { ActivateUserRequestDto } from '../dtos/requests/activate.user.request.dto';
import { Public } from '../../auth/decorators/public.decorator';

@Controller('auth')
@UseInterceptors(CustomCsrfInterceptor)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly sessionService: SessionService,
  ) {
    Logger.debug('Host accepted !!!');
  }

  // @UseGuards(AuthGuard('jwt'))
  @Public()
  @Post('login')
  @CsrfGenAuth()
  @CsrfCheck(true)
  async login(
    @Req() req: Request | any,
    @Res({ passthrough: true }) res: Response | any,
    @Body() loginDto: LoginDto,
    @Headers('authorization') authHeader: string,
  ) {
    Logger.debug('Hot accepted ?');
    return await this.authService.login(req, res, authHeader, loginDto);
  }

  @Post('logout')
  @CsrfGenAuth()
  @CsrfCheck(true)
  @UseGuards(AuthGuard('jwt'))
  async logout(
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
  ) {
    return await this.authService.logout(req, res);
  }

  @Public()
  @Post('refresh')
  async refresh(@Req() req: any) {
    return await this.authService.refreshToken(req);
  }

  @Post('registerUser')
  @CsrfGenAuth()
  @CsrfCheck(true)
  @UseGuards(AuthGuard('jwt'))
  async registerUser(@Body() registerDto: CreateUserRequestDto): Promise<User> {
    return await this.authService.registerUser(registerDto);
  }

  @Post('activateUser')
  @CsrfGenAuth()
  @CsrfCheck(true)
  @UseGuards(AuthGuard('jwt'))
  async activateUser(
    @Body() activateUserRequestDto: ActivateUserRequestDto,
  ): Promise<User> {
    return await this.authService.activateUser(activateUserRequestDto);
  }

  @Post('profile')
  @CsrfGenAuth()
  @CsrfCheck(true)
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Request() req) {
    return req.user;
  }
}
