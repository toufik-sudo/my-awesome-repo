import {
  Controller, Put, Post, Body, UseGuards, Request, UseInterceptors, Req, Res, Headers, Logger,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { LoginDto } from 'src/dtos/login/login.dto';
import { User } from 'src/user/entity/user.entity';
import { CustomCsrfInterceptor } from 'src/services/interceptors/custom.csrf.interceptor';
import { CreateUserRequestDto } from '../dtos/requests/create.user.request.dto';
import { SessionService } from '../../services/session/session.service';
import { ActivateUserRequestDto } from '../dtos/requests/activate.user.request.dto';
import { Public } from '../../auth/decorators/public.decorator';
import { JwtAuthGuard } from '../../auth/jwtAuth.guard';
import { PermissionGuard } from '../../auth/guards/permission.guard';
import { CsrfGenAuth, CsrfCheck } from '@tekuconcept/nestjs-csrf';
import { extractScopeContext } from '../../rbac/scope-context';

@Controller('auth')
@UseInterceptors(CustomCsrfInterceptor)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly sessionService: SessionService,
  ) {
    Logger.debug('Host accepted !!!');
  }

  @Public()
  @Post('login')
  @CsrfGenAuth()
  @CsrfCheck(true)
  async login(@Req() req: Request | any, @Res({ passthrough: true }) res: Response | any, @Body() loginDto: LoginDto, @Headers('authorization') authHeader: string) {
    Logger.debug('Hot accepted ?');
    return await this.authService.login(req, res, authHeader, loginDto);
  }

  @Post('logout')
  @CsrfGenAuth()
  @CsrfCheck(true)
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: any, @Res({ passthrough: true }) res: any) {
    return await this.authService.logout(req, res);
  }

  @Public()
  @Post('refresh')
  async refresh(@Req() req: any) {
    return await this.authService.refreshToken(req);
  }

  @Post('registerUser')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  async registerUser(@Request() req: any, @Body() registerDto: CreateUserRequestDto): Promise<User> {
    const scopeCtx = extractScopeContext(req);
    return await this.authService.registerUser(registerDto, scopeCtx);
  }

  @Post('activateUser')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  async activateUser(@Request() req: any, @Body() activateUserRequestDto: ActivateUserRequestDto): Promise<User> {
    const scopeCtx = extractScopeContext(req);
    return await this.authService.activateUser(activateUserRequestDto, scopeCtx);
  }

  @Post('profile')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  getProfile(@Request() req: any) {
    const scopeCtx = extractScopeContext(req);
    return req.user;
  }
}
