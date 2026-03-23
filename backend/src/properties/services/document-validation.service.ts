import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { VerificationDocument, DocumentStatus } from '../entity/verification-document.entity';
import { PropertiesService } from './properties.service';
import { NotificationService } from '../../notification/services/notification.service';

export interface AIValidationResult {
  isValid: boolean;
  confidence: number;       // 0-1
  reason: string;
  documentType: string;
  detectedIssues: string[];
}

@Injectable()
export class DocumentValidationService {
  private readonly logger = new Logger(DocumentValidationService.name);

  constructor(
    @InjectRepository(VerificationDocument)
    private readonly docRepo: Repository<VerificationDocument>,
    private readonly propertiesService: PropertiesService,
    private readonly notificationService: NotificationService,
    private readonly configService: ConfigService,
  ) {}

  /** Whether AI auto-validation is enabled globally */
  private get aiAutoValidationEnabled(): boolean {
    return this.configService.get<string>('DOC_AI_AUTO_VALIDATION', 'false') === 'true';
  }

  /** Minimum AI confidence (0-1) to auto-approve without admin review */
  private get aiConfidenceThreshold(): number {
    return parseFloat(this.configService.get<string>('DOC_AI_CONFIDENCE_THRESHOLD', '0.85'));
  }

  /** AI/RAG API endpoint for document validation */
  private get aiApiUrl(): string {
    return this.configService.get<string>('DOC_AI_API_URL', '');
  }

  /** AI API key */
  private get aiApiKey(): string {
    return this.configService.get<string>('DOC_AI_API_KEY', '');
  }

  // ─── Submit a document for validation ──────────────────────────────

  async submitDocument(docId: string): Promise<{
    document: VerificationDocument;
    aiResult?: AIValidationResult;
    autoApproved: boolean;
  }> {
    const doc = await this.docRepo.findOne({ where: { id: docId }, relations: ['property'] });
    if (!doc) throw new NotFoundException('Document not found');
    if (doc.status !== 'pending') throw new BadRequestException('Document already reviewed');

    let aiResult: AIValidationResult | undefined;
    let autoApproved = false;

    // Step 1: Run AI validation if configured
    if (this.aiApiUrl) {
      try {
        aiResult = await this.callAIValidation(doc);
        this.logger.log(
          `AI validation for doc=${docId}: valid=${aiResult.isValid}, confidence=${aiResult.confidence}`,
        );

        // Save AI analysis results to document
        await this.docRepo.update(docId, {
          aiAnalyzed: true,
          aiValidationResult: aiResult.isValid,
          aiConfidence: aiResult.confidence,
          aiReason: aiResult.reason,
          aiDetectedIssues: aiResult.detectedIssues,
          aiAnalyzedAt: new Date(),
        });
      } catch (err: any) {
        this.logger.error(`AI validation failed for doc=${docId}: ${err.message}`);
        // Mark as analyzed but failed
        await this.docRepo.update(docId, {
          aiAnalyzed: true,
          aiReason: `AI analysis failed: ${err.message}`,
          aiAnalyzedAt: new Date(),
        });
      }
    }

    // Step 2: Decide auto-approve vs. manual review
    if (aiResult && this.aiAutoValidationEnabled) {
      if (aiResult.isValid && aiResult.confidence >= this.aiConfidenceThreshold) {
        // AUTO-APPROVE: AI is confident
        await this.approveDocument(docId, null, `Auto-approved by AI (confidence: ${(aiResult.confidence * 100).toFixed(1)}%)`);
        autoApproved = true;

        // Notify hyper admins about auto-approval (informational)
        await this.notificationService.notifyHyperAdmins(
          'doc_ai_approved',
          '✅ Document auto-approved by AI',
          `Document "${doc.fileName}" (${doc.type}) for property ${doc.propertyId} was auto-approved by AI with ${(aiResult.confidence * 100).toFixed(1)}% confidence.`,
          { docId, propertyId: doc.propertyId, confidence: aiResult.confidence },
        );
      } else if (!aiResult.isValid && aiResult.confidence >= this.aiConfidenceThreshold) {
        // AUTO-REJECT: AI is confident it's invalid
        await this.rejectDocument(docId, null, `Auto-rejected by AI: ${aiResult.reason}`);
        autoApproved = true; // "auto-handled"

        await this.notificationService.notifyHyperAdmins(
          'doc_ai_rejected',
          '❌ Document auto-rejected by AI',
          `Document "${doc.fileName}" (${doc.type}) for property ${doc.propertyId} was auto-rejected. Reason: ${aiResult.reason}. Issues: ${aiResult.detectedIssues.join(', ')}`,
          { docId, propertyId: doc.propertyId, confidence: aiResult.confidence, issues: aiResult.detectedIssues },
        );
      } else {
        // LOW CONFIDENCE: Escalate to hyper admin
        await this.escalateToAdmin(doc, aiResult);
      }
    } else {
      // No AI auto-validation: escalate everything to hyper admin
      await this.escalateToAdmin(doc, aiResult);
    }

    const updatedDoc = await this.docRepo.findOne({ where: { id: docId } });
    return { document: updatedDoc, aiResult, autoApproved };
  }

