import { IntegrationRef } from '../../types/Notification';

export enum Status {
    LOADING,
    DONE
}

export type SavedNotificationScopeState = {
    integration: IntegrationRef;
    status: Status;
} | null;
