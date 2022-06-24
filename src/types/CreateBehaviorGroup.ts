import { Action, EventType } from './Notification';

export interface CreateBehaviorGroup {
    name: string;
    actions: ReadonlyArray<Action>;
    events: ReadonlyArray<EventType>;
}
