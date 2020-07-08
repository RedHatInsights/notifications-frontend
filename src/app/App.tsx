import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { NotAuthorized } from '@redhat-cloud-services/frontend-components';
import { NotificationsPortal } from '@redhat-cloud-services/frontend-components-notifications';

import './App.scss';

import { Routes } from '../Routes';
import { AppSkeleton } from '@redhat-cloud-services/insights-common-typescript';

import { AppContext } from './AppContext';
import { useApp } from './useApp';

const App: React.FunctionComponent<RouteComponentProps> = () => {

    const { rbac } = useApp();

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
                <NotAuthorized/>
            ) }
        </AppContext.Provider>
    );
};

export default withRouter(App);
