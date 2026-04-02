import { Controller, Get, Post, Put, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { DocumentValidationService } from '../services/document-validation.service';
import { RequireRole } from '../../auth/decorators';
import { PermissionGuard } from '../../auth/guards/permission.guard';

@ApiTags('Documents')
@ApiBearerAuth('JWT-auth')
@Controller('documents')
@UseGuards(PermissionGuard)
export class DocumentValidationController {
  constructor(private readonly validationService: DocumentValidationService) {}

  @Post(':id/validate')
  @ApiOperation({ summary: 'Submit document for validation', description: 'Triggers AI analysis → auto-approve or escalate.' })
  @ApiParam({ name: 'id', format: 'uuid' })
  submitForValidation(@Param('id') id: string) {
    return this.validationService.submitDocument(id);
  }

  @Get('pending')
  @RequireRole('hyper_manager')
  @ApiOperation({ summary: 'Get pending documents', description: '**Roles**: hyper_manager+' })
  getPendingDocuments() {
    return this.validationService.getPendingDocuments();
  }

  @Put(':id/approve')
  @RequireRole('hyper_manager')
  @ApiOperation({ summary: 'Approve a document', description: '**Roles**: hyper_manager+' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBody({ schema: { type: 'object', properties: { note: { type: 'string' } } }, required: false })
  approveDocument(@Param('id') id: string, @Body() body: { note?: string }, @Request() req: any) {
    return this.validationService.approveDocument(id, req.user?.id || req.user?.userId, body.note);
  }

  @Put(':id/reject')
  @RequireRole('hyper_manager')
  @ApiOperation({ summary: 'Reject a document', description: '**Roles**: hyper_manager+' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBody({ schema: { type: 'object', properties: { note: { type: 'string' } } }, required: false })
  rejectDocument(@Param('id') id: string, @Body() body: { note?: string }, @Request() req: any) {
    return this.validationService.rejectDocument(id, req.user?.id || req.user?.userId, body.note);
  }
}
