import { getNotificationsApi } from '../../api';

const notificationsApi = getNotificationsApi();

export async function getBundleFacets(config) {
  return await notificationsApi.getBundleFacets(config);
}
