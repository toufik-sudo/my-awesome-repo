import { api } from '@/lib/axios';

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
    createdAt: string;
  }[];
}

export const emailTrackingApi = {
  getAnalytics: (days = 30) =>
    api.get<EmailAnalytics>(`/email-tracking/analytics?days=${days}`).then(r => r.data),
};
