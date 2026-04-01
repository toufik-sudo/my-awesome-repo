import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual } from 'typeorm';
import { randomBytes } from 'crypto';
import { EmailEvent, EmailEventType } from '../entities/email-event.entity';
import { TrackedLink } from '../entities/tracked-link.entity';
import { BotDetectionService } from './bot-detection.service';
import { ConfigService } from '@nestjs/config';

export interface TrackingInjectionResult {
  html: string;
  messageId: string;
  trackedLinks: { trackingId: string; originalUrl: string; tag: string }[];
}

export interface EmailAnalytics {
  totalSent: number;
  totalDelivered: number;
  totalOpened: number;
  totalClicked: number;
  totalBounced: number;
  totalSpam: number;
  openRate: number;
  clickRate: number;
  ctr: number; // click-to-open rate
  botOpenRate: number;
  botClickRate: number;
  byTemplate: TemplateStats[];
  byDay: DailyStats[];
  topLinks: LinkStats[];
  recentEvents: EmailEvent[];
}

interface TemplateStats {
  templateName: string;
  sent: number;
  opened: number;
  clicked: number;
  openRate: number;
  ctr: number;
}

interface DailyStats {
  date: string;
  sent: number;
  opened: number;
  clicked: number;
  bounced: number;
}

interface LinkStats {
  originalUrl: string;
  linkTag: string;
  totalClicks: number;
  humanClicks: number;
  botClicks: number;
}

@Injectable()
export class EmailTrackingService {
  private readonly logger = new Logger(EmailTrackingService.name);
  private readonly backendUrl: string;

  constructor(
    @InjectRepository(EmailEvent)
    private readonly eventRepo: Repository<EmailEvent>,
    @InjectRepository(TrackedLink)
    private readonly linkRepo: Repository<TrackedLink>,
    private readonly botDetection: BotDetectionService,
    private readonly config: ConfigService,
  ) {
    this.backendUrl = this.config.get<string>('BACKEND_URL', 'http://localhost:3000');
  }

  // ─── Tracking Injection ──────────────────────────────────────────

  injectTracking(
    html: string,
    messageId: string,
    recipientEmail: string,
    templateName?: string,
  ): TrackingInjectionResult {
    const trackedLinks: TrackingInjectionResult['trackedLinks'] = [];
    const encodedRecipient = Buffer.from(recipientEmail).toString('base64url');

    // 1. Replace all <a href="..."> with tracked links
    let linkIndex = 0;
    const processedHtml = html.replace(
      /<a\s+([^>]*?)href=["']([^"']+)["']([^>]*?)>/gi,
      (match, before, url, after) => {
        // Skip mailto: and tel: links
        if (url.startsWith('mailto:') || url.startsWith('tel:')) return match;
        // Skip unsubscribe links
        if (url.includes('unsubscribe')) return match;

        const trackingId = this.generateTrackingId();
        const tag = this.extractLinkTag(before + after, linkIndex);
        linkIndex++;

        trackedLinks.push({ trackingId, originalUrl: url, tag });

        const trackedUrl = `${this.backendUrl}/email-tracking/click?tid=${trackingId}`;
        return `<a ${before}href="${trackedUrl}"${after}>`;
      },
    );

    // 2. Add tracking pixel before </body>
    const pixelUrl = `${this.backendUrl}/email-tracking/pixel?mid=${messageId}&r=${encodedRecipient}`;
    const pixel = `<img src="${pixelUrl}" width="1" height="1" alt="" style="display:none;width:1px;height:1px;border:0;" />`;

    // 3. Add honeypot pixel (invisible, detects bots that load ALL images)
    const honeypotUrl = `${this.backendUrl}/email-tracking/pixel?mid=${messageId}&r=${encodedRecipient}&hp=1`;
    const honeypot = `<img src="${honeypotUrl}" width="0" height="0" alt="" style="display:none;position:absolute;left:-9999px;" />`;

    const finalHtml = processedHtml.replace(
      /<\/body>/i,
      `${pixel}${honeypot}</body>`,
    );

    return { html: finalHtml, messageId, trackedLinks };
  }

