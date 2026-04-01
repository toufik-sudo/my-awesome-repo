import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { QUEUE_EMAIL } from '../jobs.constant';
import { EmailJobData } from '../job-producer.service';
import { MailerService } from '../../mailer/mailer.service';

@Processor(QUEUE_EMAIL, { concurrency: 5 })
export class EmailProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailProcessor.name);

  constructor(private readonly mailer: MailerService) {
    super();
  }

  async process(job: Job<EmailJobData>): Promise<any> {
    const { to, subject, body, template, context } = job.data;
    const startTime = Date.now();

    this.logger.log(`Processing email job ${job.id}: ${subject} → ${to}`);

    try {
      const result = await this.mailer.send({
        to,
        subject,
        html: body,
        template,
        context,
      });

      const duration = Date.now() - startTime;
      this.logger.log(
        `📧 EMAIL SENT [${duration}ms] → ${to} | Subject: ${subject} | MessageId: ${result.messageId}`,
      );

      return { sent: true, to, subject, duration, messageId: result.messageId };
    } catch (error: any) {
      this.logger.error(`Email job ${job.id} failed: ${error.message}`, error.stack);
      throw error;
    }
  }
}
