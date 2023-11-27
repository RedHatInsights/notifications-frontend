// Wrapper for the NotificationPortal component to manually inject the store
// This is just a workaround, as the component is not (apparently) loading the store properly

import { NotificationPortal as NP } from '@redhat-cloud-services/frontend-components-notifications/NotificationPortal';
import * as React from 'react';
import { useStore } from 'react-redux';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AnyNotificationsPortal = NP as any;

export const NotificationsPortal: React.FunctionComponent = (props) => {
  const store = useStore();
  return <AnyNotificationsPortal store={store} {...props} />;
};
