import { getNotificationsApi } from '../../api';

const notificationsApi = getNotificationsApi();

export async function getEventTypes(config) {
  return await notificationsApi.getEventTypes(config);
}
