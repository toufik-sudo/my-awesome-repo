import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { TransferAccount } from './entity/transfer-account.entity';
import { PaymentReceipt } from './entity/payment-receipt.entity';
import { User } from '../user/entity/user.entity';
import { JobsModule } from 'src/infrastructure/jobs/jobs.module';
import { WsModule } from 'src/infrastructure/websocket/ws.module';

@Module({
  imports: [TypeOrmModule.forFeature([TransferAccount, PaymentReceipt, User]), JobsModule, WsModule],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
