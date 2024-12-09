import { Action, EventType } from './Notification';

export interface CreateBehaviorGroup {
  id?: string;
  displayName: string;
  actions: ReadonlyArray<Action>;
  events: ReadonlyArray<EventType>;
}
