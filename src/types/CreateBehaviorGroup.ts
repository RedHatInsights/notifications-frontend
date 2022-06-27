import { Action, EventType } from './Notification';

export interface CreateBehaviorGroup {
    displayName: string;
    actions: ReadonlyArray<Action>;
    events: ReadonlyArray<EventType>;
}
