import { Controller, Get, Post, Put, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam, ApiResponse } from '@nestjs/swagger';
import { DocumentValidationService } from '../services/document-validation.service';
import { RequireRole } from '../../auth/decorators';
import { PermissionGuard } from '../../auth/guards/permission.guard';

@ApiTags('Document Validation')
@ApiBearerAuth()
@Controller('documents')
@UseGuards(PermissionGuard)
export class DocumentValidationController {
  constructor(private readonly validationService: DocumentValidationService) {}

  /**
   * Submit a document for AI validation.
   * Called after upload — triggers AI analysis and auto-approve or escalate.
   */
  @Post(':id/validate')
  @RequireRole('admin', 'manager', 'hyper_admin', 'hyper_manager')
  @ApiOperation({ summary: 'Submit document for validation', description: 'Admin submits own docs; hyper reviews all.' })
  @ApiParam({ name: 'id', description: 'Document UUID' })
  submitForValidation(@Param('id') id: string) {
    return this.validationService.submitDocument(id);
  }

  /**
   * Get all pending documents for review.
   * hyper_admin and hyper_manager see all; admin sees own.
   */
  @Get('pending')
  @RequireRole('hyper_admin', 'hyper_manager', 'admin')
  @ApiOperation({ summary: 'Get pending documents', description: 'Hyper sees all; admin sees own pending docs.' })
  @ApiResponse({ status: 200, description: 'Array of pending documents' })
  getPendingDocuments(@Request() req: any) {
    return this.validationService.getPendingDocuments();
  }

  /**
   * Approve a document — hyper roles only.
   */
  @Put(':id/approve')
  @RequireRole('hyper_admin', 'hyper_manager')
  @ApiOperation({ summary: 'Approve document', description: 'Only hyper_admin and hyper_manager can approve.' })
  @ApiParam({ name: 'id', description: 'Document UUID' })
  approveDocument(
    @Param('id') id: string,
    @Body() body: { note?: string },
    @Request() req: any,
  ) {
    const reviewerId = req.user?.id || req.user?.userId;
    return this.validationService.approveDocument(id, reviewerId, body.note);
  }

  /**
   * Reject a document — hyper roles only.
   */
  @Put(':id/reject')
  @RequireRole('hyper_admin', 'hyper_manager')
  @ApiOperation({ summary: 'Reject document', description: 'Only hyper_admin and hyper_manager can reject.' })
  @ApiParam({ name: 'id', description: 'Document UUID' })
  rejectDocument(
    @Param('id') id: string,
    @Body() body: { note?: string },
    @Request() req: any,
  ) {
    const reviewerId = req.user?.id || req.user?.userId;
    return this.validationService.rejectDocument(id, reviewerId, body.note);
  }
}
