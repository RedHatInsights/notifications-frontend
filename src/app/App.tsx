import './App.scss';

import { NotAuthorized } from '@redhat-cloud-services/frontend-components';
import { NotificationsPortal } from '@redhat-cloud-services/frontend-components-notifications';
import { AppSkeleton } from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { RouteComponentProps, useLocation, withRouter } from 'react-router';

import Config from '../config/Config';
import messages from '../properties/DefinedMessages';
import { Routes } from '../Routes';
import { getSubApp } from '../utils/Basename';
import { AppContext } from './AppContext';
import { useApp } from './useApp';

const App: React.FunctionComponent<RouteComponentProps> = () => {
    const intl = useIntl();
    const { rbac, applications } = useApp();
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

    if (!rbac || !applications) {
        return (
            <AppSkeleton />
        );
    }

    return (
        <AppContext.Provider value={ {
            rbac,
            applications
        } }>
            { rbac.canReadAll ? (
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

export default withRouter(App);
