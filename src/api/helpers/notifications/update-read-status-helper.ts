import { getNotificationsApi } from '../../api';

const notificationsApi = getNotificationsApi();

export async function updateNotificationReadStatus(config) {
  return await notificationsApi.updateNotificationReadStatus(config, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
