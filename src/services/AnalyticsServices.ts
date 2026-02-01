// -----------------------------------------------------------------------------
// Analytics Services
// Migrated from old_app/src/services/IaServices.ts
// -----------------------------------------------------------------------------

import axios from 'axios';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface GoogleAnalyticsEvent {
  botId?: string;
  botName?: string;
  clientName?: string;
  eventLabelId?: string;
  eventValue?: string | number;
}

// -----------------------------------------------------------------------------
// Google Analytics
// -----------------------------------------------------------------------------

/**
 * Send event to Google Analytics
 */
export const setGoogleAnalytics = async (event: GoogleAnalyticsEvent): Promise<any> => {
  if (!event?.botId || !event?.botName) {
    return null;
  }

  const measurementId = 'G-9BM99TB86K';
  const apiSecret = 'wMHma0PpSje4vRq3SHiW5g';
  const url = `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`;
  
  const payload = {
    client_id: '333',
    non_personalized_ads: true,
    events: [
      {
        name: 'bot_event',
        params: {
          bot_id: event.botId,
          bot_name: event.botName,
          client_name: event.clientName,
          event_label_id: event.eventLabelId,
          event_value: event.eventValue
        }
      }
    ]
  };

  try {
    const { data } = await axios.post(url, payload);
    return data;
  } catch (error) {
    console.error('Google Analytics error:', error);
    return null;
  }
};

/**
 * Track page view
 */
export const trackPageView = async (pagePath: string, pageTitle?: string): Promise<void> => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'page_view', {
      page_path: pagePath,
      page_title: pageTitle
    });
  }
};

/**
 * Track custom event
 */
export const trackEvent = async (
  eventName: string, 
  eventParams?: Record<string, unknown>
): Promise<void> => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, eventParams);
  }
};
