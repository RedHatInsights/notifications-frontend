import './App.scss';

import * as React from 'react';

import { RouteComponentProps, useLocation, withRouter } from 'react-router';

import { AppContext } from './AppContext';
import { AppSkeleton } from '@redhat-cloud-services/insights-common-typescript';
import Config from '../config/Config';
import { NotAuthorized } from '@redhat-cloud-services/frontend-components';
import { NotificationsPortal } from '@redhat-cloud-services/frontend-components-notifications';
import { Routes } from '../Routes';
import { getSubApp } from '../utils/Basename';
import messages from '../properties/DefinedMessages';
import { useApp } from './useApp';
import { useIntl } from 'react-intl';

const App: React.FunctionComponent<RouteComponentProps> = () => {
    const intl = useIntl();
    const { rbac } = useApp();
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
