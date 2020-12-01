import { Rbac } from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';
import { useContext } from 'react';

import { Schemas } from '../generated/OpenapiIntegrations';

export interface AppContext {
    rbac: Rbac;
    applications: Array<Schemas.ApplicationFacet>
}

export const AppContext = React.createContext<AppContext>({
    rbac: {
        canReadAll: false,
        canWriteAll: false
    },
    applications: []
});

export const useAppContext = () => useContext(AppContext);
