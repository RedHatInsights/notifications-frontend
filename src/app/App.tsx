import * as React from 'react';
import { RouteComponentProps, withRouter, useLocation } from 'react-router';
import { NotAuthorized } from '@redhat-cloud-services/frontend-components';
import { NotificationsPortal } from '@redhat-cloud-services/frontend-components-notifications';

import './App.scss';

import { Routes } from '../Routes';
import { AppSkeleton } from '@redhat-cloud-services/insights-common-typescript';
import { AppContext } from './AppContext';
import { useApp } from './useApp';
import { Messages } from '../properties/Messages';
import { getSubApp } from '../utils/Basename';
import Config from '../config/Config';

const App: React.FunctionComponent<RouteComponentProps> = () => {

    const { rbac } = useApp();
    const location = useLocation();

    const serviceName = React.useMemo(() => {
        switch (getSubApp(location.pathname)) {
            case Config.integrations.subAppId:
                return Messages.appNameIntegrations;
            case Config.notifications.subAppId:
                return Messages.appName;
            default:
                return '';
        }
    }, [ location ]);

    if (!rbac) {
        return (
            <AppSkeleton/>
        );
    }

    return (
        <AppContext.Provider value={ {
            rbac
        } }>
            { rbac.canReadAll ? (
                <>
                    <NotificationsPortal/>
                    <Routes/>
                </>
            ) : (
                <NotAuthorized serviceName={ serviceName } />
            ) }
        </AppContext.Provider>
    );
};

export default withRouter(App);
