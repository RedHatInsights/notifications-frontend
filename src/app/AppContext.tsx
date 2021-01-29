import * as React from 'react';
import { useContext } from 'react';

import { Schemas } from '../generated/OpenapiIntegrations';

export interface AppContext {
    rbac: {
        canWriteIntegrationsEndpoints: boolean;
        canReadIntegrationsEndpoints: boolean;
        canWriteNotifications: boolean;
        canReadNotifications: boolean;
    };
    applications: Array<Schemas.ApplicationFacet>
}

export const AppContext = React.createContext<AppContext>({
    rbac: {
        canReadIntegrationsEndpoints: false,
        canReadNotifications: false,
        canWriteIntegrationsEndpoints: false,
        canWriteNotifications: false
    },
    applications: []
});

export const useAppContext = () => useContext(AppContext);
