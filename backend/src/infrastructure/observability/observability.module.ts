import { Module, Global } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RequestTimingInterceptor } from './request-timing.interceptor';
import { StructuredLoggerService } from './structured-logger.service';
import { MetricsService } from './metrics.service';

@Global()
@Module({
  providers: [
    StructuredLoggerService,
    MetricsService,
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestTimingInterceptor,
    },
  ],
  exports: [StructuredLoggerService, MetricsService],
})
export class ObservabilityModule {}
