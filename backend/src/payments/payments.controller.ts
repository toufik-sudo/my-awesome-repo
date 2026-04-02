import {
  Controller, Get, Post, Put, Delete, Param, Body, Request,
  UseGuards, UseInterceptors, UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiConsumes, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { RequireRole } from '../auth/decorators/require-role.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) { }

  // ─── Transfer Accounts ───────────────────────────────────────────────

  @Public()
  @Get('transfer-accounts')
  @ApiOperation({ summary: 'Get active transfer accounts', description: 'Public — payment methods for guests.' })
  getTransferAccounts() {
    return this.paymentsService.getTransferAccounts();
  }

  @Get('transfer-accounts/all')
  @ApiBearerAuth('JWT-auth')
  @RequireRole('hyper_manager')
  @ApiOperation({ summary: 'Get all transfer accounts', description: 'Including inactive. **Roles**: hyper_manager+' })
  getAllTransferAccounts() {
    return this.paymentsService.getAllTransferAccounts();
  }

  @Post('transfer-accounts')
  @ApiBearerAuth('JWT-auth')
  @RequireRole('hyper_manager')
  @ApiOperation({ summary: 'Create/update transfer account', description: '**Roles**: hyper_manager+' })
  upsertTransferAccount(@Body() body: any) {
    return this.paymentsService.upsertTransferAccount(body);
  }

  @Delete('transfer-accounts/:id')
  @ApiBearerAuth('JWT-auth')
  @RequireRole('hyper_manager')
  @ApiOperation({ summary: 'Delete transfer account', description: '**Roles**: hyper_manager+' })
  @ApiParam({ name: 'id', format: 'uuid' })
  deleteTransferAccount(@Param('id') id: string) {
    return this.paymentsService.deleteTransferAccount(id);
  }

  // ─── Payment Receipts ────────────────────────────────────────────────

  @Post('receipts')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Upload payment receipt', description: 'Guest uploads proof of payment for a booking.' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: {
    file: { type: 'string', format: 'binary' },
    bookingId: { type: 'string', format: 'uuid' },
    amount: { type: 'string', example: '15000' },
    transferAccountId: { type: 'string', format: 'uuid' },
    guestNote: { type: 'string' },
  }}})
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
      limits: { fileSize: 10 * 1024 * 1024 },
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

  @Get('receipts/pending')
  @ApiBearerAuth('JWT-auth')
  @RequireRole('hyper_manager')
  @ApiOperation({ summary: 'Get pending receipts', description: '**Roles**: hyper_manager+' })
  getPendingReceipts() {
    return this.paymentsService.getPendingReceipts();
  }

  @Get('receipts/booking/:bookingId')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get receipts for booking' })
  @ApiParam({ name: 'bookingId', format: 'uuid' })
  getReceiptsByBooking(@Param('bookingId') bookingId: string) {
    return this.paymentsService.getReceiptsByBooking(bookingId);
  }

  @Put('receipts/:id/approve')
  @ApiBearerAuth('JWT-auth')
  @RequireRole('hyper_manager')
  @ApiOperation({ summary: 'Approve a receipt', description: '**Roles**: hyper_manager+' })
  @ApiParam({ name: 'id', format: 'uuid' })
  approveReceipt(
    @Param('id') id: string,
    @Body('note') note: string,
    @Request() req: any,
  ) {
    return this.paymentsService.approveReceipt(id, req.user.id, note);
  }

  @Put('receipts/:id/reject')
  @ApiBearerAuth('JWT-auth')
  @RequireRole('hyper_manager')
  @ApiOperation({ summary: 'Reject a receipt', description: '**Roles**: hyper_manager+' })
  @ApiParam({ name: 'id', format: 'uuid' })
  rejectReceipt(
    @Param('id') id: string,
    @Body('note') note: string,
    @Request() req: any,
  ) {
    return this.paymentsService.rejectReceipt(id, req.user.id, note);
  }
}
