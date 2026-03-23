import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { SSOConfigType } from '../config/sso.config';
import {
  SSO_CODE_MISSING,
  SSO_CODE_VERIFIER_MISSING,
  SSO_CONFIG_MISSING,
  SSO_DISABLED,
  SSO_DISABLED_CODE,
  SSO_INVALID_TOKEN,
  SSO_LOGOUT_KO,
  SSO_LOGOUT_OK,
  SSO_PROVIDER_NOT_SUPPORTED,
  SSO_PROVIDER_NOT_SUPPORTED_CODE,
  SSO_REFRESH_TOKEN_MISSING,
  SSO_TOKEN_EXCHANGE_KO,
  SSO_TOKEN_EXCHANGE_KO_CODE,
  SSO_TOKEN_REFRESH_KO,
  SSO_TOKEN_REFRESH_KO_CODE,
  SSO_USERINFO_KO,
  SSO_USERINFO_KO_CODE,
  SSO_PROVIDER_ENDPOINTS,
} from '../constants/sso.constants';
import {
  SSOTokenRequestDto,
  SSORefreshRequestDto,
  SSOLogoutRequestDto,
} from '../dtos/requests/sso.token.request.dto';
import {
  SSOTokenResponseDto,
  SSOUserInfoResponseDto,
  SSOLogoutResponseDto,
} from '../dtos/responses/sso.token.response.dto';

