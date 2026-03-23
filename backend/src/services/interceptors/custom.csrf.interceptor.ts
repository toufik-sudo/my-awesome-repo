import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { Logger } from '@nestjs/common';

@Injectable()
export class CustomCsrfInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | any {
    const request = context.switchToHttp().getRequest();
    // console.log(request); // Log the request object
    const hostname = request.headers.host;
    const protocol = request.protocol;
    const corsUrl = process.env.CORS_ORIGIN;
    const hostUrl = process.env.HOST_ORIGIN_HOST;
    const reqUrl = protocol + '://' + hostname;
    Logger.debug('request url', reqUrl);
    Logger.debug('cors url', corsUrl);
    if (corsUrl === reqUrl || reqUrl == hostUrl) {
      Logger.debug('Host accepted !');
      return next.handle();
    } else {
      return throwError({ message: 'Host not accepted !!!' });
    }
  }
}
