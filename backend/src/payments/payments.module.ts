import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { EscrowController } from './escrow.controller';
import { EscrowService } from './services/escrow.service';
import { PayoutSchedulerService } from './services/payout-scheduler.service';
import { DisputesService } from './services/disputes.service';
import { PlatformAccountsService } from './services/platform-accounts.service';
import { HostReactivationService } from './services/host-reactivation.service';
import { TransferAccount } from './entity/transfer-account.entity';
import { PaymentReceipt } from './entity/payment-receipt.entity';
import { PlatformAccount } from './entity/platform-account.entity';
import { HostPayout } from './entity/host-payout.entity';
import { BookingDispute } from './entity/booking-dispute.entity';
import { HostFeeDebt } from './entity/host-fee-debt.entity';
import { User } from '../user/entity/user.entity';
import { Booking } from '../bookings/entity/booking.entity';
import { ServiceBooking } from '../services/entity/service-booking.entity';
import { Property } from '../properties/entity/property.entity';
import { TourismService } from '../services/entity/tourism-service.entity';
import { ServiceFeeRule } from '../user/entity/service-fee-rule.entity';
import { RolesModule } from '../user/modules/roles.module';
import { JobsModule } from 'src/infrastructure/jobs/jobs.module';
import { WsModule } from 'src/infrastructure/websocket/ws.module';
import { RbacConfigModule } from '../rbac/rbac-config.module';
import { RbacScopeModule } from 'src/rbac/rbac-scope.module';
import { UserModule } from '../user/modules/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TransferAccount, PaymentReceipt, User,
      PlatformAccount, HostPayout, BookingDispute, HostFeeDebt,
      Booking, ServiceBooking, Property, TourismService,
      ServiceFeeRule,
    ]),
    ScheduleModule.forRoot(),
    JobsModule,
    WsModule,
    RbacConfigModule,
    RbacScopeModule,
    RolesModule,
    UserModule,
  ],
  controllers: [PaymentsController, EscrowController],
  providers: [
    PaymentsService,
    EscrowService,
    PayoutSchedulerService,
    DisputesService,
    PlatformAccountsService,
    HostReactivationService,
  ],
  exports: [PaymentsService, EscrowService, DisputesService],
})
export class PaymentsModule {}