  // ─── Manual approval by hyper admin ────────────────────────────────

  async approveDocument(docId: string, reviewerId: number | null, note?: string) {
    const doc = await this.docRepo.findOne({ where: { id: docId } });
    if (!doc) throw new NotFoundException('Document not found');

    await this.docRepo.update(docId, {
      status: 'approved' as DocumentStatus,
      reviewedBy: reviewerId,
      reviewedAt: new Date(),
      reviewNote: note || 'Approved by admin',
    });

    // Recalculate trust stars
    await this.propertiesService.recalculateTrustStars(doc.propertyId);

    this.logger.log(`Document ${docId} approved by ${reviewerId || 'AI'}`);
    return this.docRepo.findOne({ where: { id: docId } });
  }

  async rejectDocument(docId: string, reviewerId: number | null, note?: string) {
    const doc = await this.docRepo.findOne({ where: { id: docId } });
    if (!doc) throw new NotFoundException('Document not found');

    await this.docRepo.update(docId, {
      status: 'rejected' as DocumentStatus,
      reviewedBy: reviewerId,
      reviewedAt: new Date(),
      reviewNote: note || 'Rejected by admin',
    });

    // Recalculate trust stars
    await this.propertiesService.recalculateTrustStars(doc.propertyId);

    this.logger.log(`Document ${docId} rejected by ${reviewerId || 'AI'}`);
    return this.docRepo.findOne({ where: { id: docId } });
  }

  // ─── Get pending documents for admin review ────────────────────────

  async getPendingDocuments() {
    return this.docRepo.find({
      where: { status: 'pending' as DocumentStatus },
      relations: ['property'],
      order: { createdAt: 'ASC' },
    });
  }

  // ─── Private helpers ───────────────────────────────────────────────

  private async escalateToAdmin(doc: VerificationDocument, aiResult?: AIValidationResult) {
    const aiInfo = aiResult
      ? ` AI analysis: ${aiResult.isValid ? 'likely valid' : 'likely invalid'} (confidence: ${(aiResult.confidence * 100).toFixed(1)}%). ${aiResult.reason}`
      : ' No AI analysis available.';

    await this.notificationService.notifyHyperAdmins(
      'doc_pending_review',
      '📋 Document requires manual review',
      `Document "${doc.fileName}" (${doc.type}) for property ${doc.propertyId} needs your review.${aiInfo}`,
      {
        docId: doc.id,
        propertyId: doc.propertyId,
        documentType: doc.type,
        aiResult: aiResult || null,
      },
    );
  }

  /** Call AI/RAG API to validate a document */
  private async callAIValidation(doc: VerificationDocument): Promise<AIValidationResult> {
    if (!this.aiApiUrl || !this.aiApiKey) {
      throw new Error('AI validation API not configured');
    }

    const response = await fetch(this.aiApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.aiApiKey}`,
      },
      body: JSON.stringify({
        documentId: doc.id,
        documentType: doc.type,
        fileUrl: doc.fileUrl,
        fileName: doc.fileName,
        propertyId: doc.propertyId,
        validationRules: this.getValidationRules(doc.type),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`AI API returned ${response.status}: ${errorText}`);
    }

    const result = await response.json();

    return {
      isValid: result.isValid ?? false,
      confidence: result.confidence ?? 0,
      reason: result.reason ?? 'No reason provided',
      documentType: result.documentType ?? doc.type,
      detectedIssues: result.detectedIssues ?? [],
    };
  }

  /** Validation rules per document type sent to AI */
  private getValidationRules(type: string): Record<string, any> {
    const rules: Record<string, Record<string, any>> = {
      national_id: {
        checks: ['is_readable', 'matches_document_type', 'not_expired', 'has_photo', 'has_name'],
        description: 'Algerian national identity card (carte nationale)',
      },
      passport: {
        checks: ['is_readable', 'matches_document_type', 'not_expired', 'has_photo', 'has_mrz'],
        description: 'Valid passport document',
      },
      permit: {
        checks: ['is_readable', 'matches_document_type', 'not_expired'],
        description: 'Residence or business permit',
      },
      notarized_deed: {
        checks: ['is_readable', 'matches_document_type', 'has_notary_stamp', 'has_property_address'],
        description: 'Notarized property deed (acte notarié)',
      },
      land_registry: {
        checks: ['is_readable', 'matches_document_type', 'has_property_reference'],
        description: 'Land registry extract (extrait du cadastre)',
      },
      utility_bill: {
        checks: ['is_readable', 'matches_document_type', 'recent_date', 'has_address'],
        description: 'Recent utility bill (electricity, gas, water) less than 3 months old',
      },
      management_declaration: {
        checks: ['is_readable', 'has_signature', 'has_property_details'],
        description: 'Declaration of property management responsibility',
      },
    };
    return rules[type] || { checks: ['is_readable'], description: 'Generic document' };
  }
}
