import { api } from '@/lib/axios';
import { rbac } from '@/lib/api-rbac';

export interface EmailAnalytics {
  totalSent: number;
  totalDelivered: number;
  totalOpened: number;
  totalClicked: number;
  totalBounced: number;
  totalSpam: number;
  openRate: number;
  clickRate: number;
  ctr: number;
  botOpenRate: number;
  botClickRate: number;
  byTemplate: {
    templateName: string;
    sent: number;
    opened: number;
    clicked: number;
    openRate: number;
    ctr: number;
    role?: string;
    language?: string;
    invitationKind?: string;
  }[];
  byDay: {
    date: string;
    sent: number;
    opened: number;
    clicked: number;
    bounced: number;
  }[];
  topLinks: {
    originalUrl: string;
    linkTag: string;
    totalClicks: number;
    humanClicks: number;
    botClicks: number;
  }[];
  recentEvents: {
    id: string;
    messageId: string;
    eventType: string;
    recipientEmail: string;
    subject: string;
    templateName: string;
    clickedUrl: string;
    linkTag: string;
    isBot: boolean;
    botReason: string;
    jsVerified: boolean;
    metadata?: {
      invitationId?: string;
      invitationRole?: string;
      inviterRole?: string;
      language?: string;
      invitationKind?: string;
    };
    createdAt: string;
  }[];
}

export const emailTrackingApi = {
  getAnalytics: (days = 30) =>
    api.get<EmailAnalytics>(`/email-tracking/analytics?days=${days}`, rbac('emailTrackingApi.getAnalytics.GET')).then(r => r.data),
};
