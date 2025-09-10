import { getV2NotificationsApi } from '../../api';

const notificationsApi = getV2NotificationsApi();

export const paramsCreator = (
  query: Record<string, string | readonly string[]>
) => ({
  limit: +query.limit,
  offset: +query.offset,
  applicationIds: query.filterApplicationId as string[],
  eventTypeName: query.filterEventFilterName,
  bundleId: query.filterBundleId,
  sortBy: `${query.sortColumn || 'application'}:${
    query.sortDirection || 'ASC'
  }`,
});

export async function getEventTypes(config) {
  return await notificationsApi.getEventTypes(config);
}
