import { getNotificationsApi } from '../../api';
import { ensureUtcTimestamp } from '../../../utils/dateUtils';
import { NotificationData } from '../../../types/Drawer';

const notificationsApi = getNotificationsApi();

export interface GetDrawerEntriesConfig {
  limit?: number;
  sort_by?: string;
  startDate?: string;
  endDate?: string;
  offset?: number;
  pageNumber?: number;
  appIds?: Set<string>;
  bundleIds?: Set<string>;
  eventTypeIds?: Set<string>;
  readStatus?: boolean;
}

interface DrawerEntriesResponse {
  data: NotificationData[];
}

export async function getDrawerEntries(
  config: GetDrawerEntriesConfig
): Promise<DrawerEntriesResponse> {
  const response = await notificationsApi.getDrawerEntries(config);

  // Normalize timestamps: backend sends LocalDateTime without 'Z' suffix,
  // but they're UTC. Append 'Z' so JavaScript Date parsing is correct.
  if (response.data) {
    response.data = response.data.map((notification: NotificationData) => ({
      ...notification,
      created: ensureUtcTimestamp(notification.created),
    }));
  }

  return response as DrawerEntriesResponse;
}