@Injectable()
export class SSOService {
  private readonly logger = new Logger(SSOService.name);
  private readonly ssoConfig: SSOConfigType;

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.ssoConfig = this.configService.get<SSOConfigType>('sso');
  }

  /**
   * Check if SSO is enabled
   */
  isEnabled(): boolean {
    return this.ssoConfig?.enabled ?? false;
  }

  /**
   * Guard: ensure SSO is enabled before proceeding
   */
  private ensureEnabled(): void {
    if (!this.isEnabled()) {
      throw new HttpException(SSO_DISABLED, HttpStatus.FORBIDDEN, {
        cause: SSO_DISABLED,
        description: SSO_DISABLED_CODE.toString(),
      });
    }
  }

  /**
   * Get provider endpoints or throw
   */
  private getProviderEndpoints(provider: string) {
    const key = provider.toUpperCase();
    const endpoints = SSO_PROVIDER_ENDPOINTS[key];
    if (!endpoints) {
      throw new HttpException(
        SSO_PROVIDER_NOT_SUPPORTED,
        HttpStatus.BAD_REQUEST,
        {
          cause: `${SSO_PROVIDER_NOT_SUPPORTED}: ${provider}`,
          description: SSO_PROVIDER_NOT_SUPPORTED_CODE.toString(),
        },
      );
    }
    return endpoints;
  }

  /**
   * Exchange authorization code for tokens
   */
  async exchangeToken(
    tokenRequestDto: SSOTokenRequestDto,
  ): Promise<SSOTokenResponseDto> {
    this.ensureEnabled();

    if (!tokenRequestDto.code) {
      throw new UnauthorizedException(SSO_CODE_MISSING);
    }
    if (!tokenRequestDto.codeVerifier) {
      throw new UnauthorizedException(SSO_CODE_VERIFIER_MISSING);
    }

    const { provider, code, codeVerifier, redirectUri } = tokenRequestDto;
    const endpoints = this.getProviderEndpoints(provider);

    try {
      const body = new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: this.ssoConfig.clientId,
        client_secret: this.ssoConfig.clientSecret,
        code_verifier: codeVerifier,
      });

      const headers: Record<string, string> = {
        'Content-Type': 'application/x-www-form-urlencoded',
      };

      // GitHub requires Accept: application/json
      if (provider.toLowerCase() === 'github') {
        headers['Accept'] = 'application/json';
      }

      const response = await fetch(endpoints.tokenEndpoint, {
        method: 'POST',
        headers,
        body: body.toString(),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        this.logger.error(
          `SSO token exchange failed for ${provider}: ${response.status} - ${errorBody}`,
        );
        throw new HttpException(
          SSO_TOKEN_EXCHANGE_KO,
          HttpStatus.UNAUTHORIZED,
          {
            cause: errorBody,
            description: SSO_TOKEN_EXCHANGE_KO_CODE.toString(),
          },
        );
      }

      const tokenData = await response.json();

      // Generate internal JWT with SSO claims
      const internalPayload = {
        sub: tokenData.sub || 'sso_user',
        provider,
        sso: true,
        externalAccessToken: tokenData.access_token,
      };

      const internalToken = this.jwtService.sign(internalPayload, {
        expiresIn: `${this.ssoConfig.tokenExpirySeconds}s`,
      });

      const result: SSOTokenResponseDto = {
        access_token: internalToken,
        id_token: tokenData.id_token,
        refresh_token: tokenData.refresh_token,
        expires_in: this.ssoConfig.tokenExpirySeconds,
        token_type: tokenData.token_type || 'Bearer',
        scope: tokenData.scope,
      };

      this.logger.log(`SSO token exchange successful for provider: ${provider}`);
      return result;
    } catch (error: any) {
      if (error instanceof HttpException) throw error;
      this.logger.error(`SSO token exchange error: ${error.message}`);
      throw new HttpException(
        SSO_TOKEN_EXCHANGE_KO,
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error.message,
          description: SSO_TOKEN_EXCHANGE_KO_CODE.toString(),
        },
      );
    }
  }

  /**
   * Fetch user info from the provider using the access token
   */
  async getUserInfo(
    accessToken: string,
    provider?: string,
  ): Promise<SSOUserInfoResponseDto> {
    this.ensureEnabled();

    if (!accessToken) {
      throw new UnauthorizedException(SSO_INVALID_TOKEN);
    }

    // Decode internal JWT to get external access token and provider
    let decoded: any;
    try {
      decoded = this.jwtService.verify(accessToken);
    } catch {
      throw new UnauthorizedException(SSO_INVALID_TOKEN);
    }

    const resolvedProvider = provider || decoded.provider;
    const externalToken = decoded.externalAccessToken;

    if (!resolvedProvider || !externalToken) {
      throw new UnauthorizedException(SSO_CONFIG_MISSING);
    }

    const endpoints = this.getProviderEndpoints(resolvedProvider);

    try {
      const headers: Record<string, string> = {
        Authorization: `Bearer ${externalToken}`,
      };

      // GitHub uses a different auth header
      if (resolvedProvider.toLowerCase() === 'github') {
        headers['Accept'] = 'application/vnd.github+json';
        headers['X-GitHub-Api-Version'] = '2022-11-28';
      }

      const response = await fetch(endpoints.userinfoEndpoint, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        const errorBody = await response.text();
        this.logger.error(
          `SSO userinfo failed for ${resolvedProvider}: ${response.status} - ${errorBody}`,
        );
        throw new HttpException(SSO_USERINFO_KO, HttpStatus.UNAUTHORIZED, {
          cause: errorBody,
          description: SSO_USERINFO_KO_CODE.toString(),
        });
      }

      const claims = await response.json();

      // Normalize claims across providers
      const userInfo = this.mapProviderClaims(resolvedProvider, claims);

      this.logger.log(
        `SSO userinfo fetched for provider: ${resolvedProvider}, sub: ${userInfo.sub}`,
      );
      return userInfo;
    } catch (error: any) {
      if (error instanceof HttpException) throw error;
      this.logger.error(`SSO userinfo error: ${error.message}`);
      throw new HttpException(
        SSO_USERINFO_KO,
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error.message,
          description: SSO_USERINFO_KO_CODE.toString(),
        },
      );
    }
  }

  /**
   * Refresh an SSO token
   */
  async refreshToken(
    refreshRequestDto: SSORefreshRequestDto,
  ): Promise<SSOTokenResponseDto> {
    this.ensureEnabled();

    if (!refreshRequestDto.refreshToken) {
      throw new UnauthorizedException(SSO_REFRESH_TOKEN_MISSING);
    }

    // Default to Google if no provider specified
    const provider = refreshRequestDto.provider || 'google';
    const endpoints = this.getProviderEndpoints(provider);

    try {
      const body = new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshRequestDto.refreshToken,
        client_id: this.ssoConfig.clientId,
        client_secret: this.ssoConfig.clientSecret,
      });

      const response = await fetch(endpoints.tokenEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        this.logger.error(
          `SSO token refresh failed for ${provider}: ${response.status} - ${errorBody}`,
        );
        throw new HttpException(
          SSO_TOKEN_REFRESH_KO,
          HttpStatus.UNAUTHORIZED,
          {
            cause: errorBody,
            description: SSO_TOKEN_REFRESH_KO_CODE.toString(),
          },
        );
      }

      const tokenData = await response.json();

      // Generate new internal JWT
      const internalPayload = {
        sub: tokenData.sub || 'sso_user',
        provider,
        sso: true,
        externalAccessToken: tokenData.access_token,
      };

      const internalToken = this.jwtService.sign(internalPayload, {
        expiresIn: `${this.ssoConfig.tokenExpirySeconds}s`,
      });

      const result: SSOTokenResponseDto = {
        access_token: internalToken,
        id_token: tokenData.id_token,
        refresh_token: tokenData.refresh_token,
        expires_in: this.ssoConfig.tokenExpirySeconds,
        token_type: tokenData.token_type || 'Bearer',
      };

      this.logger.log(`SSO token refresh successful for provider: ${provider}`);
      return result;
    } catch (error: any) {
      if (error instanceof HttpException) throw error;
      this.logger.error(`SSO token refresh error: ${error.message}`);
      throw new HttpException(
        SSO_TOKEN_REFRESH_KO,
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error.message,
          description: SSO_TOKEN_REFRESH_KO_CODE.toString(),
        },
      );
    }
  }

  /**
   * Logout from SSO - revoke tokens if supported
   */
  async logout(logoutRequestDto: SSOLogoutRequestDto): Promise<SSOLogoutResponseDto> {
    this.ensureEnabled();

    const provider = logoutRequestDto.provider || 'google';

    try {
      const endpoints = this.getProviderEndpoints(provider);

      // Attempt token revocation if provider supports it
      if (endpoints.revokeEndpoint && logoutRequestDto.idToken) {
        const body = new URLSearchParams({
          token: logoutRequestDto.idToken,
        });

        await fetch(endpoints.revokeEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: body.toString(),
        }).catch((err) => {
          this.logger.warn(`SSO revocation best-effort failed: ${err.message}`);
        });
      }

      this.logger.log(`SSO logout completed for provider: ${provider}`);
      return {
        message: SSO_LOGOUT_OK,
        code: HttpStatus.OK,
      };
    } catch (error: any) {
      this.logger.error(`SSO logout error: ${error.message}`);
      // Best-effort logout — still return OK
      return {
        message: SSO_LOGOUT_OK,
        code: HttpStatus.OK,
      };
    }
  }

  /**
   * Normalize provider-specific claims to a standard format
   */
  private mapProviderClaims(
    provider: string,
    claims: Record<string, any>,
  ): SSOUserInfoResponseDto {
    const normalized = provider.toLowerCase();

    switch (normalized) {
      case 'github':
        return {
          sub: String(claims.id || ''),
          id: String(claims.id || ''),
          email: claims.email || undefined,
          username: claims.name || claims.login || undefined,
          picture: claims.avatar_url || undefined,
          phone_number: undefined,
          roles: undefined,
          email_verified: undefined,
        };

      case 'facebook':
        return {
          sub: claims.id || '',
          id: claims.id || '',
          email: claims.email || undefined,
          username: claims.name || undefined,
          picture: claims.picture?.data?.url || undefined,
          phone_number: undefined,
          roles: undefined,
          email_verified: undefined,
        };

      case 'microsoft':
        return {
          sub: claims.sub || '',
          id: claims.id || '',
          email: claims.email || claims.preferred_username || undefined,
          username: claims.name || undefined,
          picture: undefined,
          phone_number: claims.phone_number || undefined,
          roles: claims.roles || undefined,
          email_verified: claims.email_verified || undefined,
        };

      case 'google':
      case 'apple':
      default:
        return {
          sub: claims.sub || '',
          id: claims.id || '',
          email: claims.email || undefined,
          username: claims.name || claims.given_name || undefined,
          picture: claims.picture || undefined,
          phone_number: claims.phone_number || undefined,
          roles: claims.roles || claims.groups || undefined,
          email_verified: claims.email_verified || undefined,
        };
    }
  }
}
