import axiosInstance from 'config/axiosConfig';
import { NOTIFICATIONS_ROUTE } from 'constants/routes';
import { VIEW_TYPE } from 'constants/api';

class NotificationsApi {
  getNotifications(params, view: string, platform: number | null) {
    return axiosInstance().get(NOTIFICATIONS_ROUTE, {
      params: {
        ...params,
        view,
        platform
      }
    });
  }
  countUnreadNotifications(platform?: number | null, source?) {
    return axiosInstance().get(NOTIFICATIONS_ROUTE, { params: { view: VIEW_TYPE.COUNTER, platform }, cancelToken : source?.token});
  }

  getPreviewNotifications(view: string, platform?: number | null) {
    return axiosInstance().get(NOTIFICATIONS_ROUTE, { params: { view, platform } });
  }
}

export default NotificationsApi;
