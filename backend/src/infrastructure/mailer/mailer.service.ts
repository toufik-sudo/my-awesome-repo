import { Injectable, Logger, OnModuleInit, Optional, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import * as Handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import { EmailTrackingService } from '../email-tracking/services/email-tracking.service';
import { randomBytes } from 'crypto';

export interface SendMailOptions {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  template?: string;
  context?: Record<string, unknown>;
  /** Skip tracking injection for system emails */
  skipTracking?: boolean;
}

@Injectable()
export class MailerService implements OnModuleInit {
  private readonly logger = new Logger(MailerService.name);
  private transporter: Transporter;
  private compiledTemplates = new Map<string, Handlebars.TemplateDelegate>();
  private layoutTemplate: Handlebars.TemplateDelegate | null = null;

  private readonly fromName: string;
  private readonly fromAddress: string;

  constructor(
    private readonly config: ConfigService,
    @Optional() @Inject(EmailTrackingService)
    private readonly emailTracking?: EmailTrackingService,
  ) {
    this.fromName = this.config.get<string>('EMAIL_FROM_NAME', 'Byootdz');
    this.fromAddress = this.config.get<string>(
      'EMAIL_FROM_ADDRESS',
      'noreply@byootdz.com',
    );
  }

  async onModuleInit() {
    this.createTransporter();
    this.registerHandlebarsHelpers();
    this.loadTemplates();
    await this.verifyConnection();
  }

  private createTransporter() {
    const host = this.config.get<string>('SMTP_HOST', 'smtp.gmail.com');
    const port = this.config.get<number>('SMTP_PORT', 587);
    const secure =
      this.config.get<string>('SMTP_SECURE', 'false') === 'true';
    const user = this.config.get<string>('SMTP_USER', '');
    const pass = this.config.get<string>('SMTP_PASS', '');

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: user && pass ? { user, pass } : undefined,
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
      rateLimit: 10,
    });

    this.logger.log(`SMTP transporter created → ${host}:${port}`);
  }

  private async verifyConnection() {
    try {
      await this.transporter.verify();
      this.logger.log('✅ SMTP connection verified');
    } catch (err: any) {
      this.logger.warn(
        `⚠️ SMTP verification failed (emails will retry): ${err.message}`,
      );
    }
  }

  /** Handlebars helpers */
  private registerHandlebarsHelpers() {
    Handlebars.registerHelper('year', () => new Date().getFullYear());

    Handlebars.registerHelper('eq', (a: unknown, b: unknown) => a === b);

    Handlebars.registerHelper(
      'ifCond',
      function (
        this: any,
        v1: unknown,
        op: string,
        v2: unknown,
        options: any,
      ) {
        switch (op) {
          case '==':
            return v1 == v2
              ? options.fn(this)
              : options.inverse(this);
          case '===':
            return v1 === v2
              ? options.fn(this)
              : options.inverse(this);
          case '!=':
            return v1 != v2
              ? options.fn(this)
              : options.inverse(this);
          default:
            return options.inverse(this);
        }
      },
    );

    Handlebars.registerHelper(
      'uppercase',
      (str: string = '') => str.toUpperCase(),
    );

    Handlebars.registerHelper('capitalize', (str: string = '') =>
      str.replace(/\b\w/g, (l) => l.toUpperCase()),
    );

    Handlebars.registerHelper(
      'formatDate',
      (date: string | Date) => {
        const d = new Date(date);
        return d.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      },
    );

    Handlebars.registerHelper(
      'formatCurrency',
      (amount: number, currency: string = 'DZD') => {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency,
        }).format(amount);
      },
    );
  }

  /** Load templates */
  private loadTemplates() {
    const templatesDir = path.join(__dirname, 'templates');

    if (!fs.existsSync(templatesDir)) {
      this.logger.warn(
        `Templates directory not found: ${templatesDir}`,
      );
      return;
    }

    // Layout
    const layoutPath = path.join(templatesDir, '_layout.hbs');
    if (fs.existsSync(layoutPath)) {
      const layoutSource = fs.readFileSync(layoutPath, 'utf-8');
      this.layoutTemplate = Handlebars.compile(layoutSource);
      this.logger.log('📐 Layout template loaded');
    }

    // Partials
    const partialsDir = path.join(templatesDir, 'partials');
    if (fs.existsSync(partialsDir)) {
      const partialFiles = fs
        .readdirSync(partialsDir)
        .filter((f) => f.endsWith('.hbs'));

      for (const file of partialFiles) {
        const name = path.basename(file, '.hbs');
        const source = fs.readFileSync(
          path.join(partialsDir, file),
          'utf-8',
        );
        Handlebars.registerPartial(name, source);
      }

      this.logger.log(`📎 Loaded ${partialFiles.length} partial(s)`);
    }

    // Templates
    const templateFiles = fs
      .readdirSync(templatesDir)
      .filter(
        (f) => f.endsWith('.hbs') && !f.startsWith('_'),
      );

    for (const file of templateFiles) {
      const name = path.basename(file, '.hbs');
      const source = fs.readFileSync(
        path.join(templatesDir, file),
        'utf-8',
      );
      this.compiledTemplates.set(
        name,
        Handlebars.compile(source),
      );
    }

    this.logger.log(
      `📧 Loaded ${this.compiledTemplates.size} email template(s)`,
    );
  }

  /** Render template */
  private renderTemplate(
    templateName: string,
    context: Record<string, unknown>,
  ): string {
    const template = this.compiledTemplates.get(templateName);

    if (!template) {
      this.logger.error(
        `Template not found: ${templateName}`,
      );
      return '';
    }

    const enrichedContext = {
      ...context,
      appName: this.fromName,
      appUrl: this.config.get<string>(
        'FRONTEND_URL',
        'http://localhost:5173',
      ),
      supportEmail: this.fromAddress,
      currentYear: new Date().getFullYear(),
    };

    const bodyHtml = template(enrichedContext);

    if (this.layoutTemplate) {
      return this.layoutTemplate({
        ...enrichedContext,
        content: new Handlebars.SafeString(bodyHtml),
      });
    }

    return bodyHtml;
  }

  /** Send email with optional tracking injection */
  async send(
    options: SendMailOptions,
  ): Promise<{ messageId: string }> {
    let html = options.html || '';

    if (options.template) {
      html = this.renderTemplate(
        options.template,
        options.context || {},
      );
    }

    const messageId = randomBytes(16).toString('hex');

    // Inject tracking (pixel + link rewriting) unless explicitly skipped
    if (!options.skipTracking && this.emailTracking && html) {
      try {
        const result = this.emailTracking.injectTracking(
          html,
          messageId,
          options.to,
          options.template,
        );
        html = result.html;

        // Persist tracked links
        if (result.trackedLinks.length > 0) {
          await this.emailTracking.saveTrackedLinks(
            result.trackedLinks,
            messageId,
            options.to,
          );
        }
      } catch (err: any) {
        this.logger.warn(`Tracking injection failed: ${err.message}`);
      }
    }

    const info = await this.transporter.sendMail({
      from: `"${this.fromName}" <${this.fromAddress}>`,
      to: options.to,
      subject: options.subject,
      html,
      text: options.text || this.htmlToPlainText(html),
      headers: { 'X-Tracking-Id': messageId },
    });

    // Record sent event
    if (this.emailTracking && !options.skipTracking) {
      try {
        await this.emailTracking.recordSentEvent(
          messageId,
          options.to,
          options.subject,
          options.template,
        );
      } catch (err: any) {
        this.logger.warn(`Sent event recording failed: ${err.message}`);
      }
    }

    this.logger.log(
      `📧 Email sent [${info.messageId}] → ${options.to}`,
    );

    return { messageId: info.messageId };
  }

  /** HTML → text */
  private htmlToPlainText(html: string): string {
    return html
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<\/div>/gi, '\n')
      .replace(/<\/h[1-6]>/gi, '\n\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }
}