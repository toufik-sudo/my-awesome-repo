import { Controller, Get, Post, Put, Delete, Param, Body, Query, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwtAuth.guard';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { CustomCsrfInterceptor } from '../services/interceptors/custom.csrf.interceptor';
import { CsrfGenAuth, CsrfCheck } from '@tekuconcept/nestjs-csrf';
import { Public } from '../auth/decorators/public.decorator';
import { extractScopeContext } from '../rbac/scope-context';
import { PlatformAccountsService } from './services/platform-accounts.service';
import { DisputesService } from './services/disputes.service';
import { HostReactivationService, ReactivationMethod } from './services/host-reactivation.service';
import { ScopeFilterService } from '../rbac/services/scope-filter.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HostPayout } from './entity/host-payout.entity';

const PERM_KEY_LIST_PAYOUTS = 'backend.EscrowController.listPayouts.GET';

@ApiTags('Escrow & Disputes')
@ApiBearerAuth('JWT-auth')
@Controller('escrow')
@UseGuards(JwtAuthGuard)
@UseInterceptors(CustomCsrfInterceptor)
export class EscrowController {
  constructor(
    private readonly platformAccounts: PlatformAccountsService,
    private readonly disputes: DisputesService,
    private readonly reactivation: HostReactivationService,
    private readonly scopeFilter: ScopeFilterService,
    @InjectRepository(HostPayout) private readonly payoutRepo: Repository<HostPayout>,
  ) {}

  // ── Platform accounts ─────────────────────────────────────────────────

  @Public()
  @Get('platform-accounts')
  @ApiOperation({ summary: 'List platform escrow accounts shown to guests' })
  listForGuests() { return this.platformAccounts.listForGuests(); }

  @Get('platform-accounts/reactivation')
  @ApiOperation({ summary: 'List accounts available for reactivation payment' })
  listForReactivation() { return this.platformAccounts.listForReactivation(); }

  @Get('platform-accounts/all')
  @UseGuards(PermissionGuard) @CsrfGenAuth() @CsrfCheck(true)
  @ApiOperation({ summary: 'List all platform accounts (hyper only)' })
  listAll(@Request() req: any) {
    return this.platformAccounts.listAll(extractScopeContext(req));
  }

  @Post('platform-accounts')
  @UseGuards(PermissionGuard) @CsrfGenAuth() @CsrfCheck(true)
  upsertPlatformAccount(@Request() req: any, @Body() body: any) {
    return this.platformAccounts.upsert(body, extractScopeContext(req));
  }

  @Delete('platform-accounts/:id')
  @UseGuards(PermissionGuard) @CsrfGenAuth() @CsrfCheck(true)
  removePlatformAccount(@Request() req: any, @Param('id') id: string) {
    return this.platformAccounts.remove(id, extractScopeContext(req));
  }

  // ── Payouts (read-only inspection) ────────────────────────────────────

  @Get('payouts')
  @UseGuards(PermissionGuard) @CsrfGenAuth() @CsrfCheck(true)
  @ApiOperation({ summary: 'List host payouts (scoped by role)' })
  async listPayouts(@Request() req: any, @Query('status') status?: string) {
    const ctx = extractScopeContext(req);
    const qb = this.payoutRepo.createQueryBuilder('p')
      .leftJoinAndSelect('p.host', 'host')
      .leftJoinAndSelect('p.booking', 'booking')
      .leftJoinAndSelect('booking.property', 'property')
      .leftJoinAndSelect('p.serviceBooking', 'sb')
      .leftJoinAndSelect('sb.service', 'service')
      .orderBy('p.createdAt', 'DESC')
      .limit(200);
    if (status) qb.andWhere('p.status = :status', { status });
    if (ctx.userRole === 'hyper_admin') {
      // global access — no filter
    } else if (ctx.userRole === 'admin') {
      qb.andWhere('p.hostUserId = :uid', { uid: ctx.userId });
    } else if (ctx.userRole === 'hyper_manager') {
      const [propertyIds, serviceIds] = await Promise.all([
        this.scopeFilter.effectivePropertyIds(ctx, PERM_KEY_LIST_PAYOUTS),
        this.scopeFilter.effectiveServiceIds(ctx, PERM_KEY_LIST_PAYOUTS),
      ]);
      if (propertyIds !== null && propertyIds.length === 0 && serviceIds !== null && serviceIds.length === 0) return [];
      if (propertyIds !== null && serviceIds !== null && propertyIds.length > 0 && serviceIds.length > 0) {
        qb.andWhere('(booking.propertyId IN (:...propertyIds) OR sb.serviceId IN (:...serviceIds))', { propertyIds, serviceIds });
      } else if (propertyIds !== null && propertyIds.length > 0) {
        qb.andWhere('booking.propertyId IN (:...propertyIds)', { propertyIds });
      } else if (serviceIds !== null && serviceIds.length > 0) {
        qb.andWhere('sb.serviceId IN (:...serviceIds)', { serviceIds });
      } else if (propertyIds !== null || serviceIds !== null) {
        return [];
      }
    } else {
      qb.andWhere('p.hostUserId = :uid', { uid: ctx.userId });
    }
    return qb.getMany();
  }

  // ── Disputes ──────────────────────────────────────────────────────────

  @Post('disputes')
  @UseGuards(PermissionGuard) @CsrfGenAuth() @CsrfCheck(true)
  @ApiOperation({ summary: 'Open a dispute on a booking or service booking' })
  openDispute(@Request() req: any, @Body() body: any) {
    return this.disputes.openDispute({
      bookingId: body.bookingId,
      serviceBookingId: body.serviceBookingId,
      guestUserId: req.user.id,
      subject: body.subject,
      description: body.description,
      severity: body.severity,
      attachments: body.attachments,
    });
  }

  @Get('disputes')
  @UseGuards(PermissionGuard) @CsrfGenAuth() @CsrfCheck(true)
  listDisputes(@Request() req: any, @Query('status') status?: string) {
    return this.disputes.listDisputes(extractScopeContext(req), status);
  }

  @Get('disputes/:id/refund-status')
  @UseGuards(PermissionGuard) @CsrfGenAuth() @CsrfCheck(true)
  @ApiOperation({ summary: 'Get the refund/payout state attached to a dispute (guest view)' })
  async getDisputeRefundStatus(@Request() req: any, @Param('id') id: string) {
    const ctx = extractScopeContext(req);
    const list = await this.disputes.listDisputes(ctx);
    const dispute = list.find((d) => d.id === id);
    if (!dispute) return { found: false };
    const payout = await this.payoutRepo.findOne({
      where: dispute.bookingId
        ? { bookingId: dispute.bookingId }
        : { serviceBookingId: dispute.serviceBookingId },
    });
    // Map dispute → user-facing refund stage
    let refundStage: 'pending' | 'validated' | 'refunded' | 'partial' | 'rejected' = 'pending';
    if (dispute.status === 'open' || dispute.status === 'under_review') refundStage = 'pending';
    else if (dispute.resolution === 'refund_full') refundStage = payout?.status === 'forfeited' ? 'refunded' : 'validated';
    else if (dispute.resolution === 'refund_partial') refundStage = 'partial';
    else if (dispute.resolution === 'release_to_host' || dispute.status === 'dismissed') refundStage = 'rejected';
    return {
      found: true,
      dispute,
      payout,
      refundStage,
      refundAmount: dispute.refundAmount || 0,
    };
  }

  @Put('disputes/:id/resolve')
  @UseGuards(PermissionGuard) @CsrfGenAuth() @CsrfCheck(true)
  @ApiOperation({ summary: 'Resolve a dispute (hyper_admin / hyper_manager)' })
  resolveDispute(@Request() req: any, @Param('id') id: string, @Body() body: any) {
    return this.disputes.resolveDispute(
      id, req.user.id, body.resolution, body.refundAmount || 0, body.note, extractScopeContext(req),
    );
  }

  // ── Host reactivation ─────────────────────────────────────────────────

  @Get('reactivation/quote')
  @UseGuards(PermissionGuard) @CsrfGenAuth() @CsrfCheck(true)
  @ApiOperation({ summary: 'Get reactivation quote (debts + penalty) for current host' })
  getMyQuote(@Request() req: any) {
    return this.reactivation.getQuote(req.user.id);
  }

  @Get('reactivation/quote/:hostId')
  @UseGuards(PermissionGuard) @CsrfGenAuth() @CsrfCheck(true)
  @ApiOperation({ summary: 'Get reactivation quote for any host (hyper only)' })
  getQuoteForHost(@Request() req: any, @Param('hostId') hostId: string) {
    const ctx = extractScopeContext(req);
    if (!['hyper_admin', 'hyper_manager'].includes(ctx.userRole)) {
      throw new Error('Forbidden');
    }
    return this.reactivation.getQuote(Number(hostId));
  }

  @Post('reactivation/confirm')
  @UseGuards(PermissionGuard) @CsrfGenAuth() @CsrfCheck(true)
  @ApiOperation({ summary: 'Hyper-admin confirms a reactivation payment (transfer or stripe)' })
  confirmReactivation(@Request() req: any, @Body() body: {
    hostUserId: number;
    method: ReactivationMethod;
    reference: string;
    amountPaid: number;
  }) {
    const ctx = extractScopeContext(req);
    return this.reactivation.confirmReactivation({
      ...body,
      confirmedByUserId: req.user.id,
      confirmedByRole: ctx.userRole,
    });
  }
}
