import React from 'react';

import { useApp } from '../app/useApp';
import Config from '../config/Config';
import { getSubApp } from '../utils/Basename';
import { NotAuthorizedPage } from './NotAuthorized';

export const CheckReadPermissions: React.FunctionComponent = (props) => {
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
            { !hasReadPermissions ? <NotAuthorizedPage /> : { props } }
        </>
    );
};
