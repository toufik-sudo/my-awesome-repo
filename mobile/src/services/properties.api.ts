import { api } from '@/lib/axios';
import { PROPERTIES_API, DOCUMENTS_API } from '@/constants/api.constants';
import type {
  Property,
  PropertyFilters,
  PaginatedResponse,
  VerificationDocument,
  DocumentValidationResponse,
  TrustRecalculationResponse,
} from '@/types/property.types';

// ─── Properties ─────────────────────────────────────────────────────────────

export const propertiesApi = {
  async getAll(filters: PropertyFilters = {}): Promise<PaginatedResponse<Property>> {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
      const response = await api.get<PaginatedResponse<Property>>(
        `${PROPERTIES_API.LIST}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch properties:', error);
      throw error;
    }
  },

  async getById(id: string): Promise<Property> {
    try {
      const response = await api.get<Property>(PROPERTIES_API.DETAIL(id));
      return response.data;
    } catch (error) {
      console.error('Failed to fetch property:', error);
      throw error;
    }
  },

  async create(data: Partial<Property>): Promise<Property> {
    const response = await api.post<Property>(PROPERTIES_API.CREATE, data);
    return response.data;
  },

  async update(id: string, data: Partial<Property>): Promise<Property> {
    const response = await api.put<Property>(PROPERTIES_API.UPDATE(id), data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(PROPERTIES_API.DELETE(id));
  },

  async recalculateTrust(id: string): Promise<TrustRecalculationResponse> {
    const response = await api.put<TrustRecalculationResponse>(PROPERTIES_API.RECALCULATE_TRUST(id));
    return response.data;
  },

  async getDocuments(propertyId: string): Promise<VerificationDocument[]> {
    const response = await api.get<VerificationDocument[]>(PROPERTIES_API.DOCUMENTS(propertyId));
    return response.data;
  },
};

// ─── Document Verification ──────────────────────────────────────────────────

export const documentsApi = {
  async getPending(): Promise<VerificationDocument[]> {
    try {
      const response = await api.get<VerificationDocument[]>(DOCUMENTS_API.PENDING);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch pending documents:', error);
      return [];
    }
  },

  async submitForValidation(docId: string): Promise<DocumentValidationResponse> {
    const response = await api.post<DocumentValidationResponse>(DOCUMENTS_API.VALIDATE(docId));
    return response.data;
  },

  async approve(docId: string, note?: string): Promise<VerificationDocument> {
    const response = await api.put<VerificationDocument>(DOCUMENTS_API.APPROVE(docId), { note });
    return response.data;
  },

  async reject(docId: string, note?: string): Promise<VerificationDocument> {
    const response = await api.put<VerificationDocument>(DOCUMENTS_API.REJECT(docId), { note });
    return response.data;
  },

  async upload(propertyId: string, type: string, fileUri: string, fileName: string): Promise<VerificationDocument> {
    const formData = new FormData();
    formData.append('file', {
      uri: fileUri,
      name: fileName,
      type: 'application/octet-stream',
    } as any);
    formData.append('type', type);
    formData.append('propertyId', propertyId);

    const response = await api.post<VerificationDocument>(DOCUMENTS_API.UPLOAD, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};
