export type NotificationData = {
  id: string;
  title: string;
  description: string;
  read: boolean;
  selected?: boolean;
  source: string;
  bundle: string;
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
  filters: string[];
  filterConfig: FilterConfigItem[];
  hasNotificationsPermissions: boolean;
  hasUnread: boolean;
  ready: boolean;
  initializing: boolean;
};

export interface FilterConfigItem {
  title: string;
  value: string;
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
