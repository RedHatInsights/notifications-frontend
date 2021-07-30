import './App.scss';

import { Maintenance, NotAuthorized } from '@redhat-cloud-services/frontend-components';
import { NotificationsPortal } from '@redhat-cloud-services/frontend-components-notifications';
import { AppSkeleton, toUtc } from '@redhat-cloud-services/insights-common-typescript';
import format from 'date-fns/format';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { useLocation } from 'react-router';

import Config from '../config/Config';
import messages from '../properties/DefinedMessages';
import { Routes } from '../Routes';
import { ServerStatus } from '../types/Server';
import { getSubApp } from '../utils/Basename';
import { AppContext } from './AppContext';
import { useApp } from './useApp';

const utcFormat = 'HH:mm';
const regularFormat = 'hh:mma';
const timezoneFormat = 'O';

const App: React.ComponentType = () => {
    const intl = useIntl();
    const { rbac, server, isOrgAdmin } = useApp();
    const location = useLocation();

    const serviceName = React.useMemo(() => {
        switch (getSubApp(location.pathname)) {
            case Config.integrations.subAppId:
                return intl.formatMessage(messages.integrations);
            case Config.notifications.subAppId:
                return intl.formatMessage(messages.notifications);
            default:
                return '';
        }
    }, [ intl, location.pathname ]);

    const hasReadPermissions = React.useMemo(() => {
        const appId = getSubApp(location.pathname);
        switch (appId) {
            case Config.integrations.subAppId:
                return rbac?.canReadIntegrationsEndpoints;
            case Config.notifications.subAppId:
                return rbac?.canReadNotifications;
        }

        return false;
    }, [ rbac, location.pathname ]);

    if (!rbac || !server) {
        return (
            <AppSkeleton />
        );
    }

    if (server.status === ServerStatus.MAINTENANCE) {

        const utcStartTime = format(toUtc(server.from), utcFormat);
        const utcEndTime = format(toUtc(server.to), utcFormat);
        const startTime = format(server.from, regularFormat);
        const endTime = format(server.to, regularFormat);
        const timezone = format(server.to, timezoneFormat);

        return <Maintenance
            utcStartTime={ utcStartTime }
            utcEndTime={ utcEndTime }
            startTime={ startTime }
            endTime={ endTime }
            timeZone={ timezone }
        />;
    }

    return (
        <AppContext.Provider value={ {
            rbac,
            server,
            isOrgAdmin: !!isOrgAdmin
        } }>
            { hasReadPermissions ? (
                <>
                    <NotificationsPortal />
                    <Routes />
                </>
            ) : (
                <NotAuthorized serviceName={ serviceName } />
            ) }
        </AppContext.Provider>
    );
};

export default App;