  // ─── Event Recording ─────────────────────────────────────────────

  async recordSentEvent(
    messageId: string,
    recipientEmail: string,
    subject: string,
    templateName?: string,
  ): Promise<void> {
    await this.eventRepo.save({
      messageId,
      eventType: 'sent' as EmailEventType,
      recipientEmail,
      subject,
      templateName,
    });
  }

  async recordOpenEvent(
    messageId: string,
    recipientEmail: string,
    userAgent?: string,
    ipAddress?: string,
    isHoneypot = false,
  ): Promise<void> {
    const botResult = this.botDetection.detect({
      userAgent,
      ipAddress,
      isHoneypot,
    });

    await this.eventRepo.save({
      messageId,
      eventType: 'opened' as EmailEventType,
      recipientEmail,
      userAgent,
      ipAddress,
      isBot: botResult.isBot,
      botReason: botResult.reason,
      isHoneypot,
    });
  }

  async recordClickEvent(
    trackingId: string,
    userAgent?: string,
    ipAddress?: string,
    responseTimeMs?: number,
    jsVerified = false,
  ): Promise<{ redirectUrl: string } | null> {
    const link = await this.linkRepo.findOne({ where: { trackingId } });
    if (!link) return null;

    const botResult = this.botDetection.detect({
      userAgent,
      ipAddress,
      responseTimeMs,
      jsVerified,
    });

    // Update link stats
    link.clickCount++;
    if (!botResult.isBot) link.humanClickCount++;
    await this.linkRepo.save(link);

    // Record event
    await this.eventRepo.save({
      messageId: link.messageId,
      eventType: 'clicked' as EmailEventType,
      recipientEmail: link.recipientEmail,
      clickedUrl: link.originalUrl,
      linkTag: link.linkTag,
      userAgent,
      ipAddress,
      isBot: botResult.isBot,
      botReason: botResult.reason,
      responseTimeMs,
      jsVerified,
    });

    return { redirectUrl: link.originalUrl };
  }

  async saveTrackedLinks(
    links: TrackingInjectionResult['trackedLinks'],
    messageId: string,
    recipientEmail: string,
  ): Promise<void> {
    const entities = links.map(l => this.linkRepo.create({
      trackingId: l.trackingId,
      messageId,
      originalUrl: l.originalUrl,
      linkTag: l.tag,
      recipientEmail,
    }));
    await this.linkRepo.save(entities);
  }

  async recordWebhookEvent(
    eventType: EmailEventType,
    messageId: string,
    recipientEmail: string,
    metadata?: Record<string, any>,
  ): Promise<void> {
    await this.eventRepo.save({
      messageId,
      eventType,
      recipientEmail,
      metadata,
    });
  }

  async recordJsVerification(
    messageId: string,
    recipientEmail: string,
  ): Promise<void> {
    // Mark most recent open event as JS verified
    const recent = await this.eventRepo.findOne({
      where: { messageId, recipientEmail, eventType: 'opened' as EmailEventType },
      order: { createdAt: 'DESC' },
    });
    if (recent) {
      recent.jsVerified = true;
      recent.isBot = false;
      recent.botReason = null;
      await this.eventRepo.save(recent);
    }
  }

  // ─── Analytics ────────────────────────────────────────────────────

