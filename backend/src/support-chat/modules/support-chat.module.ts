import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupportThread } from '../entity/support-thread.entity';
import { SupportMessage } from '../entity/support-message.entity';
import { SupportChatController } from '../controllers/support-chat.controller';
import { SupportChatService } from '../services/support-chat.service';
import { NegativeReviewService } from '../services/negative-review.service';
import { Review } from '../../reviews/entity/review.entity';
import { Property } from '../../properties/entity/property.entity';
import { WsModule } from '../../infrastructure/websocket';
import { RolesModule } from '../../user/modules/roles.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SupportThread, SupportMessage, Review, Property]),
    WsModule,
    RolesModule,
  ],
  controllers: [SupportChatController],
  providers: [SupportChatService, NegativeReviewService],
  exports: [SupportChatService, NegativeReviewService],
})
export class SupportChatModule {}
