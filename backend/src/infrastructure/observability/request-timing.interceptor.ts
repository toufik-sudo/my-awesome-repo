import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MetricsService } from './metrics.service';

@Injectable()
export class RequestTimingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  constructor(private readonly metrics: MetricsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    if (!req) return next.handle(); // skip non-HTTP (websocket)

    const { method, url } = req;
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime;
          const status = context.switchToHttp().getResponse()?.statusCode || 200;
          this.metrics.recordRequest(method, url, status, duration);

          // Log slow requests (>500ms) at warn level
          const logFn = duration > 500 ? this.logger.warn.bind(this.logger) : this.logger.log.bind(this.logger);
          logFn(`${method} ${url} ${status} ${duration}ms`);
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          const status = error.status || 500;
          this.metrics.recordRequest(method, url, status, duration);
          this.logger.error(`${method} ${url} ${status} ${duration}ms — ${error.message}`);
        },
      }),
    );
  }
}
