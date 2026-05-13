import { api } from '@/lib/axios';
import { rbac } from '@/lib/api-rbac';

export interface PlatformAccount {
  id: string;
  accountType: 'ccp' | 'bna' | 'badr' | 'cib' | 'baridi_mob' | 'bank_transfer' | 'stripe' | 'other';
  bankName: string;
  accountNumber: string;
  accountKey?: string;
  holderName: string;
  agencyName?: string;
  rib?: string;
  currency: string;
  instructions?: string;
  isActive: boolean;
  acceptsGuestPayments: boolean;
  acceptsReactivationPayments: boolean;
  sortOrder: number;
}

export interface HostPayout {
  id: string;
  bookingId?: string;
  serviceBookingId?: string;
  receiptId?: string;
  hostUserId: number;
  grossAmount: number;
  platformFee: number;
  guestServiceFee: number;
  netAmount: number;
  releasedAmount: number;
  currency: string;
  releaseAt: string;
  status: 'scheduled' | 'on_hold' | 'released' | 'forfeited' | 'partially_released';
  releasedAt?: string;
  externalTransferRef?: string;
  notes?: string;
  createdAt: string;
  host?: { id: number; email: string; firstName?: string; lastName?: string };
  booking?: { id: string; property?: { title: string } };
  serviceBooking?: { id: string; service?: { title: any } };
}

export interface BookingDispute {
  id: string;
  bookingId?: string;
  serviceBookingId?: string;
  guestUserId: number;
  subject: string;
  description: string;
  attachments?: string[];
  status: 'open' | 'under_review' | 'resolved_guest' | 'resolved_host' | 'dismissed';
  severity: 'minor' | 'moderate' | 'severe' | 'critical';
  resolution?: 'refund_full' | 'refund_partial' | 'release_to_host' | 'host_suspended' | 'host_archived';
  refundAmount: number;
  resolvedByUserId?: number;
  resolvedAt?: string;
  resolutionNote?: string;
  createdAt: string;
  guest?: { id: number; email: string; firstName?: string; lastName?: string };
  booking?: { id: string; propertyId?: string; property?: { id?: string; title: string; hostId: number } };
  serviceBooking?: { id: string; serviceId?: string; service?: { id?: string; title: any; providerId: number } };
}

export interface ReactivationQuote {
  debtTotal: number;
  penalty: number;
  total: number;
  currency: string;
  debts: Array<{
    id: string;
    amount: number;
    settledAmount: number;
    origin: string;
    description?: string;
    createdAt: string;
  }>;
}

const BASE = '/escrow';

export const escrowApi = {
  // Platform accounts
  listPlatformAccountsForGuests: () =>
    api.get<PlatformAccount[]>(`${BASE}/platform-accounts`).then((r) => r.data),
  listPlatformAccountsForReactivation: () =>
    api.get<PlatformAccount[]>(`${BASE}/platform-accounts/reactivation`,
      rbac('escrowApi.listPlatformAccountsForReactivation.GET')).then((r) => r.data),
  listAllPlatformAccounts: () =>
    api.get<PlatformAccount[]>(`${BASE}/platform-accounts/all`,
      rbac('escrowApi.listAllPlatformAccounts.GET')).then((r) => r.data),
  upsertPlatformAccount: (data: Partial<PlatformAccount>) =>
    api.post<PlatformAccount>(`${BASE}/platform-accounts`, data,
      rbac('escrowApi.upsertPlatformAccount.POST')).then((r) => r.data),
  deletePlatformAccount: (id: string) =>
    api.delete(`${BASE}/platform-accounts/${id}`, rbac('escrowApi.deletePlatformAccount.DELETE')),

  // Payouts
  listPayouts: (status?: string) =>
    api.get<HostPayout[]>(`${BASE}/payouts`, {
      ...rbac('escrowApi.listPayouts.GET'),
      params: status ? { status } : undefined,
    }).then((r) => r.data),

  // Disputes
  openDispute: (data: {
    bookingId?: string;
    serviceBookingId?: string;
    subject: string;
    description: string;
    severity?: 'minor' | 'moderate' | 'severe' | 'critical';
    attachments?: string[];
  }) =>
    api.post<BookingDispute>(`${BASE}/disputes`, data,
      rbac('escrowApi.openDispute.POST')).then((r) => r.data),
  listDisputes: (status?: string) =>
    api.get<BookingDispute[]>(`${BASE}/disputes`, {
      ...rbac('escrowApi.listDisputes.GET'),
      params: status ? { status } : undefined,
    }).then((r) => r.data),
  getDisputeRefundStatus: (id: string) =>
    api.get<{
      found: boolean;
      dispute?: BookingDispute;
      payout?: HostPayout;
      refundStage?: 'pending' | 'validated' | 'refunded' | 'partial' | 'rejected';
      refundAmount?: number;
    }>(`${BASE}/disputes/${id}/refund-status`,
      rbac('escrowApi.getDisputeRefundStatus.GET')).then((r) => r.data),
  resolveDispute: (id: string, body: {
    resolution: BookingDispute['resolution'];
    refundAmount?: number;
    note?: string;
  }) =>
    api.put<BookingDispute>(`${BASE}/disputes/${id}/resolve`, body,
      rbac('escrowApi.resolveDispute.PUT')).then((r) => r.data),

  // Reactivation
  getMyReactivationQuote: () =>
    api.get<ReactivationQuote>(`${BASE}/reactivation/quote`,
      rbac('escrowApi.getMyReactivationQuote.GET')).then((r) => r.data),
  getReactivationQuoteForHost: (hostId: number) =>
    api.get<ReactivationQuote>(`${BASE}/reactivation/quote/${hostId}`,
      rbac('escrowApi.getReactivationQuoteForHost.GET')).then((r) => r.data),
  confirmReactivation: (body: {
    hostUserId: number;
    method: 'transfer_receipt' | 'stripe';
    reference: string;
    amountPaid: number;
  }) =>
    api.post(`${BASE}/reactivation/confirm`, body,
      rbac('escrowApi.confirmReactivation.POST')).then((r) => r.data),
};
