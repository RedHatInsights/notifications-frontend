import React from 'react';
import { useLocation } from 'react-router-dom';

import { useAppContext } from '../app/AppContext';
import Config from '../config/Config';
import { linkTo } from '../Routes';
import { getSubApp } from '../utils/Basename';
import { NotAuthorizedPage } from './NotAuthorized';

export const CheckReadPermissions: React.FunctionComponent = (props) => {
    const { rbac } = useAppContext();
    const location = useLocation();

    const hasReadPermissions = React.useMemo(() => {
        const appId = getSubApp(location.pathname);
        switch (appId) {
            case Config.integrations.subAppId:
                return rbac?.canReadIntegrationsEndpoints;
            case Config.notifications.subAppId:
                if (location.pathname === linkTo.eventLog()) {
                    return rbac?.canReadEvents;
                }

                return rbac?.canReadNotifications;
        }

        return false;
    }, [ rbac, location ]);
    return (
        <>
            { !hasReadPermissions ? <NotAuthorizedPage /> : props.children }
        </>
    );
};
