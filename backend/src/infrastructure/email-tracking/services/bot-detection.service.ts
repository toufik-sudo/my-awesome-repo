import { Injectable, Logger } from '@nestjs/common';

export interface BotDetectionResult {
  isBot: boolean;
  reason: string | null;
  confidence: number; // 0-1
}

const BOT_USER_AGENTS = [
  'googleimageproxy', 'yahoo', 'bingpreview', 'slurp',
  'facebookexternalhit', 'twitterbot', 'linkedinbot',
  'barracuda', 'mimecast', 'proofpoint', 'fireeye',
  'messagelabs', 'symantec', 'sophos', 'forcepoint',
  'ironport', 'spamassassin', 'mailscanner', 'postfix',
  'outlook-ios', 'thunderbird', 'yandex', 'petal',
  'wget', 'curl', 'python-requests', 'java/', 'libwww',
  'bot', 'spider', 'crawler', 'scraper', 'headless',
];

const PREFETCH_UA_MARKERS = [
  'microsoft outlook', 'ms outlook', 'outlookmobilehttpaccess',
  'mozilla/4.0', 'mozilla/5.0 (compatible;',
];

/** IPs known for email security scanning (partial ranges) */
const KNOWN_SCANNER_IP_PREFIXES = [
  '66.249.',   // Google
  '209.85.',   // Google
  '40.94.',    // Microsoft
  '40.107.',   // Microsoft
  '104.47.',   // Microsoft
  '52.100.',   // Microsoft
];

@Injectable()
export class BotDetectionService {
  private readonly logger = new Logger(BotDetectionService.name);

  /** Click velocity tracking: IP → timestamps */
  private clickVelocity = new Map<string, number[]>();
  private readonly MAX_CLICKS_PER_MINUTE = 10;
  private readonly VELOCITY_WINDOW_MS = 60_000;

  detect(params: {
    userAgent?: string;
    ipAddress?: string;
    responseTimeMs?: number;
    isHoneypot?: boolean;
    jsVerified?: boolean;
  }): BotDetectionResult {
    const { userAgent = '', ipAddress = '', responseTimeMs, isHoneypot, jsVerified } = params;
    const uaLower = userAgent.toLowerCase();

    // 1. Honeypot link clicked → definite bot
    if (isHoneypot) {
      return { isBot: true, reason: 'honeypot_click', confidence: 1.0 };
    }

    // 2. Known bot UA
    for (const marker of BOT_USER_AGENTS) {
      if (uaLower.includes(marker)) {
        return { isBot: true, reason: `bot_ua:${marker}`, confidence: 0.95 };
      }
    }

    // 3. Prefetch / security scanner UA
    for (const marker of PREFETCH_UA_MARKERS) {
      if (uaLower.includes(marker)) {
        return { isBot: true, reason: `prefetch_ua:${marker}`, confidence: 0.85 };
      }
    }

    // 4. Known scanner IP
    for (const prefix of KNOWN_SCANNER_IP_PREFIXES) {
      if (ipAddress.startsWith(prefix)) {
        return { isBot: true, reason: `scanner_ip:${prefix}`, confidence: 0.9 };
      }
    }

    // 5. Suspiciously fast response (< 300ms = likely automated prefetch)
    if (responseTimeMs !== undefined && responseTimeMs < 300) {
      return { isBot: true, reason: 'too_fast', confidence: 0.8 };
    }

    // 6. Click velocity check
    if (ipAddress && this.isVelocityExceeded(ipAddress)) {
      return { isBot: true, reason: 'velocity_exceeded', confidence: 0.85 };
    }

    // 7. No User-Agent at all → suspicious
    if (!userAgent || userAgent.trim().length === 0) {
      return { isBot: true, reason: 'missing_ua', confidence: 0.7 };
    }

    // 8. JS verified = strong human signal
    if (jsVerified) {
      return { isBot: false, reason: null, confidence: 0.05 };
    }

    return { isBot: false, reason: null, confidence: 0.2 };
  }

  private isVelocityExceeded(ip: string): boolean {
    const now = Date.now();
    const timestamps = this.clickVelocity.get(ip) || [];
    const recent = timestamps.filter(t => now - t < this.VELOCITY_WINDOW_MS);
    recent.push(now);
    this.clickVelocity.set(ip, recent);

    if (recent.length > this.MAX_CLICKS_PER_MINUTE) {
      return true;
    }
    return false;
  }

  /** Clean old velocity entries periodically */
  cleanVelocityCache() {
    const now = Date.now();
    for (const [ip, timestamps] of this.clickVelocity.entries()) {
      const recent = timestamps.filter(t => now - t < this.VELOCITY_WINDOW_MS);
      if (recent.length === 0) {
        this.clickVelocity.delete(ip);
      } else {
        this.clickVelocity.set(ip, recent);
      }
    }
  }
}
