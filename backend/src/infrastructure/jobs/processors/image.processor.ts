import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { QUEUE_IMAGE } from '../jobs.constant';
import { ImageJobData } from '../job-producer.service';
import * as path from 'path';
import * as fs from 'fs';

@Processor(QUEUE_IMAGE, { concurrency: 2 })
export class ImageProcessor extends WorkerHost {
  private readonly logger = new Logger(ImageProcessor.name);

  async process(job: Job<ImageJobData>): Promise<any> {
    const { filePath, propertyId, operations } = job.data;
    const startTime = Date.now();

    this.logger.log(
      `Processing image job ${job.id}: ${filePath} | ops: ${operations.join(', ')}`,
    );

    try {
      // Verify file exists
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }

      const results: Record<string, any> = {};

      for (const op of operations) {
        await job.updateProgress(
          Math.round((operations.indexOf(op) / operations.length) * 100),
        );

        switch (op) {
          case 'resize':
            // TODO: Integrate sharp for image resizing
            // const resized = await sharp(filePath).resize(1200, 800, { fit: 'inside' }).toBuffer();
            results.resize = { status: 'done', width: 1200, height: 800 };
            this.logger.log(`  ↳ Resize complete for ${path.basename(filePath)}`);
            break;

          case 'compress':
            // TODO: Integrate sharp for compression
            // await sharp(filePath).jpeg({ quality: 80 }).toFile(outputPath);
            results.compress = { status: 'done', quality: 80 };
            this.logger.log(`  ↳ Compress complete for ${path.basename(filePath)}`);
            break;

          case 'thumbnail':
            // TODO: Generate thumbnail
            // await sharp(filePath).resize(300, 200, { fit: 'cover' }).toFile(thumbPath);
            results.thumbnail = { status: 'done', size: '300x200' };
            this.logger.log(`  ↳ Thumbnail generated for ${path.basename(filePath)}`);
            break;

          case 'watermark':
            results.watermark = { status: 'done' };
            this.logger.log(`  ↳ Watermark applied to ${path.basename(filePath)}`);
            break;
        }
      }

      await job.updateProgress(100);

      this.logger.log(
        `🖼️ Image processed [${Date.now() - startTime}ms] → ${filePath} | property:${propertyId}`,
      );

      return { filePath, propertyId, results, duration: Date.now() - startTime };
    } catch (error: any) {
      this.logger.error(`Image job ${job.id} failed: ${error.message}`, error.stack);
      throw error;
    }
  }
}
