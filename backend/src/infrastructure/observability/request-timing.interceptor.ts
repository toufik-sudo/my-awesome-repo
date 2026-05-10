import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { randomUUID } from 'crypto';
import { MetricsService } from './metrics.service';

/**
 * Senior-grade structured request logger.
 *
 * For every HTTP request it emits ONE structured JSON log line containing:
 *  - requestId  (correlated across the lifecycle, also surfaced as x-request-id)
 *  - controller / handler  (Nest metadata — easy to grep in production)
 *  - method / url / status / durationMs
 *  - userId / role  (when authenticated, no PII payloads)
 *  - params / query / sanitized body  (truncated, secrets masked)
 *  - errorMessage  (when the handler threw)
 *
 * Slow requests (>500ms) are logged at WARN; failures at ERROR; the rest at LOG.
 *
 * In production this output is ready to ship to ELK/Datadog/CloudWatch unchanged.
 */
@Injectable()
export class RequestTimingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  // Keys whose values must NEVER appear in logs.
  private static readonly SECRET_KEYS = new Set([
    'password', 'pwd', 'pass',
    'token', 'access_token', 'refresh_token', 'id_token',
    'authorization', 'cookie', 'set-cookie',
    'secret', 'apiKey', 'api_key', 'client_secret',
    'csrf', 'x-csrf-token',
    'card', 'cardnumber', 'cvc', 'cvv', 'pan',
  ]);

  private static readonly MAX_BODY_CHARS = 1000;

  constructor(private readonly metrics: MetricsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    if (!req) return next.handle(); // non-HTTP (websocket etc.)

    const res = context.switchToHttp().getResponse();
    const requestId = (req.headers?.['x-request-id'] as string) || randomUUID();
    req.requestId = requestId;
    if (res?.setHeader) {
      try { res.setHeader('x-request-id', requestId); } catch { /* ignore */ }
    }

    const startedAt = Date.now();
    const method = req.method;
    const url = req.originalUrl || req.url;
    const controller = context.getClass()?.name;
    const handler = context.getHandler()?.name;
    const ip = req.ip || req.headers?.['x-forwarded-for'] || req.connection?.remoteAddress;

    return next.handle().pipe(
      tap({
        next: () => {
          const durationMs = Date.now() - startedAt;
          const status = res?.statusCode || 200;
          this.metrics.recordRequest(method, url, status, durationMs);

          const payload = this.buildPayload({
            requestId, controller, handler, method, url, status, durationMs, req, ip,
          });
          const line = JSON.stringify(payload);

          if (durationMs > 500) this.logger.warn(line);
          else this.logger.log(line);
        },
        error: (error) => {
          const durationMs = Date.now() - startedAt;
          const status = error?.status || 500;
          this.metrics.recordRequest(method, url, status, durationMs);

          const payload = this.buildPayload({
            requestId, controller, handler, method, url, status, durationMs, req, ip,
            errorMessage: error?.message,
            errorName: error?.name,
          });
          this.logger.error(JSON.stringify(payload));
        },
      }),
    );
  }

  private buildPayload(args: {
    requestId: string;
    controller?: string;
    handler?: string;
    method: string;
    url: string;
    status: number;
    durationMs: number;
    req: any;
    ip?: string;
    errorMessage?: string;
    errorName?: string;
  }) {
    const { req } = args;
    return {
      type: 'http_request',
      requestId: args.requestId,
      controller: args.controller,
      handler: args.handler,
      method: args.method,
      url: args.url,
      status: args.status,
      durationMs: args.durationMs,
      userId: req.user?.id,
      role: req.userRole || req.user?.role,
      ip: args.ip,
      params: this.sanitize(req.params),
      query: this.sanitize(req.query),
      body: this.sanitizeBody(req.body),
      errorName: args.errorName,
      errorMessage: args.errorMessage,
      timestamp: new Date().toISOString(),
    };
  }

  private sanitize(obj: any): any {
    if (!obj || typeof obj !== 'object') return obj;
    const out: Record<string, any> = {};
    for (const [k, v] of Object.entries(obj)) {
      if (RequestTimingInterceptor.SECRET_KEYS.has(k.toLowerCase())) {
        out[k] = '[REDACTED]';
      } else if (v && typeof v === 'object') {
        out[k] = this.sanitize(v);
      } else {
        out[k] = v;
      }
    }
    return out;
  }

  private sanitizeBody(body: any): any {
    if (body == null) return undefined;
    const sanitized = this.sanitize(body);
    try {
      const json = JSON.stringify(sanitized);
      if (json.length > RequestTimingInterceptor.MAX_BODY_CHARS) {
        return { _truncated: true, length: json.length,
          preview: json.slice(0, RequestTimingInterceptor.MAX_BODY_CHARS) };
      }
      return sanitized;
    } catch {
      return '[unserializable]';
    }
  }
}
