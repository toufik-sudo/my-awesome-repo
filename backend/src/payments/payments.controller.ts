import { Controller, Get, Post, Put, Delete, Param, Body, Request, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaymentsService } from './payments.service';
import { Public } from '../auth/decorators/public.decorator';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { JwtAuthGuard } from '../auth/jwtAuth.guard';
import { CustomCsrfInterceptor } from '../services/interceptors/custom.csrf.interceptor';
import { CsrfGenAuth, CsrfCheck } from '@tekuconcept/nestjs-csrf';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { extractScopeContext } from '../rbac/scope-context';

@ApiTags('Payments')
@ApiBearerAuth('JWT-auth')
@Controller('payments')
@UseGuards(JwtAuthGuard)
@UseInterceptors(CustomCsrfInterceptor)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Public()
  @Get('transfer-accounts')
  @ApiOperation({ summary: 'Get active transfer accounts (public)' })
  getTransferAccounts() { return this.paymentsService.getTransferAccounts(); }

  @Get('transfer-accounts/all')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Get all transfer accounts (hyper only)' })
  getAllTransferAccounts(@Request() req: any) {
    const scopeCtx = extractScopeContext(req);
    return this.paymentsService.getAllTransferAccounts(scopeCtx);
  }

  @Post('transfer-accounts')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Create/update transfer account (hyper only)' })
  upsertTransferAccount(@Request() req: any, @Body() body: any) {
    const scopeCtx = extractScopeContext(req);
    return this.paymentsService.upsertTransferAccount(body, scopeCtx);
  }

  @Delete('transfer-accounts/:id')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Delete transfer account (hyper only)' })
  deleteTransferAccount(@Request() req: any, @Param('id') id: string) {
    const scopeCtx = extractScopeContext(req);
    return this.paymentsService.deleteTransferAccount(id, scopeCtx);
  }

  @Post('receipts')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Upload payment receipt' })
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/receipts',
      filename: (req, file, cb) => { cb(null, `receipt-${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`); },
    }),
    fileFilter: (req, file, cb) => { cb(file.originalname.match(/\.(jpg|jpeg|png|gif|pdf|webp)$/i) ? null : new Error('Only image and PDF files are allowed'), !!file.originalname.match(/\.(jpg|jpeg|png|gif|pdf|webp)$/i)); },
    limits: { fileSize: 10 * 1024 * 1024 },
  }))
  async uploadReceipt(@UploadedFile() file: Express.Multer.File, @Body('bookingId') bookingId: string, @Body('amount') amount: string, @Body('transferAccountId') transferAccountId: string, @Body('guestNote') guestNote: string, @Request() req: any) {
    const scopeCtx = extractScopeContext(req);
    return this.paymentsService.uploadReceipt({ bookingId, uploadedByUserId: req.user.id, receiptUrl: `/uploads/receipts/${file.filename}`, originalFileName: file.originalname, amount: parseFloat(amount) || 0, transferAccountId: transferAccountId || undefined, guestNote: guestNote || undefined }, scopeCtx);
  }

  @Get('receipts/pending')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Get pending receipts (hyper only)' })
  getPendingReceipts(@Request() req: any) {
    const scopeCtx = extractScopeContext(req);
    return this.paymentsService.getPendingReceipts(scopeCtx);
  }

  @Get('receipts/booking/:bookingId')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Get receipts for a booking' })
  getReceiptsByBooking(@Request() req: any, @Param('bookingId') bookingId: string) {
    const scopeCtx = extractScopeContext(req);
    return this.paymentsService.getReceiptsByBooking(bookingId, scopeCtx);
  }

  @Put('receipts/:id/approve')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Approve receipt (hyper only)' })
  approveReceipt(@Param('id') id: string, @Body('note') note: string, @Request() req: any) {
    const scopeCtx = extractScopeContext(req);
    return this.paymentsService.approveReceipt(id, req.user.id, note, scopeCtx);
  }

  @Put('receipts/:id/reject')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Reject receipt (hyper only)' })
  rejectReceipt(@Param('id') id: string, @Body('note') note: string, @Request() req: any) {
    const scopeCtx = extractScopeContext(req);
    return this.paymentsService.rejectReceipt(id, req.user.id, note, scopeCtx);
  }
}
