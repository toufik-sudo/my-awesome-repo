import { Injectable, Logger } from '@nestjs/common';

interface RequestMetric {
  method: string;
  path: string;
  status: number;
  duration: number;
  timestamp: number;
}

/**
 * Lightweight in-memory metrics collector.
 * In production, replace with Prometheus client, Datadog, or OpenTelemetry.
 */
@Injectable()
export class MetricsService {
  private readonly logger = new Logger(MetricsService.name);
  private readonly recentRequests: RequestMetric[] = [];
  private readonly counters = new Map<string, number>();
  private readonly maxHistory = 10000;

  recordRequest(method: string, path: string, status: number, duration: number) {
    // Normalize path to avoid cardinality explosion (strip UUIDs/IDs)
    const normalizedPath = path.replace(
      /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi,
      ':id',
    ).replace(/\/\d+/g, '/:id');

    const metric: RequestMetric = {
      method,
      path: normalizedPath,
      status,
      duration,
      timestamp: Date.now(),
    };

    this.recentRequests.push(metric);
    if (this.recentRequests.length > this.maxHistory) {
      this.recentRequests.splice(0, this.recentRequests.length - this.maxHistory);
    }

    // Increment counters
    this.increment(`http.${method}.${status}`);
    if (status >= 500) this.increment('http.errors.5xx');
    if (status >= 400 && status < 500) this.increment('http.errors.4xx');
  }

  increment(key: string, amount = 1) {
    this.counters.set(key, (this.counters.get(key) || 0) + amount);
  }

  /** Get summary stats for monitoring endpoints */
  getSummary() {
    const now = Date.now();
    const last5min = this.recentRequests.filter((r) => now - r.timestamp < 300_000);

    const avgDuration = last5min.length
      ? Math.round(last5min.reduce((sum, r) => sum + r.duration, 0) / last5min.length)
      : 0;

    const p95 = this.percentile(last5min.map((r) => r.duration), 95);

    return {
      totalRequests: this.recentRequests.length,
      last5min: {
        count: last5min.length,
        avgDuration,
        p95Duration: p95,
        errorRate: last5min.filter((r) => r.status >= 400).length / (last5min.length || 1),
      },
      counters: Object.fromEntries(this.counters),
    };
  }

  private percentile(values: number[], p: number): number {
    if (!values.length) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.ceil((p / 100) * sorted.length) - 1;
    return sorted[Math.max(0, index)];
  }
}
