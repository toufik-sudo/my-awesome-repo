import { Controller, Get, Post, Put, Param, Body, UseGuards, UseInterceptors, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam, ApiResponse } from '@nestjs/swagger';
import { DocumentValidationService } from '../services/document-validation.service';
import { PermissionGuard } from '../../auth/guards/permission.guard';
import { JwtAuthGuard } from '../../auth/jwtAuth.guard';
import { CustomCsrfInterceptor } from '../../services/interceptors/custom.csrf.interceptor';
import { CsrfGenAuth, CsrfCheck } from '@tekuconcept/nestjs-csrf';
import { extractScopeContext } from '../../rbac/scope-context';

@ApiTags('Document Validation')
@ApiBearerAuth()
@Controller('documents')
@UseGuards(JwtAuthGuard)
@UseInterceptors(CustomCsrfInterceptor)
export class DocumentValidationController {
  constructor(private readonly validationService: DocumentValidationService) {}

  @Post(':id/validate')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Submit document for validation' })
  @ApiParam({ name: 'id', description: 'Document UUID' })
  submitForValidation(@Param('id') id: string) {
    return this.validationService.submitDocument(id);
  }

  @Get('pending')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Get pending documents' })
  getPendingDocuments(@Request() req: any) {
    const scopeCtx = extractScopeContext(req);
    return this.validationService.getPendingDocuments();
  }

  @Put(':id/approve')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Approve document' })
  @ApiParam({ name: 'id', description: 'Document UUID' })
  approveDocument(@Param('id') id: string, @Body() body: { note?: string }, @Request() req: any) {
    const scopeCtx = extractScopeContext(req);
    const reviewerId = req.user?.id || req.user?.userId;
    return this.validationService.approveDocument(id, reviewerId, body.note);
  }

  @Put(':id/reject')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Reject document' })
  @ApiParam({ name: 'id', description: 'Document UUID' })
  rejectDocument(@Param('id') id: string, @Body() body: { note?: string }, @Request() req: any) {
    const scopeCtx = extractScopeContext(req);
    const reviewerId = req.user?.id || req.user?.userId;
    return this.validationService.rejectDocument(id, reviewerId, body.note);
  }
}
