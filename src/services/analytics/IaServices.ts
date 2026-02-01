import axiosInstance from '@/config/axiosConfig';

interface AnalyticsEventParams {
  botId: string;
  botName: string;
  clientName?: string;
  eventLabelId?: string;
  eventValue?: string;
}

/**
 * Method sends analytics event to Google Analytics
 *
 * @param obj Analytics event parameters
 */
export const setGoogleAnalytics = async (obj: AnalyticsEventParams | null): Promise<any> => {
  if (obj && obj.botId && obj.botName) {
    const measurement_id = "G-9BM99TB86K";
    const api_secret = "wMHma0PpSje4vRq3SHiW5g";
    const url = `https://www.google-analytics.com/mp/collect?&measurement_id=${measurement_id}&api_secret=${api_secret}`;
    
    const payload = {
      client_id: "333",
      non_personalized_ads: true,
      events: [
        {
          name: "bot_event",
          params: {
            bot_id: obj.botId,
            bot_name: obj.botName,
            client_name: obj.clientName,
            event_label_id: obj.eventLabelId,
            event_value: obj.eventValue
          }
        }
      ]
    };
    
    try {
      const { data } = await axiosInstance().post(url, payload);
      return data;
    } catch (error) {
      console.error('Failed to send analytics event:', error);
      return null;
    }
  }
  return null;
};
