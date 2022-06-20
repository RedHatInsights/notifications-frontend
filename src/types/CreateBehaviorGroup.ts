import { Action } from './Notification';

export interface CreateBehaviorGroup {
    name: string;
    actions: ReadonlyArray<Action>;
    events: ReadonlyArray<{
        id: string;
        name: string;
        applicationName: string;
    }>;
}
