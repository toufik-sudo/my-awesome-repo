import { Controller, Get, Post, Put, Param, Body, UseGuards, Request } from '@nestjs/common';
import { DocumentValidationService } from '../services/document-validation.service';
import { RequireRole } from '../../auth/decorators';
import { PermissionGuard } from '../../auth/guards/permission.guard';

@Controller('documents')
@UseGuards(PermissionGuard)
export class DocumentValidationController {
  constructor(private readonly validationService: DocumentValidationService) {}

  /**
   * Submit a document for AI validation
   * Called after upload - triggers AI analysis and auto-approve or escalate
   */
  @Post(':id/validate')
  submitForValidation(@Param('id') id: string) {
    return this.validationService.submitDocument(id);
  }

  /**
   * Get all pending documents for hyper admin review
   */
  @Get('pending')
  @RequireRole('hyper_manager')
  getPendingDocuments() {
    return this.validationService.getPendingDocuments();
  }

  /**
   * Hyper admin approves a document
   */
  @Put(':id/approve')
  @RequireRole('hyper_manager')
  approveDocument(
    @Param('id') id: string,
    @Body() body: { note?: string },
    @Request() req: any,
  ) {
    const reviewerId = req.user?.id || req.user?.userId;
    return this.validationService.approveDocument(id, reviewerId, body.note);
  }

  /**
   * Hyper admin rejects a document
   */
  @Put(':id/reject')
  @RequireRole('hyper_manager')
  rejectDocument(
    @Param('id') id: string,
    @Body() body: { note?: string },
    @Request() req: any,
  ) {
    const reviewerId = req.user?.id || req.user?.userId;
    return this.validationService.rejectDocument(id, reviewerId, body.note);
  }
}
