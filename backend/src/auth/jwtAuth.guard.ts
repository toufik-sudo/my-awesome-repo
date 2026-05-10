import {
  Injectable,
  ExecutionContext,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
// import { Observable } from 'rxjs';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './decorators/public.decorator';
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()]
    );

    if (isPublic) {
      const request = context.switchToHttp().getRequest();
      const hasBearerToken = typeof request.headers?.authorization === 'string'
        && request.headers.authorization.toLowerCase().startsWith('bearer ');

      if (!hasBearerToken) {
        return true;
      }
    }

    const resp = super.canActivate(context);
    Logger.debug('JWT !!! ');
    return resp;
  }

  handleRequest(err: any, user: any, _info: any, context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return err || !user ? null : user;
    }

    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    return user;
  }
}
