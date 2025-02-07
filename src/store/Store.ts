import { notifications } from '@redhat-cloud-services/frontend-components-notifications/redux/reducers/notifications';
import { PortalNotificationConfig } from '@redhat-cloud-services/frontend-components-notifications/Portal';
import { getRegistry } from '@redhat-cloud-services/frontend-components-utilities/Registry';
import { Middleware } from 'redux';
import promiseMiddleware from 'redux-promise-middleware';

import {
  INITIAL_STATE as SNS_INITIAL_STATE,
  SavedNotificationScopeReducer,
} from './reducers/SavedNotificationScopeReducer';
import { SavedNotificationScopeState } from './types/SavedNotificationScopeTypes';

type State = {
  savedNotificationScope: SavedNotificationScopeState;
  notifications: PortalNotificationConfig[] | undefined;
};

export const getNotificationsRegistry = (...middleware: Middleware[]) => {
  const registry = getRegistry<State>(
    {
      savedNotificationScope: SNS_INITIAL_STATE,
      notifications: undefined,
    },
    [promiseMiddleware(), ...middleware]
  );

  registry.register({
    savedNotificationScope: SavedNotificationScopeReducer,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    notifications: notifications as any,
  });

  return registry;
};
