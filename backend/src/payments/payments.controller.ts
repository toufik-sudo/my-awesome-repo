import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Request,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaymentsService } from './payments.service';
import { RequireRole } from '../auth/decorators/require-role.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('Payments')
@ApiBearerAuth('JWT-auth')
@Controller('payments')
@UseGuards(PermissionGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) { }

  // ─── Transfer Accounts ───────────────────────────────────────────────

  /** Public: get active transfer accounts (for guest payment flow) */
  @Public()
  @Get('transfer-accounts')
  @ApiOperation({ summary: 'Get active transfer accounts (public)' })
  getTransferAccounts() {
    return this.paymentsService.getTransferAccounts();
  }

  /** Hyper admin: get all transfer accounts including inactive */
  @Get('transfer-accounts/all')
  @RequireRole('hyper_admin' as any, 'hyper_manager' as any)
  @ApiOperation({ summary: 'Get all transfer accounts (hyper only)' })
  getAllTransferAccounts() {
    return this.paymentsService.getAllTransferAccounts();
  }

  /** Hyper admin: create or update a transfer account */
  @Post('transfer-accounts')
  @RequireRole('hyper_admin' as any, 'hyper_manager' as any)
  @ApiOperation({ summary: 'Create/update transfer account (hyper only)' })
  upsertTransferAccount(@Body() body: any) {
    return this.paymentsService.upsertTransferAccount(body);
  }

  /** Hyper admin: delete a transfer account */
  @Delete('transfer-accounts/:id')
  @RequireRole('hyper_admin' as any, 'hyper_manager' as any)
  @ApiOperation({ summary: 'Delete transfer account (hyper only)' })
  deleteTransferAccount(@Param('id') id: string) {
    return this.paymentsService.deleteTransferAccount(id);
  }

  // ─── Payment Receipts ────────────────────────────────────────────────

  /** Guest: upload a receipt for a booking */
  @Post('receipts')
  @ApiOperation({ summary: 'Upload payment receipt' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/receipts',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `receipt-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|pdf|webp)$/i)) {
          return cb(new Error('Only image and PDF files are allowed'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    }),
  )
  async uploadReceipt(
    @UploadedFile() file: Express.Multer.File,
    @Body('bookingId') bookingId: string,
    @Body('amount') amount: string,
    @Body('transferAccountId') transferAccountId: string,
    @Body('guestNote') guestNote: string,
    @Request() req: any,
  ) {
    return this.paymentsService.uploadReceipt({
      bookingId,
      uploadedByUserId: req.user.id,
      receiptUrl: `/uploads/receipts/${file.filename}`,
      originalFileName: file.originalname,
      amount: parseFloat(amount) || 0,
      transferAccountId: transferAccountId || undefined,
      guestNote: guestNote || undefined,
    });
  }

  /** Hyper admin: get all pending receipts */
  @Get('receipts/pending')
  @RequireRole('hyper_admin' as any, 'hyper_manager' as any)
  @ApiOperation({ summary: 'Get pending receipts (hyper only)' })
  getPendingReceipts() {
    return this.paymentsService.getPendingReceipts();
  }

  /** Get receipts for a specific booking */
  @Get('receipts/booking/:bookingId')
  @ApiOperation({ summary: 'Get receipts for a booking' })
  getReceiptsByBooking(@Param('bookingId') bookingId: string) {
    return this.paymentsService.getReceiptsByBooking(bookingId);
  }

  /** Hyper admin: approve a receipt */
  @Put('receipts/:id/approve')
  @RequireRole('hyper_admin' as any, 'hyper_manager' as any)
  @ApiOperation({ summary: 'Approve receipt (hyper only)' })
  approveReceipt(
    @Param('id') id: string,
    @Body('note') note: string,
    @Request() req: any,
  ) {
    return this.paymentsService.approveReceipt(id, req.user.id, note);
  }

  /** Hyper admin: reject a receipt */
  @Put('receipts/:id/reject')
  @RequireRole('hyper_admin' as any, 'hyper_manager' as any)
  @ApiOperation({ summary: 'Reject receipt (hyper only)' })
  rejectReceipt(
    @Param('id') id: string,
    @Body('note') note: string,
    @Request() req: any,
  ) {
    return this.paymentsService.rejectReceipt(id, req.user.id, note);
  }
}