  async getAnalytics(days = 30): Promise<EmailAnalytics> {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const events = await this.eventRepo.find({
      where: { createdAt: MoreThanOrEqual(since) },
      order: { createdAt: 'DESC' },
    });

    const sent = events.filter(e => e.eventType === 'sent');
    const delivered = events.filter(e => e.eventType === 'delivered');
    const opened = events.filter(e => e.eventType === 'opened');
    const clicked = events.filter(e => e.eventType === 'clicked');
    const bounced = events.filter(e => e.eventType === 'bounced');
    const spam = events.filter(e => e.eventType === 'spam_report');

    const humanOpens = opened.filter(e => !e.isBot);
    const humanClicks = clicked.filter(e => !e.isBot);
    const botOpens = opened.filter(e => e.isBot);
    const botClicks = clicked.filter(e => e.isBot);

    const totalSent = sent.length;
    const totalDelivered = delivered.length || totalSent;

    return {
      totalSent,
      totalDelivered,
      totalOpened: humanOpens.length,
      totalClicked: humanClicks.length,
      totalBounced: bounced.length,
      totalSpam: spam.length,
      openRate: totalDelivered > 0 ? (humanOpens.length / totalDelivered) * 100 : 0,
      clickRate: totalDelivered > 0 ? (humanClicks.length / totalDelivered) * 100 : 0,
      ctr: humanOpens.length > 0 ? (humanClicks.length / humanOpens.length) * 100 : 0,
      botOpenRate: opened.length > 0 ? (botOpens.length / opened.length) * 100 : 0,
      botClickRate: clicked.length > 0 ? (botClicks.length / clicked.length) * 100 : 0,
      byTemplate: this.aggregateByTemplate(events),
      byDay: this.aggregateByDay(events, days),
      topLinks: await this.getTopLinks(since),
      recentEvents: events.slice(0, 50),
    };
  }

  private aggregateByTemplate(events: EmailEvent[]): TemplateStats[] {
    const map = new Map<string, { sent: number; opened: number; clicked: number }>();
    for (const e of events) {
      const tpl = e.templateName || 'unknown';
      if (!map.has(tpl)) map.set(tpl, { sent: 0, opened: 0, clicked: 0 });
      const s = map.get(tpl)!;
      if (e.eventType === 'sent') s.sent++;
      if (e.eventType === 'opened' && !e.isBot) s.opened++;
      if (e.eventType === 'clicked' && !e.isBot) s.clicked++;
    }
    return Array.from(map.entries()).map(([templateName, s]) => ({
      templateName,
      ...s,
      openRate: s.sent > 0 ? (s.opened / s.sent) * 100 : 0,
      ctr: s.opened > 0 ? (s.clicked / s.opened) * 100 : 0,
    }));
  }

  private aggregateByDay(events: EmailEvent[], days: number): DailyStats[] {
    const map = new Map<string, DailyStats>();
    for (let i = 0; i < days; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      map.set(key, { date: key, sent: 0, opened: 0, clicked: 0, bounced: 0 });
    }
    for (const e of events) {
      const key = e.createdAt.toISOString().split('T')[0];
      const day = map.get(key);
      if (!day) continue;
      if (e.eventType === 'sent') day.sent++;
      if (e.eventType === 'opened' && !e.isBot) day.opened++;
      if (e.eventType === 'clicked' && !e.isBot) day.clicked++;
      if (e.eventType === 'bounced') day.bounced++;
    }
    return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
  }

  private async getTopLinks(since: Date): Promise<LinkStats[]> {
    const links = await this.linkRepo.find({
      where: { createdAt: MoreThanOrEqual(since) },
      order: { clickCount: 'DESC' },
      take: 20,
    });
    return links.map(l => ({
      originalUrl: l.originalUrl,
      linkTag: l.linkTag || '',
      totalClicks: l.clickCount,
      humanClicks: l.humanClickCount,
      botClicks: l.clickCount - l.humanClickCount,
    }));
  }

  // ─── Helpers ──────────────────────────────────────────────────────

  private generateTrackingId(): string {
    return randomBytes(16).toString('hex');
  }

  private extractLinkTag(attrs: string, index: number): string {
    const tagMatch = attrs.match(/data-tag=["']([^"']+)["']/i);
    if (tagMatch) return tagMatch[1];
    const classMatch = attrs.match(/class=["']([^"']+)["']/i);
    if (classMatch) return classMatch[1];
    return `link_${index}`;
  }
}
