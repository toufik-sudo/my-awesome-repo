import {
  Controller,
  Post,
  Get,
  Body,
  Headers,
  Logger,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CustomCsrfInterceptor } from 'src/services/interceptors/custom.csrf.interceptor';
import { Public } from 'src/auth/decorators/public.decorator';
import { SsoOnly } from '../decorators/sso-only.decorator';
import { SsoEnabledGuard } from '../guards/sso-enabled.guard';
import { SSOService } from '../services/sso.service';
import { SSOProvisioningService } from '../services/sso-provisioning.service';
import {
  SSOTokenRequestDto,
  SSORefreshRequestDto,
  SSOLogoutRequestDto,
} from '../dtos/requests/sso.token.request.dto';

@Controller('auth/sso')
@UseInterceptors(CustomCsrfInterceptor)
@UseGuards(SsoEnabledGuard)
@SsoOnly()
export class SSOController {
  private readonly logger = new Logger(SSOController.name);

  constructor(
    private readonly ssoService: SSOService,
    private readonly provisioningService: SSOProvisioningService,
  ) {
    this.logger.debug('SSO Controller initialized');
  }

  /**
   * Exchange authorization code for tokens + auto-provision user
   * POST /api/auth/sso/token
   */
  @Public()
  @Post('token')
  async exchangeToken(@Body() tokenRequestDto: SSOTokenRequestDto) {
    this.logger.debug(
      `SSO token exchange for provider: ${tokenRequestDto.provider}`,
    );
    const tokenResponse = await this.ssoService.exchangeToken(tokenRequestDto);

    // Auto-provision: fetch user info and create/update in DB
    try {
      const userInfo = await this.ssoService.getUserInfo(
        tokenResponse.access_token,
        tokenRequestDto.provider,
      );
      const user = await this.provisioningService.provisionUser(
        userInfo,
        tokenRequestDto.provider,
      );

      return {
        ...tokenResponse,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          phoneNbr: user.phoneNbr,
        },
      };
    } catch (error: any) {
      this.logger.warn(
        `SSO auto-provisioning failed, returning tokens without user: ${error.message}`,
      );
      return tokenResponse;
    }
  }

  /**
   * Fetch user info using the access token
   * GET /api/auth/sso/userinfo
   */
  @Public()
  @Get('userinfo')
  async getUserInfo(@Headers('authorization') authHeader: string) {
    const token = authHeader?.replace(/^Bearer\s+/i, '');
    this.logger.debug('SSO userinfo request');
    return await this.ssoService.getUserInfo(token);
  }

  /**
   * Refresh SSO token
   * POST /api/auth/sso/refresh
   */
  @Public()
  @Post('refresh')
  async refreshToken(@Body() refreshRequestDto: SSORefreshRequestDto) {
    this.logger.debug('SSO token refresh request');
    return await this.ssoService.refreshToken(refreshRequestDto);
  }

  /**
   * Logout from SSO
   * POST /api/auth/sso/logout
   */
  @Public()
  @Post('logout')
  async logout(@Body() logoutRequestDto: SSOLogoutRequestDto) {
    this.logger.debug('SSO logout request');
    return await this.ssoService.logout(logoutRequestDto);
  }
}
