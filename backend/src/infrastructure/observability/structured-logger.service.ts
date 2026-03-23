import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';

/**
 * Structured JSON logger for production-grade log aggregation.
 * Compatible with ELK, Datadog, CloudWatch, etc.
 */
@Injectable()
export class StructuredLoggerService implements NestLoggerService {
  private formatMessage(level: string, message: any, context?: string, meta?: Record<string, any>) {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      level,
      context: context || 'Application',
      message: typeof message === 'object' ? JSON.stringify(message) : message,
      ...meta,
    });
  }

  log(message: any, context?: string) {
    console.log(this.formatMessage('info', message, context));
  }

  error(message: any, trace?: string, context?: string) {
    console.error(this.formatMessage('error', message, context, { trace }));
  }

  warn(message: any, context?: string) {
    console.warn(this.formatMessage('warn', message, context));
  }

  debug(message: any, context?: string) {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(this.formatMessage('debug', message, context));
    }
  }

  verbose(message: any, context?: string) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(this.formatMessage('verbose', message, context));
    }
  }
}
