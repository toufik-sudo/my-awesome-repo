import {
  Controller, Get, Post, Query, Body, Req, Res, Logger,
  HttpCode, Header,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { EmailTrackingService } from '../services/email-tracking.service';
import { BotDetectionService } from '../services/bot-detection.service';
import { Public } from 'src/auth/decorators/public.decorator';
import { EmailEventType } from '../entities/email-event.entity';

// 1x1 transparent GIF
const TRANSPARENT_GIF = Buffer.from(
  'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
  'base64',
);

@Controller('email-tracking')
export class EmailTrackingController {
  private readonly logger = new Logger(EmailTrackingController.name);

  constructor(
    private readonly tracking: EmailTrackingService,
    private readonly botDetection: BotDetectionService,
  ) { }

  /** Tracking pixel endpoint (open detection) */
  @Public()
  @Get('pixel')
  @Header('Content-Type', 'image/gif')
  @Header('Cache-Control', 'no-store, no-cache, must-revalidate, private')
  @Header('Pragma', 'no-cache')
  @Header('Expires', '0')
  async handlePixel(
    @Query('mid') messageId: string,
    @Query('r') encodedRecipient: string,
    @Query('hp') honeypot: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      if (messageId && encodedRecipient) {
        const recipient = Buffer.from(encodedRecipient, 'base64url').toString();
        const isHoneypot = honeypot === '1';

        await this.tracking.recordOpenEvent(
          messageId,
          recipient,
          req.headers['user-agent'],
          this.getClientIp(req),
          isHoneypot,
        );
      }
    } catch (err: any) {
      this.logger.error(`Pixel tracking error: ${err.message}`);
    }

    res.end(TRANSPARENT_GIF);
  }

  /** Link click redirect endpoint */
  @Public()
  @Get('click')
  async handleClick(
    @Query('tid') trackingId: string,
    @Query('ts') sentTimestamp: string,
    @Query('js') jsFlag: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const responseTimeMs = sentTimestamp
        ? Date.now() - parseInt(sentTimestamp, 10)
        : undefined;

      const result = await this.tracking.recordClickEvent(
        trackingId,
        req.headers['user-agent'],
        this.getClientIp(req),
        responseTimeMs,
        jsFlag === '1',
      );

      if (result) {
        return res.redirect(302, result.redirectUrl);
      }
    } catch (err: any) {
      this.logger.error(`Click tracking error: ${err.message}`);
    }

    res.status(404).send('Link not found');
  }

  /** JS verification callback (proves human opened email in browser) */
  @Public()
  @Post('js-verify')
  @HttpCode(204)
  async handleJsVerify(
    @Body('mid') messageId: string,
    @Body('r') encodedRecipient: string,
  ) {
    if (messageId && encodedRecipient) {
      const recipient = Buffer.from(encodedRecipient, 'base64url').toString();
      await this.tracking.recordJsVerification(messageId, recipient);
    }
  }

  /** SendGrid-style webhook endpoint */
  @Public()
  @Post('webhook')
  @HttpCode(200)
  async handleWebhook(@Body() events: any[], @Req() req: Request) {
    this.logger.log(`Webhook received: ${Array.isArray(events) ? events.length : 1} event(s)`);

    const eventList = Array.isArray(events) ? events : [events];

    for (const event of eventList) {
      try {
        const eventType = this.mapWebhookEvent(event.event);
        if (!eventType) continue;

        await this.tracking.recordWebhookEvent(
          eventType,
          event.sg_message_id || event.messageId || event['X-Message-Id'] || '',
          event.email || event.recipient || '',
          {
            reason: event.reason,
            status: event.status,
            response: event.response,
            type: event.type,
            ip: event.ip,
            useragent: event.useragent,
            timestamp: event.timestamp,
          },
        );
      } catch (err: any) {
        this.logger.error(`Webhook event processing error: ${err.message}`);
      }
    }

    return { processed: eventList.length };
  }

  /** Analytics endpoint (admin only — JWT guard applies) */
  @Get('analytics')
  async getAnalytics(@Query('days') days?: string) {
    return this.tracking.getAnalytics(days ? parseInt(days, 10) : 30);
  }

  // ─── Helpers ──────────────────────────────────────────────────────

  private getClientIp(req: Request): string {
    return (
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.socket?.remoteAddress ||
      ''
    );
  }

  private mapWebhookEvent(event: string): EmailEventType | null {
    const map: Record<string, EmailEventType> = {
      delivered: 'delivered',
      open: 'opened',
      click: 'clicked',
      bounce: 'bounced',
      dropped: 'dropped',
      spamreport: 'spam_report',
      unsubscribe: 'unsubscribed',
      group_unsubscribe: 'unsubscribed',
    };

    return map[event] || null;
  }
}
