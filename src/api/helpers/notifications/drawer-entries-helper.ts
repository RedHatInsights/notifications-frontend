import { getNotificationsApi } from '../../api';

const notificationsApi = getNotificationsApi();

export async function getDrawerEntries(config) {
  return await notificationsApi.getDrawerEntries(config);
}
