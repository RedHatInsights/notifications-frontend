import * as React from 'react';
import { useContext } from 'react';

import { Server, ServerStatus } from '../types/Server';

export interface AppContext {
    rbac: {
        canWriteIntegrationsEndpoints: boolean;
        canReadIntegrationsEndpoints: boolean;
        canWriteNotifications: boolean;
        canReadNotifications: boolean;
    },
    isOrgAdmin: boolean,
    server: Server
}

export const AppContext = React.createContext<AppContext>({
    rbac: {
        canReadIntegrationsEndpoints: false,
        canReadNotifications: false,
        canWriteIntegrationsEndpoints: false,
        canWriteNotifications: false
    },
    isOrgAdmin: false,
    server: {
        status: ServerStatus.RUNNING
    }
});

export const useAppContext = () => useContext(AppContext);
