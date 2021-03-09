import * as React from 'react';
import { useContext } from 'react';

export interface AppContext {
    rbac: {
        canWriteIntegrationsEndpoints: boolean;
        canReadIntegrationsEndpoints: boolean;
        canWriteNotifications: boolean;
        canReadNotifications: boolean;
    }
}

export const AppContext = React.createContext<AppContext>({
    rbac: {
        canReadIntegrationsEndpoints: false,
        canReadNotifications: false,
        canWriteIntegrationsEndpoints: false,
        canWriteNotifications: false
    }
});

export const useAppContext = () => useContext(AppContext);
