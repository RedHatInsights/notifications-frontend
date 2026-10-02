export type NotificationData = {
  id: string;
  title: string;
  description: string;
  read: boolean;
  selected?: boolean;
  source: string;
  bundle: string;
  application?: string;
  created: string;
};

export type NotificationsPayload = {
  data: NotificationData;
  source: string;
  // cloud events sub protocol metadata
  datacontenttype: string;
  specversion: string;
  // a type field used to identify message purpose
  type: string;
  time: string;
};

export type NotificationDrawerState = {
  notificationData: NotificationData[];
  count: number;
  filters: string[]; // Bundle IDs (UUIDs)
  filterConfig: FilterConfigItem[];
  bundleIdToNameMap: Map<string, string>; // Maps bundle ID (UUID) to bundle name
  hasNotificationsPermissions: boolean;
  hasUnread: boolean;
  ready: boolean;
  initializing: boolean;
};

export interface FilterConfigItem {
  title: string; // Display name (e.g., "Red Hat Enterprise Linux")
  value: string; // Bundle ID (UUID)
}

export function isNotificationData(data: unknown): data is NotificationData {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'title' in data &&
    'description' in data &&
    'source' in data &&
    'created' in data
  );
}
