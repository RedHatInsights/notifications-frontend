import React from 'react';

import { useApp } from '../app/useApp';
import Config from '../config/Config';
import { ConnectedIntegrationsListPage } from '../pages/Integrations/List/Page';
import { NotificationsListPage } from '../pages/Notifications/List/Page';
import { getSubApp } from '../utils/Basename';
import { NotAuthorizedPage } from './NotAuthorized';

export const CheckReadPermissions: React.FunctionComponent = () => {
    const { rbac } = useApp();

    const hasReadPermissions = React.useMemo(() => {
        const appId = getSubApp(location.pathname);
        switch (appId) {
            case Config.integrations.subAppId:
                return rbac?.canReadIntegrationsEndpoints;
            case Config.notifications.subAppId:
                return rbac?.canReadNotifications;
        }

        return false;
    }, [ rbac ]);

    return (
        <>
            { !hasReadPermissions ?
                (<NotAuthorizedPage />) :
                <><NotificationsListPage />
                    <ConnectedIntegrationsListPage /></>

            }
        </>
    );
};
