import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { SSOConfigType } from '../config/sso.config';
import { SSO_DISABLED, SSO_DISABLED_CODE } from '../constants/sso.constants';
import { SSO_ONLY_KEY } from '../decorators/sso-only.decorator';

/**
 * Guard that conditionally protects routes based on SSO_ENABLED config.
 * When @SsoOnly() is applied, the route is only accessible if SSO is enabled.
 * When @SsoOnly(false) is applied, the route is only accessible if SSO is disabled (traditional auth).
 */
@Injectable()
export class SsoEnabledGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const ssoOnlyMeta = this.reflector.getAllAndOverride<boolean | undefined>(
      SSO_ONLY_KEY,
      [context.getHandler(), context.getClass()],
    );

    // No decorator → route is always accessible
    if (ssoOnlyMeta === undefined || ssoOnlyMeta === null) {
      return true;
    }

    const ssoConfig = this.configService.get<SSOConfigType>('sso');
    const ssoEnabled = ssoConfig?.enabled ?? false;

    // @SsoOnly(true) → only when SSO is enabled
    // @SsoOnly(false) → only when SSO is disabled (traditional auth only)
    if (ssoOnlyMeta === true && !ssoEnabled) {
      throw new HttpException(SSO_DISABLED, HttpStatus.FORBIDDEN, {
        description: SSO_DISABLED_CODE.toString(),
      });
    }

    if (ssoOnlyMeta === false && ssoEnabled) {
      throw new HttpException(
        'This endpoint is only available when SSO is disabled',
        HttpStatus.FORBIDDEN,
      );
    }

    return true;
  }
}
