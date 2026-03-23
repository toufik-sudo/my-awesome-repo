import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { QUEUE_EMAIL } from '../jobs.constant';
import { EmailJobData } from '../job-producer.service';

@Processor(QUEUE_EMAIL, { concurrency: 5 })
export class EmailProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailProcessor.name);

  async process(job: Job<EmailJobData>): Promise<any> {
    const { to, subject, body, template } = job.data;
    const startTime = Date.now();

    this.logger.log(`Processing email job ${job.id}: ${subject} → ${to}`);

    try {
      // TODO: Replace with real mailer integration (nodemailer, SendGrid, Resend, etc.)
      // Example with nodemailer:
      // await this.mailer.sendMail({ to, subject, html: body });

      this.logger.log(
        `📧 EMAIL SENT [${Date.now() - startTime}ms] → ${to} | Subject: ${subject}`,
      );

      return { sent: true, to, subject, duration: Date.now() - startTime };
    } catch (error: any) {
      this.logger.error(`Email job ${job.id} failed: ${error.message}`, error.stack);
      throw error;
    }
  }
}
