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
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/user/entity/user.entity';
import { CustomCsrfInterceptor } from 'src/services/interceptors/custom.csrf.interceptor';
import { CreateUserRequestDto } from '../dtos/requests/create.user.request.dto';
import { SessionService } from '../../services/session/session.service';
import { ActivateUserRequestDto } from '../dtos/requests/activate.user.request.dto';
import { Public } from '../../auth/decorators/public.decorator';

@ApiTags('Auth')
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
  @ApiOperation({ summary: 'User login', description: 'Authenticate with email/phone + password. Returns JWT access & refresh tokens.' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['password'],
      properties: {
        phoneNbr: { type: 'string', example: '0555123456', description: 'Phone number (required if no email)' },
        email: { type: 'string', example: 'user@example.com', description: 'Email (required if no phone)' },
        password: { type: 'string', example: 'MyStr0ng!Pass', description: 'User password' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Login successful', schema: {
    type: 'object',
    properties: {
      access_token: { type: 'string' },
      refreshToken: { type: 'string' },
      user: { type: 'object', properties: {
        id: { type: 'number' }, email: { type: 'string' }, firstName: { type: 'string' },
        lastName: { type: 'string' }, roles: { type: 'array', items: { type: 'string' } },
      }},
    },
  }})
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(
    @Req() req: Request | any,
    @Res({ passthrough: true }) res: Response | any,
    @Body() loginDto: any,
    @Headers('authorization') authHeader: string,
  ) {
    Logger.debug('Hot accepted ?');
    return await this.authService.login(req, res, authHeader, loginDto);
  }

  @Post('logout')
  @CsrfGenAuth()
  @CsrfCheck(true)
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'User logout', description: 'Invalidate current session and tokens.' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  async logout(
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
  ) {
    return await this.authService.logout(req, res);
  }

  @Public()
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh JWT token', description: 'Exchange a refresh token for a new access token.' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['refreshToken'],
      properties: { refreshToken: { type: 'string', description: 'Valid refresh token' } },
    },
  })
  @ApiResponse({ status: 200, description: 'New tokens issued', schema: {
    type: 'object', properties: { access_token: { type: 'string' }, refreshToken: { type: 'string' } },
  }})
  async refresh(@Req() req: any) {
    return await this.authService.refreshToken(req);
  }

  @Post('registerUser')
  @CsrfGenAuth()
  @CsrfCheck(true)
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Register a new user', description: 'Create a new user account. Requires authentication.' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async registerUser(@Body() registerDto: CreateUserRequestDto): Promise<User> {
    return await this.authService.registerUser(registerDto);
  }

  @Post('activateUser')
  @CsrfGenAuth()
  @CsrfCheck(true)
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Activate a user account', description: 'Activate a previously created user.' })
  @ApiResponse({ status: 200, description: 'User activated' })
  async activateUser(
    @Body() activateUserRequestDto: ActivateUserRequestDto,
  ): Promise<User> {
    return await this.authService.activateUser(activateUserRequestDto);
  }

  @Post('profile')
  @CsrfGenAuth()
  @CsrfCheck(true)
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get current user profile', description: 'Returns the authenticated user from JWT payload.' })
  @ApiResponse({ status: 200, description: 'Current user profile' })
  getProfile(@Request() req) {
    return req.user;
  }
}
