import { getNotificationsApi } from '../../api';

const notificationsApi = getNotificationsApi();

export async function getTimeConfig() {
  return await notificationsApi.getTimePreference();
}

export async function setTimeConfig(time: string) {
  return await notificationsApi.putTimePreference({ body: time });
}
