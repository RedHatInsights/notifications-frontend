
import './App.scss';

import { Bullseye, Spinner } from '@patternfly/react-core';
import * as React from 'react';

import { NotificationsPortal } from '../components/Store/NotificationsPortal';
import IntegrationsList from '../pages/Integrations/List/List';
import { AppContext } from './AppContext';
import { RbacGroupContextProvider } from './rbac/RbacGroupContextProvider';
import { useApp } from './useApp';

const IntegrationsApp: React.ComponentType = () => {

    const { rbac, server, isOrgAdmin } = useApp();

    return (rbac && server) ?
        <AppContext.Provider value={ {
            rbac,
            server,
            isOrgAdmin: !!isOrgAdmin
        } }>
            <RbacGroupContextProvider>
                <NotificationsPortal />
                <IntegrationsList />
            </RbacGroupContextProvider>
        </AppContext.Provider>
        :
        <Bullseye>
            <Spinner size='xl' />
        </Bullseye>
    ;
};

export default IntegrationsApp;
