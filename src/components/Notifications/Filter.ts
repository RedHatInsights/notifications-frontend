import { ClearFilters, Filters, SetFilters } from '../../types/Filters';

export enum NotificationFilterColumn {
    NAME = 'name'
}

export type NotificationFilters = Filters<typeof NotificationFilterColumn>;
export type SetNotificationFilters = SetFilters<typeof NotificationFilterColumn>;
export type ClearNotificationFilters = ClearFilters<typeof NotificationFilterColumn>;
