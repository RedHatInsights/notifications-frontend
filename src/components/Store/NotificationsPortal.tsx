// Wrapper for the NotificationPortal component to manually inject the store
// This is just a workaround, as the component is not (apparently) loading the store properly

import { NotificationsPortal as NP } from '@redhat-cloud-services/frontend-components-notifications';
import * as React from 'react';
import { useStore } from 'react-redux';

const AnyNotificationsPortal = NP as any;

export const NotificationsPortal: React.FunctionComponent = (props) => {
    const store = useStore();
    return <AnyNotificationsPortal store={ store } { ...props } />;
};
