/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
import axiosInstance from 'config/axiosConfig';

/**
 * Method adds the authorization token and decoded token to cookies
 *
 * @param authorization
 */
export const setGoogleAnalytics = async (obj: any) => {
  if (obj && obj.botId && obj.botName) {
    const measurement_id = "G-9BM99TB86K";
    const api_secret = "wMHma0PpSje4vRq3SHiW5g";
    const url = `https://www.google-analytics.com/mp/collect?&measurement_id=${measurement_id}&api_secret=${api_secret}`;
    //The data you want to send via POST
    const payload = {
      client_id: "333",
      non_personalized_ads: true,
      events: [
        {
          name: "bot_event",
          params: {
            bot_id: obj["botId"],
            bot_name: obj["botName"],
            client_name: obj["clientName"],
            event_label_id: obj["eventLabelId"],
            event_value: obj["eventValue"]
          }
        }
      ]
    };
    const { data } = await axiosInstance().post(url, payload);
    // console.log(data);
    return data;
  }
  return null;
};