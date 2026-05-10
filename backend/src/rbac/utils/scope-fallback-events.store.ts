/**
 * In-memory ring buffer of recent scope fallback events.
 *
 * "Fallback" = a manager / hyper_manager / guest had a granted permission whose
 * scope did NOT explicitly target properties/services/groups/admins, so we
 * inherited the inviter admin's full owned inventory.
 *
 * Replace with Redis / Loki / Elastic in production if persistence is needed.
 */

export interface ScopeFallbackEventRecord {
  id: string;
  source: string;
  role?: string;
  userId?: number;
  permissionKey?: string;
  scope?: string;
  inviterIds: number[];
  resolvedCount: number;
  resourceKind: 'property' | 'service';
  reason: string;
  timestamp: string;
}

class ScopeFallbackEventsStore {
  private readonly buffer: ScopeFallbackEventRecord[] = [];
  private readonly max = 2000;
  private seq = 0;

  push(evt: Omit<ScopeFallbackEventRecord, 'id' | 'timestamp'> & { timestamp?: string }): ScopeFallbackEventRecord {
    const record: ScopeFallbackEventRecord = {
      id: `fb_${Date.now()}_${++this.seq}`,
      timestamp: evt.timestamp ?? new Date().toISOString(),
      ...evt,
    };
    this.buffer.push(record);
    if (this.buffer.length > this.max) {
      this.buffer.splice(0, this.buffer.length - this.max);
    }
    return record;
  }

  list(filters: {
    userId?: number;
    role?: string;
    permissionKey?: string;
    resourceKind?: 'property' | 'service';
    limit?: number;
  } = {}): ScopeFallbackEventRecord[] {
    const limit = Math.min(Math.max(filters.limit ?? 200, 1), this.max);
    let out = this.buffer.slice();
    if (filters.userId != null) out = out.filter(e => e.userId === filters.userId);
    if (filters.role) out = out.filter(e => e.role === filters.role);
    if (filters.permissionKey) out = out.filter(e => e.permissionKey === filters.permissionKey);
    if (filters.resourceKind) out = out.filter(e => e.resourceKind === filters.resourceKind);
    return out.slice(-limit).reverse(); // newest first
  }

  clear(): number {
    const n = this.buffer.length;
    this.buffer.length = 0;
    return n;
  }

  size(): number {
    return this.buffer.length;
  }
}

export const scopeFallbackEventsStore = new ScopeFallbackEventsStore();
